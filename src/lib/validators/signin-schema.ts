import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .nonempty("Email is required")
    .email("Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .nonempty("Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signInSchemaAuthParser = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .nonempty("Email is required")
      .email("Please provide a valid email address"),
    password: z.string().optional(),
    credentialId: z.string().optional(),
  })
  .refine((data) => data.password || data.credentialId, {
    message: "Either password or credentialId is required",
    path: ["password"],
  });

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignInSchemaAuthParser = z.infer<typeof signInSchemaAuthParser>;
