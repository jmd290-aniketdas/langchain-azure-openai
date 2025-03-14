import * as z from "zod";

export const passwordUpdateSchema = z
  .object({
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

export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;
