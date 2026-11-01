const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null represents overall monthly budget
    },
    month: {
      type: String,
      required: [true, "Month in YYYY-MM format is required"],
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"],
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      validate: {
        validator: Number.isInteger,
        message: "Limit must be an integer representing the smallest currency unit",
      },
      min: [0, "Limit cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// Unique index: a user can only have one budget per category per month (and one overall budget where categoryId is null)
budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
