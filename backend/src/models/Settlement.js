const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "groupId is required"],
      index: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "fromUser is required"],
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "toUser is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ["venmo", "apple_pay", "zelle", "bank", "cash", "other", "manual"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["pending", "requested", "paid"],
      default: "pending",
      index: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    settledAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

settlementSchema.index({ groupId: 1, status: 1 });

module.exports = mongoose.model("Settlement", settlementSchema);