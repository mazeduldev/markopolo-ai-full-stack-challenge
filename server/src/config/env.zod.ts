import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8080),
  OPENAI_API_KEY: z.string().nonempty(),
  OPENAI_DEFAULT_MODEL: z.string().default('gpt-5-nano'),
  // PostgreSQL connection settings
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('pguser'),
  DB_PASSWORD: z.string().default('pgpassword'),
  DB_NAME: z.string().default('markopolo'),
});

export type Env = z.infer<typeof envSchema>;
