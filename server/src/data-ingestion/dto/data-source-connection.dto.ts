import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Enum
export enum EDataSourceType {
  SHOPIFY = 'shopify',
  GOOGLE_ADS = 'google_ads',
  WEBSITE_ANALYTICS = 'website_analytics',
}

export enum EConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending',
}

// Schema
export const DataSourceTypeSchema = z.nativeEnum(EDataSourceType);
export const ConnectionStatusSchema = z.nativeEnum(EConnectionStatus);

export const CreateDataSourceConnectionSchema = z.object({
  type: DataSourceTypeSchema,
  status: ConnectionStatusSchema.default(EConnectionStatus.CONNECTED),

  credentials: z
    .object({
      api_key: z.string().optional(),
      access_token: z.string().optional(),
      refresh_token: z.string().optional(),
      shop_domain: z.string().optional(),
      customer_id: z.string().optional(),
    })
    .optional(),

  config: z
    .object({
      sync_frequency: z.string().optional(),
      enabled_features: z.array(z.string()).optional(),
    })
    .optional(),
});

export const UpdateDataSourceConnectionSchema =
  CreateDataSourceConnectionSchema.partial();

export const DataSourceConnectionSchema =
  CreateDataSourceConnectionSchema.extend({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    last_synced_at: z.date().nullable(),
    error_message: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
  });

export const DataSourceConnectionViewSchema = z.object({
  id: z.string().uuid(),
  type: DataSourceTypeSchema,
  status: ConnectionStatusSchema,
});

// Type
export type TCreateDataSourceConnection = z.infer<
  typeof CreateDataSourceConnectionSchema
>;

export type TUpdateDataSourceConnection = z.infer<
  typeof UpdateDataSourceConnectionSchema
>;

export type TDataSourceConnection = z.infer<typeof DataSourceConnectionSchema>;

export type TDataSourceConnectionView = z.infer<
  typeof DataSourceConnectionViewSchema
>;

// Dto
export class CreateDataSourceConnectionDto extends createZodDto(
  CreateDataSourceConnectionSchema,
) {}

export class UpdateDataSourceConnectionDto extends createZodDto(
  UpdateDataSourceConnectionSchema,
) {}

export class DataSourceConnectionDto extends createZodDto(
  DataSourceConnectionSchema,
) {}

export class DataSourceConnectionViewDto extends createZodDto(
  DataSourceConnectionViewSchema,
) {}
