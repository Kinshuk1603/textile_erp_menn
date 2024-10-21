import { z } from "zod";

export const userSchema  = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" })
    .max(15, { message: "Password must not exceed 15 characters" })
    .regex(/^(?=.*[A-Z])/, { message: "At least 1 uppercase letter required" })
    .regex(/^(?=.*\d)/, { message: "At least 1 number required" })
    .regex(/^(?=.*[@$!%*?&])/, {
      message: "At least 1 special character required",
    }),
  role: z.string().min(1, { message: "Role is required" }), // Ensuring role is provided
});

export const signupSchema = userSchema; // You can use userSchema directly since it includes role validation


export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" })
    .max(15, { message: "Password must not exceed 15 characters" })
    .regex(/^(?=.*[A-Z])/, { message: "At least 1 uppercase letter required" })
    .regex(/^(?=.*\d)/, { message: "At least 1 number required" })
    .regex(/^(?=.*[@$!%*?&])/, {
      message: "At least 1 special character required",
    }),
});
