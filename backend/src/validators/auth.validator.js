const { z } = require("zod");

const registerSchema = {
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    email: z.string().email("Please provide a valid email address").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    currency: z.string().length(3, "Currency code must be 3 letters (e.g. INR, USD)").optional().default("INR"),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Please provide a valid email address").toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
};

const updateProfileSchema = {
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").max(100).optional(),
    currency: z.string().length(3, "Currency code must be 3 letters").toUpperCase().optional(),
    avatarEmoji: z.string().max(20).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    handle: z.string().max(40).optional(),
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    channel: z.enum(["email", "sms", "passkey"]).optional().default("email"),
    destination: z.string().min(1, "Email or destination is required"),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  }),
};

const verifyEmailSchema = {
  body: z.object({
    email: z.string().email("Valid email required"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
