import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema
export const CreateStoreSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url().max(255),
  currency: z.string().max(10).default('USD'),
  timezone: z.string().max(50).default('UTC'),
});

export const UpdateStoreSchema = CreateStoreSchema.partial();

export const StoreSchema = CreateStoreSchema.extend({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Type
export type TCreateStore = z.infer<typeof CreateStoreSchema>;
export type TUpdateStore = z.infer<typeof UpdateStoreSchema>;
export type TStore = z.infer<typeof StoreSchema>;

// DTO
export class CreateStoreDto extends createZodDto(CreateStoreSchema) {}
export class UpdateStoreDto extends createZodDto(UpdateStoreSchema) {}
export class StoreDto extends createZodDto(StoreSchema) {}
