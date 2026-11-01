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
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
