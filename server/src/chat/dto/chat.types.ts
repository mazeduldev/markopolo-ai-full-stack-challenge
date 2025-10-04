import { z } from 'zod';
import { MessageRole } from '../entities/chat-message.entity';

export const messageZodSchema = z.object({
  content: z.string(),
  role: z.nativeEnum(MessageRole).optional(),
  thread_id: z.string().uuid().optional(),
});

export type MessageDto = z.infer<typeof messageZodSchema>;
