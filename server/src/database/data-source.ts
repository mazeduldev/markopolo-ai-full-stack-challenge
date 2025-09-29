// apps/campaign-backend/src/database/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { Campaign } from './entities/campaign.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatThread } from './entities/chat-thread.entity';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { User } from './entities/user.entity';

config(); // Load .env file

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'pguser',
  password: process.env.DB_PASSWORD || 'pgpassword',
  database: process.env.DB_NAME || 'markopolo',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Campaign,
    CampaignChannel,
    ChatThread,
    ChatMessage,
    DataSourceConnection,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
