const Activity = require("../models/Activity");
const GroupMember = require("../models/GroupMember");
const Expense = require("../models/Expense");
const { AppError } = require("../middleware/error.middleware");

const listUserActivity = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).select("groupId").lean();
  const groupIds = memberships.map((m) => m.groupId);

  const items = await Activity.find({
    $or: [{ userId }, { groupId: { $in: groupIds } }],
  })
    .sort({ createdAt: -1 })
    .populate("userId", "name avatarEmoji")
    .populate("groupId", "name icon")
    .lean();

  return { items };
};

const listGroupActivity = async (userId, groupId) => {
  const membership = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!membership) {
    throw new AppError("Group not found or you are not a member", 404, "GROUP_NOT_FOUND");
  }

  const [items, expenseAgg] = await Promise.all([
    Activity.find({ groupId })
      .sort({ createdAt: -1 })
      .populate("userId", "name avatarEmoji")
      .lean(),
    Expense.aggregate([
      { $match: { groupId: new (require("mongoose").Types.ObjectId)(groupId), status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    items,
    totalVolume: expenseAgg.length ? expenseAgg[0].total : 0,
  };
};

module.exports = {
  listUserActivity,
  listGroupActivity,
};