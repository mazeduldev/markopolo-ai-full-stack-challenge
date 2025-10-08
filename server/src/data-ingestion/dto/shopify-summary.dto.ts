import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema
const ShopifyProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  total_sales: z.number(),
  category: z.string(),
});

const OrdersSummarySchema = z.object({
  total_orders: z.number(),
  total_revenue: z.number(),
  avg_order_value: z.number(),
  repeat_purchase_rate: z.number(),
});

const CustomersSummarySchema = z.object({
  total_customers: z.number(),
  inactive_60d: z.number(),
  new_last30d: z.number(),
  vip_customers: z.number(),
});

export const ShopifySummarySchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid().nullable().optional(),
  products: z.array(ShopifyProductSchema),
  orders_summary: OrdersSummarySchema,
  customers_summary: CustomersSummarySchema,
  created_at: z.date(),
});

export const CreateShopifySummarySchema = ShopifySummarySchema.omit({
  id: true,
  created_at: true,
});

// Type
export type TShopifySummary = z.infer<typeof ShopifySummarySchema>;

// Dto
export class CreateShopifySummaryDto extends createZodDto(
  CreateShopifySummarySchema,
) {}

export class ShopifySummaryDto extends createZodDto(ShopifySummarySchema) {}
