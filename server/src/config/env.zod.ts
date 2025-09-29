import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8080),
  OPENAI_API_KEY: z.string().nonempty(),
  OPENAI_DEFAULT_MODEL: z.string().default('gpt-5-nano'),
});

export type Env = z.infer<typeof envSchema>;
