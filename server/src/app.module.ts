import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.zod';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';
import { CampaignModule } from './campaign/campaign.module';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { StoreModule } from './store/store.module';
import { AiMockDataGeneratorModule } from './ai-mock-data-generator/ai-mock-data-generator.module';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config) => {
        return envSchema.parse(config);
      },
    }),
    AgentModule,
    AuthModule,
    UserModule,
    DatabaseModule,
    ChatModule,
    CampaignModule,
    DataIngestionModule,
    StoreModule,
    AiMockDataGeneratorModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
