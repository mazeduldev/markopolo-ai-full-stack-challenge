import { Request } from 'express';
import { createZodDto } from 'nestjs-zod';
import { CreateStoreSchema } from 'src/store/dto/store.dto';
import { z } from 'zod';

// Schema
// register user request should use this schema
export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  name: z.string().min(1, 'Name is required'),
  store: CreateStoreSchema,
});

// use this schema when creating a user through userService
export const CreateUserSchema = RegisterUserSchema.omit({ store: true });

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid().describe('Subject - User ID'),
  email: z.string().email().describe('User email'),
  name: z.string().describe('User full name'),
});

export const AuthTokensSchema = z.object({
  access_token: z.string().describe('JWT access token'),
  // refresh_token: z.string().describe('JWT refresh token'),
  access_token_expires_in: z
    .number()
    .describe('Access token expiration time in seconds'),
});

export const UserMinimalZodSchema = z.object({
  id: z.string().uuid().describe('Authenticated user ID'),
  email: z.string().email().describe('Authenticated user email'),
  name: z.string().describe('Authenticated user full name'),
});

export const RegisterUserResponseSchema = AuthTokensSchema.extend({
  user: UserMinimalZodSchema,
});
export const LoginUserResponseSchema = RegisterUserResponseSchema;

// Type
export type TRegisterUser = z.infer<typeof RegisterUserSchema>;
export type TCreateUser = z.infer<typeof CreateUserSchema>;
export type TLoginUser = z.infer<typeof LoginUserSchema>;
export type TLoginResponse = z.infer<typeof LoginUserResponseSchema>;
export type TUserMinimal = z.infer<typeof UserMinimalZodSchema>;
export type TAuthenticatedRequest = Request & { user: TUserMinimal };
export type TJwtPayload = z.infer<typeof JwtPayloadSchema>;
export type TAuthTokens = z.infer<typeof AuthTokensSchema>;

// Dto
export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
export class RegisterUserResponseDto extends createZodDto(
  RegisterUserResponseSchema,
) {}
export class LoginUserDto extends createZodDto(LoginUserSchema) {}
export class LoginUserResponseDto extends createZodDto(
  LoginUserResponseSchema,
) {}
export class UserDto extends createZodDto(UserMinimalZodSchema) {}
