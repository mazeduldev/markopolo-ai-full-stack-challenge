import { z } from 'zod';

export const messageZodSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']).optional(),
  content: z.string(),
});

export type MessageDto = z.infer<typeof messageZodSchema>;
