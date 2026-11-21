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
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleIdToken = async (idToken) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AppError("Google OAuth not configured", 500, "OAUTH_NOT_CONFIGURED");
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

const loginWithGoogle = async (credential) => {
  const payload = await verifyGoogleIdToken(credential);
  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name;
  const picture = payload.picture;

  let user = await User.findOne({ "oauth.googleId": googleId });

  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      user.oauth.googleId = googleId;
      if (picture && !user.avatarUrl) user.avatarUrl = picture;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        "oauth.googleId": googleId,
        avatarUrl: picture,
        isEmailVerified: true,
      });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

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
  const GroupMember = require("../models/GroupMember");
  await Promise.all([
    Transaction.deleteMany({ userId }),
    Category.deleteMany({ userId }),
    Budget.deleteMany({ userId }),
    RecurringRule.deleteMany({ userId }),
    GroupMember.deleteMany({ userId }),
    User.findByIdAndDelete(userId),
  ]);

  return { message: "Account and all associated data deleted successfully" };
};

const crypto = require("crypto");

/**
 * Initiate password reset. In a real deployment this would email a reset link.
 * For this project we return the token in the response (dev-friendly).
 */
const forgotPassword = async ({ destination }) => {
  const email = String(destination || "").toLowerCase().trim();
  const user = await User.findOne({ email });
  if (!user) {
    // Do not reveal whether the email exists
    return { message: "If an account exists, a reset link has been sent", devToken: null };
  }

  const token = crypto.randomBytes(24).toString("hex");
  user.passwordReset = {
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
  };
  await user.save();

  return {
    message: "Password reset initiated",
    devToken: process.env.NODE_ENV !== "production" ? token : undefined,
  };
};

const resetPassword = async ({ token, newPassword }) => {
  if (!token) {
    throw new AppError("Reset token is required", 400, "TOKEN_REQUIRED");
  }
  const user = await User.findOne({ "passwordReset.token": token });
  if (!user || !user.passwordReset || user.passwordReset.expiresAt < new Date()) {
    throw new AppError("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.passwordReset = { token: null, expiresAt: null };
  // Revoke all existing sessions on password reset
  user.refreshTokens = [];
  await user.save();

  return { message: "Password has been reset. Please log in again." };
};

/**
 * Email verification: generates a 6-digit OTP (returned in dev).
 */
const sendEmailVerification = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (user.emailVerified) {
    return { message: "Email already verified", devOtp: null };
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.emailOtp = { code: otp, expiresAt: new Date(Date.now() + 1000 * 60 * 10) };
  await user.save();
  return {
    message: "Verification code generated",
    devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
  };
};

const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email: String(email || "").toLowerCase().trim() });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (!user.emailOtp || !user.emailOtp.code || user.emailOtp.expiresAt < new Date()) {
    throw new AppError("Invalid or expired verification code", 400, "INVALID_OTP");
  }
  if (String(otp) !== user.emailOtp.code) {
    throw new AppError("Incorrect verification code", 400, "INVALID_OTP");
  }
  user.emailVerified = true;
  user.emailOtp = { code: null, expiresAt: null };
  await user.save();
  return { message: "Email verified successfully", user: user.toJSON() };
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  loginWithGoogle,
};
