import { z } from 'zod';

export enum DataSourceType {
  SHOPIFY = 'shopify',
  GOOGLE_ADS = 'google_ads',
  WEBSITE_ANALYTICS = 'website_analytics',
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending',
}

export const dataSourceTypeZodSchema = z.nativeEnum(DataSourceType);
export const connectionStatusZodSchema = z.nativeEnum(ConnectionStatus);

export const dataSourceConnectionZodSchema = z.object({
  status: connectionStatusZodSchema.default(ConnectionStatus.CONNECTED),
  type: dataSourceTypeZodSchema,

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

export type DataSourceConnectionType = z.infer<
  typeof dataSourceConnectionZodSchema
>;

export type CreateDataSourceConnectionDto = z.infer<
  typeof dataSourceConnectionZodSchema
>;
export type UpdateDataSourceConnectionDto =
  Partial<CreateDataSourceConnectionDto>;
