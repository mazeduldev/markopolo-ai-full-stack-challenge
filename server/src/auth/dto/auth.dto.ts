import { Request } from 'express';
import { createZodDto } from 'nestjs-zod';
import { createStoreDtoZodSchema } from 'src/store/dto/create-store.dto';
import { z } from 'zod';

// register user request should use this schema
export const registerUserZodSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  name: z.string().min(1, 'Name is required'),
  store: createStoreDtoZodSchema,
});
export type RegisterUserDto = z.infer<typeof registerUserZodSchema>;

// use this schema when creating a user through userService
export const createUserZodSchema = registerUserZodSchema.omit({ store: true });
export type CreateUserDto = z.infer<typeof createUserZodSchema>;

export const loginUserZodSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});
export type LoginUserDto = z.infer<typeof loginUserZodSchema>;

export const authTokensZodSchema = z.object({
  access_token: z.string().describe('JWT access token'),
  // refresh_token: z.string().describe('JWT refresh token'),
  access_token_expires_in: z
    .number()
    .describe('Access token expiration time in seconds'),
});

export type AuthTokens = z.infer<typeof authTokensZodSchema>;

export const UserMinimalZodSchema = z.object({
  id: z.string().uuid().describe('Authenticated user ID'),
  email: z.string().email().describe('Authenticated user email'),
  name: z.string().describe('Authenticated user full name'),
});
export type UserMinimal = z.infer<typeof UserMinimalZodSchema>;
export class UserDto extends createZodDto(UserMinimalZodSchema) {}

export type AuthenticatedRequest = Request & { user: UserMinimal };

export type LoginResponse = AuthTokens & { user: UserMinimal };

export const jwtPayloadZodSchema = z.object({
  sub: z.string().uuid().describe('Subject - User ID'),
  email: z.string().email().describe('User email'),
  name: z.string().describe('User full name'),
});
export type JwtPayload = z.infer<typeof jwtPayloadZodSchema>;
