const { z } = require("zod");

const getBudgetsQuerySchema = {
  query: z.object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"),
  }),
};

const upsertBudgetSchema = {
  body: z.object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID").optional().nullable(),
    limit: z.number().int("Limit must be an integer").min(0, "Limit cannot be negative"),
  }),
};

const batchUpsertBudgetsSchema = {
  body: z.object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format"),
    overallLimit: z.number().int().min(0).optional().nullable(),
    categoryBudgets: z.array(
      z.object({
        categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
        limit: z.number().int().min(0),
      }),
    ).optional(),
  }),
};

module.exports = {
  getBudgetsQuerySchema,
  upsertBudgetSchema,
  batchUpsertBudgetsSchema,
};
