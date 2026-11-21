const Expense = require("../models/Expense");
const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/error.middleware");
const balanceService = require("./balance.service");

const assertMember = async (groupId, userId) => {
  const member = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!member) {
    throw new AppError("You are not a member of this group", 403, "NOT_A_MEMBER");
  }
  return member;
};

const roundAmount = (value) => Math.max(0, Math.round(value));

/**
 * Compute participant shares for an expense.
 * amount: total in minor units (integer)
 * splitMode: equal | weighted | itemized | percentage
 * participants: [{ userId, weight?, amount?, percent? }]
 * Returns participants enriched with { amount, percent } and validates sum === total.
 */
const computeShares = (amount, splitMode, rawParticipants) => {
  const participants = (rawParticipants || []).map((p) => ({
    userId: p.userId.toString(),
    weight: p.weight != null ? Number(p.weight) : 1,
    amount: p.amount != null ? roundAmount(p.amount) : null,
    percent: p.percent != null ? Number(p.percent) : null,
  }));

  if (!participants.length) {
    throw new AppError("At least one participant is required", 400, "NO_PARTICIPANTS");
  }

  let shares = [];

  if (splitMode === "equal" || !splitMode) {
    const base = Math.floor(amount / participants.length);
    let remainder = amount - base * participants.length;
    shares = participants.map((p) => {
      const extra = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder -= 1;
      return { ...p, amount: base + extra };
    });
  } else if (splitMode === "weighted") {
    const totalWeight = participants.reduce((s, p) => s + (p.weight || 0), 0);
    if (totalWeight <= 0) {
      throw new AppError("Total weight must be greater than 0", 400, "INVALID_WEIGHT");
    }
    const rawShares = participants.map((p) => (amount * (p.weight || 0)) / totalWeight);
    shares = participants.map((p, i) => ({ ...p, amount: Math.floor(rawShares[i]) }));
    let distributed = shares.reduce((s, p) => s + p.amount, 0);
    let remainder = amount - distributed;
    // Distribute remainder cents by largest fractional part
    const order = rawShares
      .map((v, i) => ({ i, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < remainder; k += 1) {
      shares[order[k % order.length].i].amount += 1;
    }
    distributed = shares.reduce((s, p) => s + p.amount, 0);
  } else if (splitMode === "percentage") {
    const totalPercent = participants.reduce((s, p) => s + (p.percent || 0), 0);
    if (Math.abs(totalPercent - 100) > 0.01) {
      throw new AppError("Percentages must total 100%", 400, "INVALID_PERCENT");
    }
    shares = participants.map((p) => ({ ...p, amount: roundAmount((amount * (p.percent || 0)) / 100) }));
    const sum = shares.reduce((s, p) => s + p.amount, 0);
    if (sum !== amount && shares.length) {
      shares[0].amount += amount - sum;
    }
  } else if (splitMode === "itemized") {
    const provided = participants.reduce((s, p) => s + (p.amount || 0), 0);
    if (provided !== amount) {
      throw new AppError(
        `Itemized amounts must sum to the total (${provided} !== ${amount})`,
        400,
        "INVALID_ITEMIZED",
      );
    }
    shares = participants.map((p) => ({ ...p, amount: p.amount }));
  } else {
    throw new AppError("Unsupported split mode", 400, "INVALID_SPLIT_MODE");
  }

  const totalAllocated = shares.reduce((s, p) => s + p.amount, 0);
  if (totalAllocated !== amount) {
    throw new AppError(
      `Allocated shares (${totalAllocated}) do not match the total (${amount})`,
      400,
      "SPLIT_MISMATCH",
    );
  }

  return shares.map((p) => ({
    ...p,
    percent: amount > 0 ? (p.amount / amount) * 100 : 0,
  }));
};

const listExpenses = async (userId, groupId, query = {}) => {
  await assertMember(groupId, userId);
  const { page = 1, limit = 30, category, paidBy, search } = query;
  const filter = { groupId, status: "active" };
  if (category) filter.category = category;
  if (paidBy) filter.paidBy = paidBy;
  if (search && search.trim()) filter.title = { $regex: search.trim(), $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .sort({ expenseDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("paidBy", "name avatarEmoji")
      .lean(),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const getExpense = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, status: "active" })
    .populate("paidBy", "name avatarEmoji")
    .populate("groupId", "name icon currency")
    .lean();
  if (!expense) {
    throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
  }
  const membership = await GroupMember.findOne({
    groupId: expense.groupId._id,
    userId,
    status: "active",
  }).lean();
  if (!membership) {
    throw new AppError("You are not a member of this expense's group", 403, "NOT_A_MEMBER");
  }
  return expense;
};

const createExpense = async (userId, groupId, data) => {
  await assertMember(groupId, userId);
  const group = await Group.findById(groupId).lean();
  if (!group) throw new AppError("Group not found", 404, "GROUP_NOT_FOUND");
  if (group.freezeLedger) {
    throw new AppError("This group's ledger is frozen", 403, "LEDGER_FROZEN");
  }

  const amount = roundAmount(data.amount);
  const participants = computeShares(amount, data.splitMode, data.participants);

  const expense = await Expense.create({
    groupId,
    title: data.title,
    merchant: data.merchant || "",
    amount,
    currency: (data.currency || group.currency || "INR").toUpperCase(),
    category: data.category || "Other",
    paidBy: data.paidBy || userId,
    splitMode: data.splitMode || "equal",
    participants,
    notes: data.notes || "",
    expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
    receipt: {
      url: data.receiptUrl || null,
      filename: data.receiptFilename || null,
      hash: data.receiptHash || null,
    },
    createdBy: userId,
  });

  await balanceService.recomputeGroupBalances(groupId);
  await expense.populate("paidBy", "name avatarEmoji");

  await Activity.create({
    groupId,
    userId,
    type: "expense_added",
    title: `${data.title} added`,
    description: `${amount} split ${data.splitMode || "equal"}`,
    amount,
    yourShare: (participants.find((p) => p.userId === userId.toString()) || {}).amount || null,
    meta: { expenseId: expense._id.toString(), category: expense.category },
  });

  // Notify other participants
  const otherIds = participants
    .map((p) => p.userId)
    .filter((id) => id !== userId.toString());
  if (otherIds.length) {
    await Notification.insertMany(
      otherIds.map((uid) => ({
        userId: uid,
        groupId,
        type: "expense_added",
        title: `New expense: ${data.title}`,
        message: `Added by you in ${group.name}`,
        amount,
        actionUrl: `/expense-details?id=${expense._id}`,
      })),
    );
  }

  return expense;
};

const updateExpense = async (userId, expenseId, data) => {
  const expense = await Expense.findOne({ _id: expenseId, status: "active" });
  if (!expense) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");

  const membership = await GroupMember.findOne({
    groupId: expense.groupId,
    userId,
    status: "active",
  }).lean();
  const isPayer = expense.paidBy.toString() === userId.toString();
  const isManager = membership && ["organizer", "admin"].includes(membership.role);
  if (!isPayer && !isManager) {
    throw new AppError("Only the payer or an admin can edit this expense", 403, "FORBIDDEN");
  }

  if (data.amount !== undefined) expense.amount = roundAmount(data.amount);
  if (data.title !== undefined) expense.title = data.title;
  if (data.merchant !== undefined) expense.merchant = data.merchant;
  if (data.category !== undefined) expense.category = data.category;
  if (data.paidBy !== undefined) expense.paidBy = data.paidBy;
  if (data.notes !== undefined) expense.notes = data.notes;
  if (data.expenseDate !== undefined) expense.expenseDate = new Date(data.expenseDate);
  if (data.receiptUrl !== undefined) expense.receipt.url = data.receiptUrl;

  const splitMode = data.splitMode || expense.splitMode;
  const participants = data.participants || expense.participants;
  expense.splitMode = splitMode;
  expense.participants = computeShares(expense.amount, splitMode, participants);

  await expense.save();
  await balanceService.recomputeGroupBalances(expense.groupId);

  await Activity.create({
    groupId: expense.groupId,
    userId,
    type: "expense_updated",
    title: `${expense.title} updated`,
    description: "",
    amount: expense.amount,
  });

  return expense.populate("paidBy", "name avatarEmoji");
};

const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, status: "active" });
  if (!expense) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");

  const membership = await GroupMember.findOne({
    groupId: expense.groupId,
    userId,
    status: "active",
  }).lean();
  const isPayer = expense.paidBy.toString() === userId.toString();
  const isManager = membership && ["organizer", "admin"].includes(membership.role);
  if (!isPayer && !isManager) {
    throw new AppError("Only the payer or an admin can delete this expense", 403, "FORBIDDEN");
  }

  expense.status = "deleted";
  await expense.save();
  await balanceService.recomputeGroupBalances(expense.groupId);

  await Activity.create({
    groupId: expense.groupId,
    userId,
    type: "expense_deleted",
    title: `${expense.title} deleted`,
    description: "",
    amount: expense.amount,
  });

  return { message: "Expense deleted successfully" };
};

/**
 * Cross-group expense feed for the /expenses page.
 */
const listAllUserExpenses = async (userId, query = {}) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).select("groupId").lean();
  const groupIds = memberships.map((m) => m.groupId);
  const filter = { groupId: { $in: groupIds }, status: "active" };
  if (query.groupId) filter.groupId = query.groupId;
  if (query.category) filter.category = query.category;
  if (query.search && query.search.trim()) {
    filter.title = { $regex: query.search.trim(), $options: "i" };
  }

  const expenses = await Expense.find(filter)
    .sort({ expenseDate: -1, createdAt: -1 })
    .populate("paidBy", "name avatarEmoji")
    .populate("groupId", "name icon")
    .lean();

  return expenses;
};

const updateExpenseParticipants = async (userId, expenseId, participants) => {
  const expense = await Expense.findOne({ _id: expenseId, status: "active" });
  if (!expense) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
  expense.participants = computeShares(expense.amount, expense.splitMode, participants);
  await expense.save();
  await balanceService.recomputeGroupBalances(expense.groupId);
  return expense;
};

module.exports = {
  computeShares,
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  listAllUserExpenses,
  updateExpenseParticipants,
};