import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please provide a valid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
        "Password must contain at least one letter, one digit, and use only letters or digits."
      ),
    cnfPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.cnfPassword, {
    message: "Passwords do not match",
    path: ["cnfPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
