const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  { name: "Food", color: "#EF4444", icon: "utensils", isDefault: true },
  { name: "Transport", color: "#3B82F6", icon: "car", isDefault: true },
  { name: "Rent", color: "#F59E0B", icon: "home", isDefault: true },
  { name: "Utilities", color: "#10B981", icon: "bolt", isDefault: true },
  { name: "Shopping", color: "#EC4899", icon: "shopping-bag", isDefault: true },
  { name: "Health", color: "#06B6D4", icon: "heart-pulse", isDefault: true },
  { name: "Entertainment", color: "#8B5CF6", icon: "film", isDefault: true },
  { name: "Education", color: "#6366F1", icon: "book-open", isDefault: true },
  { name: "Other", color: "#6B7280", icon: "more-horizontal", isDefault: true },
];

const seedDefaultCategories = async () => {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { userId: null, name: cat.name },
        { $setOnInsert: cat },
        { upsert: true, new: true },
      );
    }
  } catch (err) {
    console.error("Failed to seed default categories:", err.message);
  }
};

module.exports = {
  DEFAULT_CATEGORIES,
  seedDefaultCategories,
};
