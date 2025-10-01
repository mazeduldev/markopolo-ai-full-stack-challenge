import { z } from 'zod';

const TrafficSummaryZodSchema = z.object({
  sessions: z.number(),
  page_views: z.number(),
  avg_session_duration_sec: z.number(),
  bounce_rate: z.number(),
  conversions: z.number(),
});

const TopPageZodSchema = z.object({
  url: z.string(),
  views: z.number(),
  conversions: z.number(),
});

const UserDemographicsZodSchema = z.object({
  age_groups: z.record(z.string(), z.number()).nullable(),
  locations: z.record(z.string(), z.number()).nullable(),
  devices: z.record(z.string(), z.number()).nullable(),
});

export const WebsiteAnalyticsSummaryZodSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  traffic_summary: TrafficSummaryZodSchema,
  top_pages: z.array(TopPageZodSchema),
  user_demographics: UserDemographicsZodSchema,
  created_at: z.date(),
});

export const CreateWebsiteAnalyticsSummaryZodSchema =
  WebsiteAnalyticsSummaryZodSchema.omit({
    id: true,
    created_at: true,
  });

export type WebsiteAnalyticsSummaryType = z.infer<
  typeof WebsiteAnalyticsSummaryZodSchema
>;
export type CreateWebsiteAnalyticsSummaryDto = z.infer<
  typeof CreateWebsiteAnalyticsSummaryZodSchema
>;
