import z from "zod";

const StoreFormZodSchema = z.object({
  name: z.string().min(1, "Shop name is required").max(255),
  url: z.string().url().max(255).or(z.literal("")),
});

export const RegisterUserZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  name: z.string().min(1, "Name is required"),
  store: StoreFormZodSchema,
});
export type RegisterUserDto = z.infer<typeof RegisterUserZodSchema>;

export const RegisterUserFormZodSchema = RegisterUserZodSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});
export type RegisterUserFormSchemaType = z.infer<
  typeof RegisterUserFormZodSchema
>;

export const LoginUserZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});
export type LoginUserDto = z.infer<typeof LoginUserZodSchema>;

export type TokenResponse = {
  access_token: string;
  access_token_expires_in: number;
  user: UserDto;
};

export type UserDto = {
  id: string;
  email: string;
  name: string;
};
