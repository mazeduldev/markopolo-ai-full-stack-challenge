import { z } from 'zod';

const ShopifyProductZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  total_sales: z.number(),
  category: z.string(),
});

const OrdersSummaryZodSchema = z.object({
  total_orders: z.number(),
  total_revenue: z.number(),
  avg_order_value: z.number(),
  repeat_purchase_rate: z.number(),
});

const CustomersSummaryZodSchema = z.object({
  total_customers: z.number(),
  inactive_60d: z.number(),
  new_last30d: z.number(),
  vip_customers: z.number(),
});

export const ShopifySummaryZodSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  products: z.array(ShopifyProductZodSchema),
  orders_summary: OrdersSummaryZodSchema,
  customers_summary: CustomersSummaryZodSchema,
  created_at: z.date(),
});

export const CreateShopifySummaryZodSchema = ShopifySummaryZodSchema.omit({
  id: true,
  created_at: true,
});

export type ShopifySummaryType = z.infer<typeof ShopifySummaryZodSchema>;
export type CreateShopifySummaryDto = z.infer<
  typeof CreateShopifySummaryZodSchema
>;
