import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  type Relation,
} from 'typeorm';
import type { User } from 'src/user/entities/user.entity';
import type { ChatMessage } from './chat-message.entity';

@Entity('chat_threads')
@Index(['user_id', 'created_at'])
export class ChatThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne('User', (user: User) => user.chat_threads)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  user_id: string;

  @OneToMany('ChatMessage', (message: ChatMessage) => message.thread)
  messages: Relation<ChatMessage[]>;
}
