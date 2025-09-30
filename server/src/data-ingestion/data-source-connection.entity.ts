import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import {
  ConnectionStatus,
  DataSourceType,
} from './data-source-connection.type';

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
    default: ConnectionStatus.CONNECTED,
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

  @ManyToOne(() => User, (user) => user.data_source_connections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;
}
