const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
const { AppError } = require("../middleware/error.middleware");

/**
 * Recompute per-member balance aggregates (totalPaid, totalConsumed, net) for a group
 * from its active expenses, and persist them onto GroupMember documents.
 */
const recomputeGroupBalances = async (groupId) => {
  const [members, expenses] = await Promise.all([
    GroupMember.find({ groupId, status: "active" }).lean(),
    Expense.find({ groupId, status: "active" }).lean(),
  ]);

  const paidMap = new Map();
  const consumedMap = new Map();

  members.forEach((m) => {
    paidMap.set(m.userId.toString(), 0);
    consumedMap.set(m.userId.toString(), 0);
  });

  expenses.forEach((exp) => {
    const payerKey = exp.paidBy.toString();
    paidMap.set(payerKey, (paidMap.get(payerKey) || 0) + exp.amount);

    (exp.participants || []).forEach((p) => {
      const key = p.userId.toString();
      consumedMap.set(key, (consumedMap.get(key) || 0) + p.amount);
    });
  });

  const bulkOps = members.map((m) => {
    const key = m.userId.toString();
    const totalPaid = paidMap.get(key) || 0;
    const totalConsumed = consumedMap.get(key) || 0;
    return {
      updateOne: {
        filter: { _id: m._id },
        update: {
          $set: {
            totalPaid,
            totalConsumed,
            net: totalPaid - totalConsumed,
          },
        },
      },
    };
  });

  if (bulkOps.length) {
    await GroupMember.bulkWrite(bulkOps);
  }

  return members.map((m) => {
    const key = m.userId.toString();
    const totalPaid = paidMap.get(key) || 0;
    const totalConsumed = consumedMap.get(key) || 0;
    return {
      ...m,
      totalPaid,
      totalConsumed,
      net: totalPaid - totalConsumed,
    };
  });
};

/**
 * Compute the net balance map for a group: { userId: netAmount }.
 * Positive => is owed money. Negative => owes money.
 */
const getGroupBalanceMap = async (groupId) => {
  const members = await recomputeGroupBalances(groupId);
  const map = {};
  members.forEach((m) => {
    map[m.userId.toString()] = m.net;
  });
  return map;
};

/**
 * Simplify debts into a minimal set of direct transfers (greedy min-cash-flow).
 * Returns array of { from, to, amount } using userId strings.
 */
const simplifyDebts = (balanceMap) => {
  const debtors = [];
  const creditors = [];

  Object.entries(balanceMap).forEach(([userId, net]) => {
    if (net < 0) debtors.push({ userId, amount: -net });
    else if (net > 0) creditors.push({ userId, amount: net });
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    if (pay > 0) {
      transfers.push({ from: debtors[i].userId, to: creditors[j].userId, amount: pay });
    }
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount <= 0) i += 1;
    if (creditors[j].amount <= 0) j += 1;
  }

  return transfers;
};

/**
 * Build a full settlement plan for a group, enriching transfers with member details.
 */
const getSettlementPlan = async (groupId) => {
  const balanceMap = await getGroupBalanceMap(groupId);
  const transfers = simplifyDebts(balanceMap);

  const userIds = new Set();
  transfers.forEach((t) => {
    userIds.add(t.from);
    userIds.add(t.to);
  });

  const members = await GroupMember.find({
    groupId,
    userId: { $in: Array.from(userIds).map((id) => new (require("mongoose").Types.ObjectId)(id)) },
  })
    .populate("userId", "name email avatarEmoji handle")
    .lean();

  const userMap = {};
  members.forEach((m) => {
    userMap[m.userId._id.toString()] = m.userId;
  });

  return transfers.map((t) => ({
    from: userMap[t.from] || { _id: t.from },
    to: userMap[t.to] || { _id: t.to },
    amount: t.amount,
  }));
};

/**
 * Aggregate a user's net position across every group they belong to.
 */
const getUserNetPosition = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);

  const groups = await Group.find({ _id: { $in: groupIds } }).select("name icon currency").lean();
  const groupMap = {};
  groups.forEach((g) => {
    groupMap[g._id.toString()] = g;
  });

  let owedToYou = 0;
  let youOwe = 0;
  const circles = [];

  for (const m of memberships) {
    const group = groupMap[m.groupId.toString()];
    if (!group) continue;
    const balanceMap = await getGroupBalanceMap(m.groupId);
    const net = balanceMap[userId.toString()] || 0;
    if (net > 0) owedToYou += net;
    else if (net < 0) youOwe += -net;
    circles.push({
      id: group._id.toString(),
      name: group.name,
      icon: group.icon,
      currency: group.currency,
      net,
    });
  }

  return {
    net: owedToYou - youOwe,
    owedToYou,
    youOwe,
    circles,
  };
};

/**
 * Aggregate a user's net position within a single group.
 */
const getUserGroupPosition = async (userId, groupId) => {
  const member = await GroupMember.findOne({ groupId, userId, status: "active" }).lean();
  if (!member) {
    throw new AppError("You are not a member of this group", 403, "NOT_A_MEMBER");
  }
  const balanceMap = await getGroupBalanceMap(groupId);
  const net = balanceMap[userId.toString()] || 0;
  return {
    net,
    owedToYou: net > 0 ? net : 0,
    youOwe: net < 0 ? -net : 0,
  };
};

/**
 * Build a per-peer settlement matrix for a user within a group.
 */
const getGroupPeerMatrix = async (userId, groupId) => {
  const balanceMap = await getGroupBalanceMap(groupId);
  const transfers = simplifyDebts(balanceMap);

  const memberDocs = await GroupMember.find({ groupId, status: "active" })
    .populate("userId", "name email avatarEmoji handle")
    .lean();

  const userMap = {};
  memberDocs.forEach((m) => {
    userMap[m.userId._id.toString()] = m.userId;
  });

  const debts = [];
  const receivables = [];

  transfers.forEach((t) => {
    if (t.to === userId.toString()) {
      const u = userMap[t.from];
      receivables.push({
        id: t.from,
        name: u ? u.name : "Member",
        initials: u ? initials(u.name) : "?",
        amount: t.amount,
      });
    } else if (t.from === userId.toString()) {
      const u = userMap[t.to];
      debts.push({
        id: t.to,
        name: u ? u.name : "Member",
        initials: u ? initials(u.name) : "?",
        amount: t.amount,
      });
    }
  });

  return { debts, receivables };
};

const initials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

module.exports = {
  recomputeGroupBalances,
  getGroupBalanceMap,
  simplifyDebts,
  getSettlementPlan,
  getUserNetPosition,
  getUserGroupPosition,
  getGroupPeerMatrix,
};