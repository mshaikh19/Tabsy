const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "groupId is required"],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    role: {
      type: String,
      enum: ["organizer", "admin", "member", "view-only"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "pending", "removed"],
      default: "active",
      index: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalConsumed: {
      type: Number,
      default: 0,
      min: 0,
    },
    net: {
      type: Number,
      default: 0,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("GroupMember", groupMemberSchema);