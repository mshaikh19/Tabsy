const Category = require("../models/Category");
const { AppError } = require("../middleware/error.middleware");

const getCategories = async (userId, includeArchived = false) => {
  const query = {
    $or: [{ userId }, { userId: null }],
  };

  if (!includeArchived) {
    query.isArchived = { $ne: true };
  }

  // Sort default categories first, then user categories alphabetically
  return Category.find(query).sort({ isDefault: -1, name: 1 });
};

const createCategory = async (userId, { name, color, icon }) => {
  // Check if category already exists for user (case insensitive)
  const existing = await Category.findOne({
    $or: [{ userId }, { userId: null }],
    name: { $regex: new RegExp(`^${name}$`, "i") },
    isArchived: false,
  });

  if (existing) {
    throw new AppError(`Category '${name}' already exists`, 409, "CATEGORY_EXISTS");
  }

  const category = new Category({
    userId,
    name,
    color: color || "#6366F1",
    icon: icon || "tag",
    isDefault: false,
    isArchived: false,
  });

  return category.save();
};

const updateCategory = async (userId, categoryId, updateData) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");
  }

  // Cannot modify system default categories
  if (category.isDefault || !category.userId) {
    throw new AppError("Default categories cannot be modified or archived", 403, "FORBIDDEN");
  }

  // Ensure category belongs to requesting user
  if (category.userId.toString() !== userId.toString()) {
    throw new AppError("You do not have permission to modify this category", 403, "FORBIDDEN");
  }

  if (updateData.name && updateData.name !== category.name) {
    const existing = await Category.findOne({
      _id: { $ne: categoryId },
      $or: [{ userId }, { userId: null }],
      name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
      isArchived: false,
    });

    if (existing) {
      throw new AppError(`Category '${updateData.name}' already exists`, 409, "CATEGORY_EXISTS");
    }
    category.name = updateData.name;
  }

  if (updateData.color !== undefined) category.color = updateData.color;
  if (updateData.icon !== undefined) category.icon = updateData.icon;
  if (updateData.isArchived !== undefined) category.isArchived = updateData.isArchived;

  return category.save();
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
};
