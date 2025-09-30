import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { Campaign } from './entities/campaign.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatThread } from './entities/chat-thread.entity';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { UserSecret } from './entities/user-secret.entity';
import type { Env } from 'src/config/env.zod';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserSecret,
      Campaign,
      CampaignChannel,
      ChatThread,
      ChatMessage,
      DataSourceConnection,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
