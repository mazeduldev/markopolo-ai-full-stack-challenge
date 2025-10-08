import z from 'zod';
import { GoogleAdsSummarySchema } from './google-ads-summary.dto';
import { ShopifySummarySchema } from './shopify-summary.dto';
import { WebsiteAnalyticsSummarySchema } from './website-analytics-summary.dto';
import { createZodDto } from 'nestjs-zod';

// Schema
export const CombinedSummarySchema = z.object({
  google_ads: GoogleAdsSummarySchema.optional(),
  shopify: ShopifySummarySchema.optional(),
  website_analytics: WebsiteAnalyticsSummarySchema.optional(),
});

// Dto
export class CombinedSummaryDto extends createZodDto(CombinedSummarySchema) {}
