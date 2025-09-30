import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/config.service';
import { User } from './entities/user.entity';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { Campaign } from './entities/campaign.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatThread } from './entities/chat-thread.entity';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { UserSecret } from './entities/user-secret.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: AppConfigService) => ({
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
      User,
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
