import { ConfigService } from '@nestjs/config';
import { Env } from './env.zod';

export type AppConfigService = ConfigService<Env>;
