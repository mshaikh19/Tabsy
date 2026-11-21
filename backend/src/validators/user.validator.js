const { z } = require("zod");

const currency = z
  .string()
  .length(3, "Currency code must be 3 letters")
  .transform((v) => v.toUpperCase());

const updateProfileSchema = {
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    currency: currency.optional(),
    avatarEmoji: z.string().max(20).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    handle: z.string().max(40).optional(),
    useCases: z.array(z.string().max(60)).optional(),
    defaultSplitMode: z.enum(["equal", "itemized", "round"]).optional(),
  }),
};

const updatePreferencesSchema = {
  body: z.object({
    defaultSplitMode: z.enum(["equal", "itemized", "round"]).optional(),
    notificationPreferences: z
      .object({
        expense: z.boolean().optional(),
        settlement: z.boolean().optional(),
        recap: z.boolean().optional(),
      })
      .optional(),
  }),
};

const completeOnboardingSchema = {
  body: z.object({
    useCases: z.array(z.string().max(60)).optional(),
    avatarEmoji: z.string().max(20).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    displayName: z.string().min(1).max(100).optional(),
    handle: z.string().max(40).optional(),
    currency: currency.optional(),
    defaultSplitMode: z.enum(["equal", "itemized", "round"]).optional(),
    notificationPreferences: z
      .object({
        expense: z.boolean().optional(),
        settlement: z.boolean().optional(),
        recap: z.boolean().optional(),
      })
      .optional(),
  }),
};

module.exports = {
  updateProfileSchema,
  updatePreferencesSchema,
  completeOnboardingSchema,
};