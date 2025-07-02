import { z } from "zod";

export const registrationSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8, "Password should be atleast 8 characters long"),
  role: z.enum(["CUSTOMER", "EATERY"]),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const tokenVerificationSchema = z.object({
  token: z.string(),
  setPassword: z.boolean(),
});

export const sendWelcomMailSchema = z.object({
  firstname: z.string(),
  email: z.string().email(),
});
