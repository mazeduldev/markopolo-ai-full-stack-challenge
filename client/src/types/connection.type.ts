import { z } from "zod";

export const websiteAnalyticsSchema = z.object({
  api_key: z.string().min(1, "API Key is required"),
  access_token: z.string().min(1, "Access Token is required"),
});

export const googleAdsSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  access_token: z.string().min(1, "Access Token is required"),
});

export const shopifySchema = z.object({
  shop_domain: z.string().min(1, "Shop Domain is required"),
  access_token: z.string().min(1, "Access Token is required"),
});

export const connectionSchema = z.object({
  type: z.string().min(1, "Data source type is required"),
  sync_frequency: z.string().min(1, "Sync frequency is required"),
  enabled_features: z
    .array(z.string())
    .min(1, "At least one feature must be enabled"),
  credentials: z.object({}).passthrough(),
});
