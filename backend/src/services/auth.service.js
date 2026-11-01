const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const Budget = require("../models/Budget");
const RecurringRule = require("../models/RecurringRule");
const { AppError } = require("../middleware/error.middleware");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

const register = async ({ name, email, password, currency }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409, "EMAIL_ALREADY_EXISTS");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    passwordHash,
    currency: currency ? currency.toUpperCase() : "INR",
    refreshTokens: [],
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Keep up to 5 concurrent sessions per user
  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401, "REFRESH_TOKEN_REQUIRED");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 401, "USER_NOT_FOUND");
  }

  const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
  if (!tokenExists) {
    // Invalidate all tokens for this user if token reuse/theft detected
    user.refreshTokens = [];
    await user.save();
    throw new AppError("Refresh token revoked or invalid", 401, "TOKEN_REVOKED");
  }

  const newAccessToken = generateAccessToken(user);
  return {
    accessToken: newAccessToken,
    user: user.toJSON(),
  };
};

const logout = async (userId, refreshToken) => {
  if (!userId) return;
  const user = await User.findById(userId);
  if (user && refreshToken) {
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    await user.save();
  }
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  return user.toJSON();
};

const updateProfile = async (userId, updateData) => {
  const allowedUpdates = {};
  if (updateData.name) allowedUpdates.name = updateData.name;
  if (updateData.currency) allowedUpdates.currency = updateData.currency;

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user.toJSON();
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  // Delete all associated records as per PRD Privacy requirements
  await Promise.all([
    Transaction.deleteMany({ userId }),
    Category.deleteMany({ userId }),
    Budget.deleteMany({ userId }),
    RecurringRule.deleteMany({ userId }),
    User.findByIdAndDelete(userId),
  ]);

  return { message: "Account and all associated data deleted successfully" };
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
};
