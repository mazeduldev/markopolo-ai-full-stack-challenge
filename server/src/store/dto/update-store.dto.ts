import { z } from 'zod';
import { createStoreDtoZodSchema } from './create-store.dto';

export const updateStoreDtoZodSchema = createStoreDtoZodSchema.partial();

export type UpdateStoreDto = z.infer<typeof updateStoreDtoZodSchema>;
