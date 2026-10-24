import { z } from "zod";

/**
 * Zod Schema for User Login Validation
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Account username or email must be at least 3 characters")
    .max(100, "Account identifier too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Zod Schema for User Registration Validation
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(70, "Full name cannot exceed 70 characters"),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-z0-9_.-]+$/, "Username can only contain letters, numbers, dashes, and underscores"),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address (e.g. name@domain.in)"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z
      .string()
      .min(6, "Please confirm your password"),
    role: z.enum(["citizen", "officer", "admin"], {
      message: "Please select a valid account role",
    }),
    ward: z.string().default("Ward 07, Sector 18"),
    department: z
      .string()
      .default("General Administration"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match the entered password",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Zod Schema for Grievance Validation
 */
export const grievanceValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long"),
  category: z.string().min(2, "Category is required"),
  department: z.string().min(2, "Department is required"),
  ward: z.string().min(1, "Ward location is required"),
  urgency_score: z.number().min(0).max(1).default(0.5),
});
