import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { EChannelType } from '../dto/campaign.dto';

@Entity('campaigns')
@Index(['user_id', 'created_at'])
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  campaign_title: string;

  @Column({ type: 'text' })
  target_audience: string;

  @Column({ type: 'jsonb' })
  message: {
    headline: string;
    body: string;
    call_to_action: {
      label: string;
      url: string;
    };
  };

  @Column({
    type: 'enum',
    enum: EChannelType,
    array: true,
  })
  channels: EChannelType[];

  @Column({ type: 'jsonb' })
  timeline: {
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
  };

  @Column({ type: 'varchar', length: 100 })
  budget: string;

  @Column({ type: 'jsonb' })
  expected_metrics: {
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
    roi: number;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.campaigns, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: string;
}
