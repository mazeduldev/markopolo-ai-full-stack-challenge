import { z } from 'zod';

const GoogleAdsCampaignZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  roas: z.number(),
});

const TopKeywordZodSchema = z.object({
  keyword: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number(),
});

const GoogleAdsAdZodSchema = z.object({
  id: z.string(),
  headline: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
});

export const GoogleAdsSummaryZodSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  campaigns: z.array(GoogleAdsCampaignZodSchema),
  top_keywords: z.array(TopKeywordZodSchema),
  ads: z.array(GoogleAdsAdZodSchema),
  created_at: z.date(),
});

export const CreateGoogleAdsSummaryZodSchema = GoogleAdsSummaryZodSchema.omit({
  id: true,
  created_at: true,
});

export type GoogleAdsSummaryType = z.infer<typeof GoogleAdsSummaryZodSchema>;
export type CreateGoogleAdsSummaryDto = z.infer<
  typeof CreateGoogleAdsSummaryZodSchema
>;
