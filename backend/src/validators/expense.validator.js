const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const currency = z
  .string()
  .length(3, "Currency code must be 3 letters")
  .transform((v) => v.toUpperCase());

const participantInput = z.object({
  userId: objectId,
  weight: z.number().min(0).optional(),
  amount: z.number().min(0).optional(),
  percent: z.number().min(0).max(100).optional(),
});

const createExpenseSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    merchant: z.string().max(200).optional(),
    amount: z.number().int("Amount must be an integer (minor units)").positive("Amount must be > 0"),
    currency: currency.optional(),
    category: z.string().max(60).optional(),
    paidBy: objectId.optional(),
    splitMode: z.enum(["equal", "weighted", "itemized", "percentage"]).optional(),
    participants: z.array(participantInput).min(1, "At least one participant required"),
    notes: z.string().max(2000).optional(),
    expenseDate: z.string().optional(),
    receiptUrl: z.string().url().optional().nullable(),
    receiptFilename: z.string().max(255).optional(),
    receiptHash: z.string().max(128).optional(),
  }),
};

const updateExpenseSchema = {
  params: z.object({ expenseId: objectId }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    merchant: z.string().max(200).optional(),
    amount: z.number().int().positive().optional(),
    currency: currency.optional(),
    category: z.string().max(60).optional(),
    paidBy: objectId.optional(),
    splitMode: z.enum(["equal", "weighted", "itemized", "percentage"]).optional(),
    participants: z.array(participantInput).optional(),
    notes: z.string().max(2000).optional(),
    expenseDate: z.string().optional(),
    receiptUrl: z.string().url().optional().nullable(),
  }),
};

const listExpensesQuerySchema = {
  params: z.object({ id: objectId }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(30),
    category: z.string().optional(),
    paidBy: objectId.optional(),
    search: z.string().optional(),
  }),
};

const expenseParamsSchema = {
  params: z.object({ expenseId: objectId }),
};

const updateParticipantsSchema = {
  params: z.object({ expenseId: objectId }),
  body: z.object({
    participants: z.array(participantInput).min(1),
  }),
};

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesQuerySchema,
  expenseParamsSchema,
  updateParticipantsSchema,
};