const User = require("../models/User");
const GroupMember = require("../models/GroupMember");
const Group = require("../models/Group");
const { AppError } = require("../middleware/error.middleware");

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return user.toJSON();
};

const updateProfile = async (userId, updateData) => {
  const allowed = {};
  const fields = [
    "name",
    "currency",
    "avatarEmoji",
    "avatarUrl",
    "handle",
    "useCases",
    "defaultSplitMode",
  ];
  fields.forEach((f) => {
    if (updateData[f] !== undefined) allowed[f] = updateData[f];
  });
  if (allowed.currency) allowed.currency = allowed.currency.toUpperCase();

  const user = await User.findByIdAndUpdate(userId, allowed, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return user.toJSON();
};

const updatePreferences = async (userId, prefs) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  if (prefs.defaultSplitMode) user.defaultSplitMode = prefs.defaultSplitMode;
  if (prefs.notificationPreferences) {
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...prefs.notificationPreferences,
    };
  }
  await user.save();
  return user.toJSON();
};

const completeOnboarding = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  if (Array.isArray(data.useCases)) user.useCases = data.useCases;
  if (data.avatarEmoji) user.avatarEmoji = data.avatarEmoji;
  if (data.avatarUrl) user.avatarUrl = data.avatarUrl;
  if (data.displayName) user.name = data.displayName;
  if (data.handle) user.handle = data.handle;
  if (data.currency) user.currency = String(data.currency).toUpperCase();
  if (data.defaultSplitMode) user.defaultSplitMode = data.defaultSplitMode;
  if (data.notificationPreferences) {
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...data.notificationPreferences,
    };
  }
  user.onboardingComplete = true;
  await user.save();
  return user.toJSON();
};

/**
 * Frequent peers: users who share groups with the requesting user.
 */
const listPeers = async (userId) => {
  const memberships = await GroupMember.find({ userId, status: "active" }).lean();
  const groupIds = memberships.map((m) => m.groupId);
  const coMembers = await GroupMember.find({
    groupId: { $in: groupIds },
    userId: { $ne: userId },
    status: "active",
  }).lean();

  const peerMap = new Map();
  coMembers.forEach((m) => {
    const key = m.userId.toString();
    peerMap.set(key, (peerMap.get(key) || 0) + 1);
  });

  const peerIds = Array.from(peerMap.keys());
  const users = await User.find({ _id: { $in: peerIds } })
    .select("name email avatarEmoji handle")
    .lean();

  return users
    .map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      avatarEmoji: u.avatarEmoji,
      handle: u.handle,
      sharedGroups: peerMap.get(u._id.toString()),
    }))
    .sort((a, b) => b.sharedGroups - a.sharedGroups);
};

/**
 * Lightweight user search for member invites.
 */
const searchUsers = async (userId, query) => {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim();
  const users = await User.find({
    _id: { $ne: userId },
    $or: [
      { email: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
      { handle: { $regex: q, $options: "i" } },
    ],
  })
    .select("name email avatarEmoji handle")
    .limit(20)
    .lean();

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    avatarEmoji: u.avatarEmoji,
    handle: u.handle,
  }));
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  completeOnboarding,
  listPeers,
  searchUsers,
};