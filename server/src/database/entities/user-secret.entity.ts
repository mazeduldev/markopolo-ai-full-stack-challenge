import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('user_secrets')
export class UserSecret {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  password_hash!: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.user_secret)
  user: User;
}
