import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema
const GoogleAdsCampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  roas: z.number(),
});

const TopKeywordSchema = z.object({
  keyword: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number(),
});

const GoogleAdsAdSchema = z.object({
  id: z.string(),
  headline: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
});

export const GoogleAdsSummarySchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  campaigns: z.array(GoogleAdsCampaignSchema),
  top_keywords: z.array(TopKeywordSchema),
  ads: z.array(GoogleAdsAdSchema),
  created_at: z.date(),
});

export const CreateGoogleAdsSummarySchema = GoogleAdsSummarySchema.omit({
  id: true,
  created_at: true,
});

// Type
export type TGoogleAdsSummary = z.infer<typeof GoogleAdsSummarySchema>;

// Dto
export class CreateGoogleAdsSummaryDto extends createZodDto(
  CreateGoogleAdsSummarySchema,
) {}

export class GoogleAdsSummaryDto extends createZodDto(GoogleAdsSummarySchema) {}
