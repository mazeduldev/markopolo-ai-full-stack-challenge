import { Campaign } from 'src/database/entities/campaign.entity';
import { ChatThread } from 'src/database/entities/chat-thread.entity';
import { DataSourceConnection } from 'src/database/entities/data-source-connection.entity';
import { Secret } from 'src/auth/secret.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Secret, (secret) => secret.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'secret_id' })
  secret: Secret;
  secret_id: string;

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
