import { z } from 'zod';
import { MessageRole } from '../entities/chat-message.entity';
import { createZodDto } from 'nestjs-zod';
import { CreateCampaignSchema } from 'src/campaign/dto/campaign.dto';

// Schema
export const CreateMessageSchema = z.object({
  content: z.string(),
  role: z.nativeEnum(MessageRole).optional(),
  thread_id: z.string().uuid().nullable().optional(),
});

export const MessageSchema = CreateMessageSchema.extend({
  id: z.string().uuid(),
  created_at: z.date(),
  campaign_id: z.string().uuid().nullable(),
});

export const MessageResponseSchema = z.object({
  threadId: z.string().uuid(),
  chunk: z.string().or(CreateCampaignSchema.or(z.string())),
});

export const ThreadSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  user_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ThreadDetailSchema = ThreadSchema.extend({
  messages: z.array(MessageSchema),
});

// Type
export type TCreateMessage = z.infer<typeof CreateMessageSchema>;
export type TMessageResponse = z.infer<typeof MessageResponseSchema>;
export type TThread = z.infer<typeof ThreadSchema>;

// Dto
export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}
export class ThreadDto extends createZodDto(ThreadSchema) {}
export class ThreadDetailDto extends createZodDto(ThreadDetailSchema) {}
