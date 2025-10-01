import { z } from 'zod';

export const createStoreDtoZodSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url().max(255).optional(),
  currency: z.string().max(10).default('USD'),
  timezone: z.string().max(50).default('UTC'),
});

export const createStoreDtoWithUserZodSchema = createStoreDtoZodSchema.extend({
  user_id: z.string().uuid(),
});

export type CreateStoreDto = z.infer<typeof createStoreDtoZodSchema>;
export type CreateStoreDtoWithUser = z.infer<
  typeof createStoreDtoWithUserZodSchema
>;
