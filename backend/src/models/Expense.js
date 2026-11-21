const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    weight: {
      type: Number,
      default: 1,
      min: 0,
    },
    amount: {
      type: Number,
      required: [true, "Share amount is required"],
      min: 0,
    },
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { _id: false },
);

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "groupId is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    merchant: {
      type: String,
      trim: true,
      default: "",
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
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "paidBy is required"],
      index: true,
    },
    splitMode: {
      type: String,
      enum: ["equal", "weighted", "itemized", "percentage"],
      default: "equal",
    },
    participants: {
      type: [participantSchema],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
    expenseDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    receipt: {
      url: { type: String, default: null },
      filename: { type: String, default: null },
      hash: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ groupId: 1, status: 1, expenseDate: -1 });

module.exports = mongoose.model("Expense", expenseSchema);