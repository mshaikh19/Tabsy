const { z } = require("zod");

const createTransactionSchema = {
  body: z.object({
    type: z.enum(["expense", "income"], {
      errorMap: () => ({ message: "Type must be either 'expense' or 'income'" }),
    }),
    amount: z.number().int("Amount must be an integer (in smallest unit, e.g. cents/paise)").positive("Amount must be greater than 0"),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
    date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    paymentMethod: z.enum(["cash", "card", "upi", "bank", "other"]).optional().default("cash"),
    note: z.string().max(500, "Note cannot exceed 500 characters").optional().default(""),
    receiptUrl: z.string().url("Invalid receipt URL").optional().nullable(),
  }),
};

const updateTransactionSchema = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Transaction ID format"),
  }),
  body: z.object({
    type: z.enum(["expense", "income"]).optional(),
    amount: z.number().int("Amount must be an integer").positive("Amount must be greater than 0").optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format").optional(),
    date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    paymentMethod: z.enum(["cash", "card", "upi", "bank", "other"]).optional(),
    note: z.string().max(500).optional(),
    receiptUrl: z.string().url("Invalid receipt URL").optional().nullable(),
  }),
};

const getTransactionsQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    type: z.enum(["expense", "income"]).optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    minAmount: z.coerce.number().int().min(0).optional(),
    maxAmount: z.coerce.number().int().min(0).optional(),
    search: z.string().optional(),
    sortBy: z.enum(["date", "amount", "createdAt"]).optional().default("date"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
};

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsQuerySchema,
};
