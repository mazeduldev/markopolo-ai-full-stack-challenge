import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { CampaignChannel } from '../campaign/campaign-channel.entity';
import { Campaign } from '../campaign/campaign.entity';
import { ChatMessage } from '../chat/chat-message.entity';
import { ChatThread } from '../chat/chat-thread.entity';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { Secret } from '../auth/secret.entity';
import { User } from 'src/user/user.entity';

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
    Secret,
    Campaign,
    CampaignChannel,
    ChatThread,
    ChatMessage,
    DataSourceConnection,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
