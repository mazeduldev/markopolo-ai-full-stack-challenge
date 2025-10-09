import type { Campaign } from 'src/campaign/entities/campaign.entity';
import type { ChatThread } from 'src/chat/entities/chat-thread.entity';
import type { DataSourceConnection } from 'src/data-ingestion/entities/data-source-connection.entity';
import type { Secret } from 'src/auth/entities/secret.entity';
import type { Store } from 'src/store/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @OneToOne('Secret', (secret: Secret) => secret.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'secret_id' })
  secret: Relation<Secret>;

  @Column()
  secret_id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany('Campaign', (campaign: Campaign) => campaign.user)
  campaigns: Relation<Campaign[]>;

  @OneToMany('ChatThread', (thread: ChatThread) => thread.user)
  chat_threads: Relation<ChatThread[]>;

  @OneToMany(
    'DataSourceConnection',
    (connection: DataSourceConnection) => connection.user,
  )
  data_source_connections: Relation<any[]>;

  @OneToOne('Store', (store: Store) => store.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<Store>;

  @Column({ nullable: true })
  store_id: string;
}
