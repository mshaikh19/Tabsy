const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    color: {
      type: String,
      default: "#6366F1",
      trim: true,
    },
    icon: {
      type: String,
      default: "tag",
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index so a user cannot have two active categories with the exact same name
categorySchema.index({ userId: 1, name: 1 }, { unique: false });

module.exports = mongoose.model("Category", categorySchema);
