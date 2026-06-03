const { z } = require("zod");

const registerSchema = z.object({
  organizationName: z.string().min(3),

  name: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema,
};