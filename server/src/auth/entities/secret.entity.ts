import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from 'src/user/entities/user.entity';

@Entity('secrets')
export class Secret {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  password_hash!: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne('User', (user: User) => user.secret)
  user: Relation<User>;
}
