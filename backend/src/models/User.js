const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    passwordHash: {
      type: String,
      required: false,
    },
    oauth: {
      googleId: { type: String, default: null, sparse: true, index: true },
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    avatarEmoji: {
      type: String,
      default: "🥑",
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
      trim: true,
    },
    handle: {
      type: String,
      trim: true,
      default: "",
      lowercase: true,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    useCases: {
      type: [String],
      default: [],
    },
    defaultSplitMode: {
      type: String,
      enum: ["equal", "itemized", "round"],
      default: "equal",
    },
    notificationPreferences: {
      expense: { type: Boolean, default: true },
      settlement: { type: Boolean, default: true },
      recap: { type: Boolean, default: true },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    passwordReset: {
      token: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshTokens;
  delete user.emailOtp;
  delete user.passwordReset;
  return user;
};

module.exports = mongoose.model("User", userSchema);
