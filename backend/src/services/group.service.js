const crypto = require("crypto");
const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Expense = require("../models/Expense");
const Activity = require("../models/Activity");
const User = require("../models/User");
const { AppError } = require("../middleware/error.middleware");
const balanceService = require("./balance.service");

const generateInviteCode = (name = "") => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
  const suffix = crypto.randomBytes(3).toString("hex");
  return slug ? `${slug}-${suffix}` : suffix;
};

const canManage = (member) =>
  member && ["organizer", "admin"].includes(member.role) && member.status === "active";

const listGroups = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);

  const groups = await Group.find({ _id: { $in: groupIds } })
    .sort({ updatedAt: -1 })
    .lean();

  const result = [];
  for (const g of groups) {
    const groupId = g._id.toString();
    const [members, expenses, expenseAgg] = await Promise.all([
      GroupMember.find({ groupId: g._id, status: "active" })
        .populate("userId", "name avatarEmoji")
        .lean(),
      Expense.find({ groupId: g._id, status: "active" })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate("paidBy", "name")
        .lean(),
      Expense.aggregate([
        { $match: { groupId: g._id, status: "active" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const total = expenseAgg.length ? expenseAgg[0].total : 0;
    const myMember = members.find((m) => m.userId._id.toString() === userId.toString());
    const latest = expenseAvg(members);
    result.push({
      ...g,
      totalSpend: total,
      memberCount: members.length,
      myRole: myMember ? myMember.role : null,
      myNet: myMember ? myMember.net : 0,
      myShare: myMember ? myMember.totalConsumed : 0,
      myPaid: myMember ? myMember.totalPaid : 0,
      members: members.map((m) => ({
        id: m.userId._id.toString(),
        name: m.userId.name,
        avatarEmoji: m.userId.avatarEmoji,
        role: m.role,
        net: m.net,
      })),
      latestExpense: expenseAvg(expenses),
    });
  }

  return result;
};

const expenseAvg = (arr) => arr; // helper passthrough to keep shape predictable

const getGroup = async (userId, groupId) => {
  const membership = await GroupMember.findOne({
    groupId,
    userId,
    status: "active",
  }).lean();
  if (!membership) {
    throw new AppError("Group not found or you are not a member", 404, "GROUP_NOT_FOUND");
  }

  const group = await Group.findById(groupId).lean();
  if (!group) {
    throw new AppError("Group not found", 404, "GROUP_NOT_FOUND");
  }

  const [members, expenseAgg, expenses, plan] = await Promise.all([
    GroupMember.find({ groupId, status: "active" })
      .populate("userId", "name email avatarEmoji handle")
      .lean(),
    Expense.aggregate([
      { $match: { groupId: group._id, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.find({ groupId, status: "active" })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("paidBy", "name avatarEmoji")
      .lean(),
    balanceService.getSettlementPlan(groupId),
  ]);

  const totalSpend = expenseAgg.length ? expenseAgg[0].total : 0;

  return {
    ...group,
    totalSpend,
    expenseCount: await Expense.countDocuments({ groupId, status: "active" }),
    members: members.map((m) => ({
      id: m.userId._id.toString(),
      name: m.userId.name,
      email: m.userId.email,
      avatarEmoji: m.userId.avatarEmoji,
      role: m.role,
      totalPaid: m.totalPaid,
      totalConsumed: m.totalConsumed,
      net: m.net,
    })),
    recentExpenses: expenses,
    settlementPlan: plan,
  };
};

const createGroup = async (userId, data) => {
  const members = Array.isArray(data.members) ? data.members : [];

  const group = await Group.create({
    name: data.name,
    icon: data.icon || "🧾",
    category: data.category || "Other",
    description: data.description || "",
    location: data.location || "",
    coords: data.coords || { lat: null, lon: null },
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    currency: (data.currency || "INR").toUpperCase(),
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdBy: userId,
    inviteCode: generateInviteCode(data.name),
    requireApproval: !!data.requireApproval,
    splitModel: data.splitModel || "equal",
    nettingEnabled: data.nettingEnabled !== false,
    subsidiesEnabled: data.subsidiesEnabled !== false,
    pennyPolicy: data.pennyPolicy || "highest",
    budgetCap: data.budgetCap != null ? Number(data.budgetCap) : null,
    privacy: data.privacy || "public",
    passcode: data.passcode || null,
  });

  // Creator is always an organizer member
  await GroupMember.create({
    groupId: group._id,
    userId,
    role: "organizer",
    status: "active",
  });

  // Additional members invited by email -> resolve to existing users or mark pending
  for (const m of members) {
    if (!m || !m.email) continue;
    if (m.email.toLowerCase() === "") continue;
    const existing = await User.findOne({ email: m.email.toLowerCase() }).lean();
    const role = ["organizer", "admin", "member", "view-only"].includes(m.role)
      ? m.role
      : "member";
    if (existing && existing._id.toString() !== userId.toString()) {
      await GroupMember.create({
        groupId: group._id,
        userId: existing._id,
        role: role === "organizer" ? "admin" : role,
        status: group.requireApproval ? "pending" : "active",
        invitedBy: userId,
      });
    }
  }

  await Activity.create({
    groupId: group._id,
    userId,
    type: "group_created",
    title: `${group.name} created`,
    description: group.description || "",
  });

  return getGroup(userId, group._id);
};

const updateGroup = async (userId, groupId, updateData) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!canManage(membership)) {
    throw new AppError("You do not have permission to update this group", 403, "FORBIDDEN");
  }

  const allowed = {};
  const fields = [
    "name",
    "icon",
    "category",
    "description",
    "location",
    "coords",
    "currency",
    "tags",
    "requireApproval",
    "splitModel",
    "nettingEnabled",
    "subsidiesEnabled",
    "pennyPolicy",
    "budgetCap",
    "privacy",
    "passcode",
    "autoApproveMembers",
    "freezeLedger",
    "receiptMandatory",
    "receiptThreshold",
    "approvalGate",
    "approvalThreshold",
    "reminderCadence",
    "deliveryChannels",
  ];
  fields.forEach((f) => {
    if (updateData[f] !== undefined) allowed[f] = updateData[f];
  });
  if (updateData.startDate !== undefined) {
    allowed.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
  }
  if (updateData.endDate !== undefined) {
    allowed.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
  }
  if (allowed.currency) allowed.currency = allowed.currency.toUpperCase();

  const group = await Group.findByIdAndUpdate(groupId, allowed, {
    new: true,
    runValidators: true,
  });
  if (!group) {
    throw new AppError("Group not found", 404, "GROUP_NOT_FOUND");
  }

  await Activity.create({
    groupId,
    userId,
    type: "group_updated",
    title: `${group.name} settings updated`,
    description: "",
  });

  return getGroup(userId, groupId);
};

const deleteGroup = async (userId, groupId) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!canManage(membership)) {
    throw new AppError("Only organizers/admins can disband a group", 403, "FORBIDDEN");
  }
  await Promise.all([
    Group.findByIdAndDelete(groupId),
    GroupMember.deleteMany({ groupId }),
    Expense.deleteMany({ groupId }),
    Activity.deleteMany({ groupId }),
  ]);
  return { message: "Group disbanded successfully" };
};

const listMembers = async (userId, groupId) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!membership) {
    throw new AppError("Group not found or you are not a member", 404, "GROUP_NOT_FOUND");
  }
  await balanceService.recomputeGroupBalances(groupId);
  const members = await GroupMember.find({ groupId, status: "active" })
    .populate("userId", "name email avatarEmoji handle")
    .lean();
  return members.map((m) => ({
    id: m.userId._id.toString(),
    name: m.userId.name,
    email: m.userId.email,
    avatarEmoji: m.userId.avatarEmoji,
    handle: m.userId.handle,
    role: m.role,
    totalPaid: m.totalPaid,
    totalConsumed: m.totalConsumed,
    net: m.net,
  }));
};

const addMembers = async (userId, groupId, data) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!canManage(membership)) {
    throw new AppError("You do not have permission to add members", 403, "FORBIDDEN");
  }

  const emails = Array.isArray(data.members)
    ? data.members.map((m) => (typeof m === "string" ? m : m.email)).filter(Boolean)
    : [];

  const added = [];
  for (const raw of emails) {
    const email = String(raw).toLowerCase().trim();
    const existing = await User.findOne({ email }).lean();
    if (!existing) {
      // Unknown user: cannot create membership yet; report as skipped
      added.push({ email, status: "not_registered" });
      continue;
    }
    const already = await GroupMember.findOne({ groupId, userId: existing._id }).lean();
    if (already) {
      added.push({ email, status: "already_member" });
      continue;
    }
    await GroupMember.create({
      groupId,
      userId: existing._id,
      role: "member",
      status: "active",
      invitedBy: userId,
    });
    added.push({ email, status: "added", userId: existing._id.toString() });

    await Activity.create({
      groupId,
      userId,
      type: "member_added",
      title: `${existing.name} joined the group`,
      description: "",
    });
  }

  return { added, members: await listMembers(userId, groupId) };
};

const updateMemberRole = async (userId, groupId, targetUserId, role) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!canManage(membership)) {
    throw new AppError("You do not have permission to change roles", 403, "FORBIDDEN");
  }
  const target = await GroupMember.findOneAndUpdate(
    { groupId, userId: targetUserId },
    { $set: { role } },
    { new: true },
  );
  if (!target) {
    throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
  }
  return listMembers(userId, groupId);
};

const removeMember = async (userId, groupId, targetUserId) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!canManage(membership)) {
    throw new AppError("You do not have permission to remove members", 403, "FORBIDDEN");
  }
  if (targetUserId.toString() === userId.toString()) {
    throw new AppError("You cannot remove yourself; use leave instead", 400, "CANNOT_REMOVE_SELF");
  }
  await GroupMember.findOneAndUpdate(
    { groupId, userId: targetUserId },
    { $set: { status: "removed" } },
  );
  await balanceService.recomputeGroupBalances(groupId);
  return listMembers(userId, groupId);
};

const leaveGroup = async (userId, groupId) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!membership) {
    throw new AppError("You are not a member of this group", 403, "NOT_A_MEMBER");
  }

  if (membership.role === "organizer") {
    const other = await GroupMember.findOne({
      groupId,
      userId: { $ne: userId },
      role: { $in: ["admin", "organizer", "member"] },
      status: "active",
    })
      .sort({ createdAt: 1 })
      .lean();
    if (!other) {
      // Last member leaving -> disband
      await deleteGroup(userId, groupId);
      return { message: "You were the last member; the group was disbanded" };
    }
    await GroupMember.findByIdAndUpdate(other._id, { $set: { role: "organizer" } });
  }

  await GroupMember.findOneAndUpdate(
    { groupId, userId },
    { $set: { status: "removed" } },
  );
  await balanceService.recomputeGroupBalances(groupId);

  return { message: "You have left the group" };
};

const joinByInvite = async (userId, code) => {
  const group = await Group.findOne({ inviteCode: code }).lean();
  if (!group) {
    throw new AppError("Invalid invite link", 404, "INVALID_INVITE");
  }
  const existing = await GroupMember.findOne({ groupId: group._id, userId }).lean();
  if (existing) {
    if (existing.status === "removed") {
      await GroupMember.findByIdAndUpdate(existing._id, { $set: { status: "active", joinedAt: new Date() } });
    }
  } else {
    await GroupMember.create({
      groupId: group._id,
      userId,
      role: "member",
      status: group.requireApproval ? "pending" : "active",
      invitedBy: group.createdBy,
    });
  }
  return getGroup(userId, group._id);
};

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  listMembers,
  addMembers,
  updateMemberRole,
  removeMember,
  leaveGroup,
  joinByInvite,
};