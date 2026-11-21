const GroupMember = require("../models/GroupMember");
const Expense = require("../models/Expense");
const Group = require("../models/Group");
const Notification = require("../models/Notification");
const balanceService = require("./balance.service");

const getOverview = async (userId) => {
  const [netPosition, pendingNotifications, groupCount] = await Promise.all([
    balanceService.getUserNetPosition(userId),
    Notification.countDocuments({ userId, read: false }),
    GroupMember.countDocuments({ userId, status: "active" }),
  ]);

  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);

  const expenseAgg = await Expense.aggregate([
    { $match: { groupId: { $in: groupIds }, status: "active" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const activePoolSpend = expenseAgg.length ? expenseAgg[0].total : 0;

  return {
    netPosition: netPosition.net,
    youOwe: netPosition.youOwe,
    owedToYou: netPosition.owedToYou,
    activePoolSpend,
    groupsCount: groupCount,
    pendingNotifications,
    circles: netPosition.circles,
  };
};

const getTabs = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);
  const groups = await Group.find({ _id: { $in: groupIds } }).sort({ updatedAt: -1 }).lean();

  const result = [];
  for (const g of groups) {
    const groupId = g._id.toString();
    const [members, expenseAgg, myMember] = await Promise.all([
      GroupMember.find({ groupId: g._id, status: "active" })
        .populate("userId", "name avatarEmoji")
        .lean(),
      Expense.aggregate([
        { $match: { groupId: g._id, status: "active" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      GroupMember.findOne({ groupId: g._id, userId, status: "active" }).lean(),
    ]);
    const poolTotal = expenseAgg.length ? expenseAgg[0].total : 0;
    const net = myMember ? myMember.net : 0;
    result.push({
      id: groupId,
      name: g.name,
      icon: g.icon,
      category: g.category,
      currency: g.currency,
      memberCount: members.length,
      startDate: g.startDate,
      endDate: g.endDate,
      poolTotal,
      netPosition: net,
      myShare: myMember ? myMember.totalConsumed : 0,
      myPaid: myMember ? myMember.totalPaid : 0,
      members: members.map((m) => ({
        id: m.userId._id.toString(),
        name: m.userId.name,
        avatarEmoji: m.userId.avatarEmoji,
      })),
    });
  }
  return result;
};

const getGraphPlan = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);
  const groups = await Group.find({ _id: { $in: groupIds } })
    .select("name icon currency")
    .lean();
  const groupMap = {};
  groups.forEach((g) => {
    groupMap[g._id.toString()] = g;
  });

  const transfers = [];
  for (const m of memberships) {
    const gid = m.groupId.toString();
    const plan = await balanceService.getSettlementPlan(gid);
    plan.forEach((t) => {
      if (
        t.from._id.toString() === userId.toString() ||
        t.to._id.toString() === userId.toString()
      ) {
        transfers.push({
          groupId: gid,
          groupName: groupMap[gid] ? groupMap[gid].name : "Group",
          currency: groupMap[gid] ? groupMap[gid].currency : "INR",
          from: { id: t.from._id.toString(), name: t.from.name, avatarEmoji: t.from.avatarEmoji },
          to: { id: t.to._id.toString(), name: t.to.name, avatarEmoji: t.to.avatarEmoji },
          amount: t.amount,
        });
      }
    });
  }

  return { transfers, totalTransfers: transfers.length };
};

const getLiveFeed = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).select("groupId").lean();
  const groupIds = memberships.map((m) => m.groupId);

  const expenses = await Expense.find({ groupId: { $in: groupIds }, status: "active" })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("paidBy", "name avatarEmoji")
    .populate("groupId", "name icon")
    .lean();

  const myId = userId.toString();
  return expenses.map((e) => {
    const myShare = (e.participants || []).find((p) => p.userId.toString() === myId);
    const isPayer = e.paidBy && e.paidBy._id.toString() === myId;
    let impact = 0;
    let label = "";
    if (isPayer) {
      impact = e.amount - (myShare ? myShare.amount : 0);
      label = impact >= 0 ? "Owed to you" : "You owe";
    } else {
      impact = -(myShare ? myShare.amount : 0);
      label = "Your share";
    }
    return {
      id: e._id.toString(),
      title: e.title,
      amount: e.amount,
      yourShare: myShare ? myShare.amount : 0,
      impact,
      impactLabel: label,
      paidBy: e.paidBy ? e.paidBy.name : "Unknown",
      group: e.groupId ? e.groupId.name : "",
      groupIcon: e.groupId ? e.groupId.icon : "",
      category: e.category,
      createdAt: e.createdAt,
    };
  });
};

module.exports = {
  getOverview,
  getTabs,
  getGraphPlan,
  getLiveFeed,
};