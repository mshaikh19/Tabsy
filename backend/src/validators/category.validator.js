const { z } = require("zod");

const createCategorySchema = {
  body: z.object({
    name: z.string().min(1, "Category name is required").max(50, "Max 50 characters").trim(),
    color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Valid hex color required").optional().default("#6366F1"),
    icon: z.string().max(30).optional().default("tag"),
  }),
};

const updateCategorySchema = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
  }),
  body: z.object({
    name: z.string().min(1, "Category name cannot be empty").max(50).trim().optional(),
    color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Valid hex color required").optional(),
    icon: z.string().max(30).optional(),
    isArchived: z.boolean().optional(),
  }),
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
