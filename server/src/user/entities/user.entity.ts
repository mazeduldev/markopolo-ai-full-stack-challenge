import { Campaign } from 'src/campaign/entities/campaign.entity';
import { ChatThread } from 'src/chat/entities/chat-thread.entity';
import { DataSourceConnection } from 'src/data-ingestion/entities/data-source-connection.entity';
import { Secret } from 'src/auth/entities/secret.entity';
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
import { Store } from 'src/store/entities/store.entity';

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

  @Column()
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

  @OneToOne(() => Store, (store) => store.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  store_id: string;
}
