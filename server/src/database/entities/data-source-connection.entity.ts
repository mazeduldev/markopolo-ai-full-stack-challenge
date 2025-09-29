// apps/campaign-backend/src/entities/data-source-connection.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

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

@Entity('data_source_connections')
export class DataSourceConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DataSourceType,
  })
  type: DataSourceType;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;

  @Column({ type: 'jsonb', nullable: true })
  credentials: {
    api_key?: string;
    access_token?: string;
    refresh_token?: string;
    shop_domain?: string;
    customer_id?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  config: {
    sync_frequency?: string;
    enabled_features?: string[];
  };

  @Column({ type: 'timestamp', nullable: true })
  last_synced_at: Date;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.data_source_connections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;
}
