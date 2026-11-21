const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const currency = z
  .string()
  .length(3)
  .transform((v) => v.toUpperCase());

const createSettlementSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    fromUser: objectId,
    toUser: objectId,
    amount: z.number().int().positive("Amount must be > 0"),
    currency: currency.optional(),
    method: z.enum(["venmo", "apple_pay", "zelle", "bank", "cash", "other", "manual"]).optional(),
    status: z.enum(["pending", "requested", "paid"]).optional(),
    note: z.string().max(500).optional(),
  }),
};

const updateSettlementSchema = {
  params: z.object({ id: objectId, settlementId: objectId }),
  body: z.object({
    status: z.enum(["pending", "requested", "paid"]).optional(),
    method: z.enum(["venmo", "apple_pay", "zelle", "bank", "cash", "other", "manual"]).optional(),
    amount: z.number().int().positive().optional(),
    note: z.string().max(500).optional(),
  }),
};

const settleDebtSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    fromUser: objectId,
    toUser: objectId,
    amount: z.number().int().positive(),
    currency: currency.optional(),
    method: z.enum(["venmo", "apple_pay", "zelle", "bank", "cash", "other", "manual"]).optional(),
    note: z.string().max(500).optional(),
  }),
};

const settlementParamsSchema = {
  params: z.object({ id: objectId }),
};

module.exports = {
  createSettlementSchema,
  updateSettlementSchema,
  settleDebtSchema,
  settlementParamsSchema,
};