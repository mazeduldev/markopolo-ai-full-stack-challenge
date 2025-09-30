import { Request } from 'express';
import { z } from 'zod';

export const registerUserZodSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  company_name: z.string().optional(),
});
export type RegisterUserDto = z.infer<typeof registerUserZodSchema>;

export const loginUserZodSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginUserDto = z.infer<typeof loginUserZodSchema>;

export const authTokensZodSchema = z.object({
  access_token: z.string().describe('JWT access token'),
  // refresh_token: z.string().describe('JWT refresh token'),
  // expires_in: z.number().describe('Access token expiration time in seconds'),
});

export type AuthTokens = z.infer<typeof authTokensZodSchema>;

export const userMinimalZodSchema = z.object({
  id: z.string().uuid().describe('Authenticated user ID'),
  email: z.string().email().describe('Authenticated user email'),
  name: z.string().describe('Authenticated user full name'),
});
export type UserMinimal = z.infer<typeof userMinimalZodSchema>;

export type AuthenticatedRequest = Request & { user: UserMinimal };

export type LoginResponse = AuthTokens & { user: UserMinimal };

export const jwtPayloadZodSchema = z.object({
  sub: z.string().uuid().describe('Subject - User ID'),
  email: z.string().email().describe('User email'),
  name: z.string().describe('User full name'),
});
export type JwtPayload = z.infer<typeof jwtPayloadZodSchema>;
