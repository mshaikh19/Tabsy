const Settlement = require("../models/Settlement");
const GroupMember = require("../models/GroupMember");
const Activity = require("../models/Activity");
const { AppError } = require("../middleware/error.middleware");

const assertMember = async (groupId, userId) => {
  const member = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!member) {
    throw new AppError("You are not a member of this group", 403, "NOT_A_MEMBER");
  }
  return member;
};

const listSettlements = async (userId, groupId) => {
  await assertMember(groupId, userId);
  const settlements = await Settlement.find({ groupId })
    .sort({ createdAt: -1 })
    .populate("fromUser", "name avatarEmoji")
    .populate("toUser", "name avatarEmoji")
    .lean();
  return settlements;
};

const createSettlement = async (userId, groupId, data) => {
  await assertMember(groupId, userId);

  const settlement = await Settlement.create({
    groupId,
    fromUser: data.fromUser,
    toUser: data.toUser,
    amount: data.amount,
    currency: data.currency || "INR",
    method: data.method || "manual",
    status: data.status || "pending",
    note: data.note || "",
    createdBy: userId,
  });

  await Activity.create({
    groupId,
    userId,
    type: "settlement_made",
    title: "Settlement recorded",
    description: data.note || "",
    amount: data.amount,
  });

  return settlement;
};

const updateSettlement = async (userId, settlementId, data) => {
  const settlement = await Settlement.findById(settlementId);
  if (!settlement) {
    throw new AppError("Settlement not found", 404, "SETTLEMENT_NOT_FOUND");
  }

  // Only participants in this settlement or an admin can update
  const isParticipant =
    settlement.fromUser.toString() === userId.toString() ||
    settlement.toUser.toString() === userId.toString();
  if (!isParticipant) {
    const membership = await GroupMember.findOne({
      groupId: settlement.groupId,
      userId,
      status: "active",
    }).lean();
    if (!membership || !["organizer", "admin"].includes(membership.role)) {
      throw new AppError("You cannot modify this settlement", 403, "FORBIDDEN");
    }
  }

  if (data.status !== undefined) {
    settlement.status = data.status;
    if (data.status === "paid") settlement.settledAt = new Date();
  }
  if (data.method !== undefined) settlement.method = data.method;
  if (data.note !== undefined) settlement.note = data.note;
  if (data.amount !== undefined) settlement.amount = data.amount;

  await settlement.save();

  await Activity.create({
    groupId: settlement.groupId,
    userId,
    type: "settlement_made",
    title: "Settlement updated",
    description: `Status: ${settlement.status}`,
    amount: settlement.amount,
  });

  return settlement;
};

/**
 * Record a settlement and mark it paid in one call.
 */
const settleDebt = async (userId, groupId, data) => {
  await assertMember(groupId, userId);
  const settlement = await Settlement.create({
    groupId,
    fromUser: data.fromUser,
    toUser: data.toUser,
    amount: data.amount,
    currency: data.currency || "INR",
    method: data.method || "manual",
    status: "paid",
    note: data.note || "",
    settledAt: new Date(),
    createdBy: userId,
  });
  await Activity.create({
    groupId,
    userId,
    type: "settlement_made",
    title: "Debt settled",
    description: data.note || "",
    amount: data.amount,
  });
  return settlement;
};

module.exports = {
  listSettlements,
  createSettlement,
  updateSettlement,
  settleDebt,
};