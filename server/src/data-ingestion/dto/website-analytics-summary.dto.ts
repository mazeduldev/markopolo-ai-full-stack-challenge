import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema
const TrafficSummarySchema = z.object({
  sessions: z.number(),
  page_views: z.number(),
  avg_session_duration_sec: z.number(),
  bounce_rate: z.number(),
  conversions: z.number(),
});

const TopPageSchema = z.object({
  url: z.string(),
  views: z.number(),
  conversions: z.number(),
});

const UserDemographicsSchema = z.object({
  age_groups: z.record(z.string(), z.number()).nullable(),
  locations: z.record(z.string(), z.number()).nullable(),
  devices: z.record(z.string(), z.number()).nullable(),
});

export const WebsiteAnalyticsSummarySchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  traffic_summary: TrafficSummarySchema,
  top_pages: z.array(TopPageSchema),
  user_demographics: UserDemographicsSchema,
  created_at: z.date(),
});

export const CreateWebsiteAnalyticsSummarySchema =
  WebsiteAnalyticsSummarySchema.omit({
    id: true,
    created_at: true,
  });

// Type
export type TWebsiteAnalyticsSummaryType = z.infer<
  typeof WebsiteAnalyticsSummarySchema
>;

// Dto
export class CreateWebsiteAnalyticsSummaryDto extends createZodDto(
  CreateWebsiteAnalyticsSummarySchema,
) {}

export class WebsiteAnalyticsSummaryDto extends createZodDto(
  WebsiteAnalyticsSummarySchema,
) {}
