const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const currency = z
  .string()
  .length(3, "Currency code must be 3 letters")
  .transform((v) => v.toUpperCase());

const memberInput = z.object({
  email: z.string().email("Valid email required").optional(),
  role: z.enum(["organizer", "admin", "member", "view-only"]).optional(),
});

const createGroupSchema = {
  body: z.object({
    name: z.string().min(1, "Group name is required").max(80),
    icon: z.string().max(20).optional(),
    category: z.string().max(60).optional(),
    description: z.string().max(1000).optional(),
    location: z.string().max(200).optional(),
    coords: z
      .object({
        lat: z.number().nullable().optional(),
        lon: z.number().nullable().optional(),
      })
      .optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    currency: currency.optional(),
    tags: z.array(z.string()).optional(),
    requireApproval: z.boolean().optional(),
    splitModel: z.enum(["equal", "weighted", "itemized", "percentage"]).optional(),
    nettingEnabled: z.boolean().optional(),
    subsidiesEnabled: z.boolean().optional(),
    pennyPolicy: z.enum(["highest", "roundrobin", "organizer", "tipjar"]).optional(),
    budgetCap: z.number().min(0).nullable().optional(),
    privacy: z.enum(["public", "admin-only"]).optional(),
    passcode: z.string().max(10).optional(),
    members: z.array(memberInput).optional(),
  }),
};

const updateGroupSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().min(1).max(80).optional(),
    icon: z.string().max(20).optional(),
    category: z.string().max(60).optional(),
    description: z.string().max(1000).optional(),
    location: z.string().max(200).optional(),
    coords: z
      .object({ lat: z.number().nullable().optional(), lon: z.number().nullable().optional() })
      .optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    currency: currency.optional(),
    tags: z.array(z.string()).optional(),
    requireApproval: z.boolean().optional(),
    splitModel: z.enum(["equal", "weighted", "itemized", "percentage"]).optional(),
    nettingEnabled: z.boolean().optional(),
    subsidiesEnabled: z.boolean().optional(),
    pennyPolicy: z.enum(["highest", "roundrobin", "organizer", "tipjar"]).optional(),
    budgetCap: z.number().min(0).nullable().optional(),
    privacy: z.enum(["public", "admin-only"]).optional(),
    passcode: z.string().max(10).optional(),
    autoApproveMembers: z.boolean().optional(),
    freezeLedger: z.boolean().optional(),
    receiptMandatory: z.boolean().optional(),
    receiptThreshold: z.number().min(0).optional(),
    approvalGate: z.boolean().optional(),
    approvalThreshold: z.number().min(0).optional(),
    reminderCadence: z.enum(["manual", "daily", "3days", "end-only"]).optional(),
    deliveryChannels: z.array(z.enum(["inapp", "email", "sms", "whatsapp"])).optional(),
  }),
};

const addMembersSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    members: z
      .array(z.union([z.string().email("Valid email required"), memberInput]))
      .min(1, "At least one member is required"),
  }),
};

const updateMemberRoleSchema = {
  params: z.object({ id: objectId, userId: objectId }),
  body: z.object({
    role: z.enum(["organizer", "admin", "member", "view-only"]),
  }),
};

const removeMemberSchema = {
  params: z.object({ id: objectId, userId: objectId }),
};

const joinInviteSchema = {
  body: z.object({ code: z.string().min(1, "Invite code is required") }),
};

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  addMembersSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  joinInviteSchema,
};