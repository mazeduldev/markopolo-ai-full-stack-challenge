import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { ChatThread } from './chat-thread.entity';
import { DataSourceConnection } from './data-source-connection.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];

  @OneToMany(() => ChatThread, (thread) => thread.user)
  chat_threads: ChatThread[];

  @OneToMany(() => DataSourceConnection, (connection) => connection.user)
  data_source_connections: DataSourceConnection[];
}
