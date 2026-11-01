const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: Number.isInteger,
        message: "Amount must be an integer representing the smallest currency unit (e.g. cents/paise)",
      },
      min: [1, "Amount must be at least 1"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank", "other"],
      default: "cash",
    },
    note: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
    recurringRuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecurringRule",
      default: null,
    },
    receiptUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes as specified in PRD Section 9
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
