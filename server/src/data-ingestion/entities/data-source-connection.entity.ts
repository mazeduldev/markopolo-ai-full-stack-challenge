import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  EConnectionStatus,
  EDataSourceType,
} from '../dto/data-source-connection.dto';

@Entity('data_source_connections')
export class DataSourceConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EDataSourceType,
  })
  type: EDataSourceType;

  @Column({
    type: 'enum',
    enum: EConnectionStatus,
    default: EConnectionStatus.CONNECTED,
  })
  status: EConnectionStatus;

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
