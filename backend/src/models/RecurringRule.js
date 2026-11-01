const mongoose = require("mongoose");

const recurringRuleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    templateTransaction: {
      type: {
        type: String,
        enum: ["expense", "income"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        validate: {
          validator: Number.isInteger,
          message: "Amount must be an integer representing the smallest currency unit",
        },
        min: 1,
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
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
      },
    },
    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: [true, "Frequency is required"],
    },
    nextRunDate: {
      type: Date,
      required: [true, "Next run date is required"],
      index: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RecurringRule", recurringRuleSchema);
