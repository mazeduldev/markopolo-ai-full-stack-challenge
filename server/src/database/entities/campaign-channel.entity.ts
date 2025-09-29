// apps/campaign-backend/src/entities/campaign-channel.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';

export enum ChannelType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WHATSAPP = 'whatsapp',
}

export enum ChannelStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  SCHEDULED = 'scheduled',
}

@Entity('campaign_channels')
export class CampaignChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ChannelType,
  })
  type: ChannelType;

  @Column({ type: 'int' })
  priority: number;

  @Column({
    type: 'enum',
    enum: ChannelStatus,
    default: ChannelStatus.PENDING,
  })
  status: ChannelStatus;

  @Column({ type: 'jsonb' })
  message: {
    subject?: string;
    text?: string;
    html?: string;
    template?: string;
    personalization?: Record<string, any>;
  };

  @Column({ type: 'jsonb', nullable: true })
  targeting: {
    audience_filter?: string;
    lookalike_percentage?: number;
    budget?: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @Column({ type: 'int', default: 0 })
  sent_count: number;

  @Column({ type: 'int', default: 0 })
  delivered_count: number;

  @Column({ type: 'int', default: 0 })
  opened_count: number;

  @Column({ type: 'int', default: 0 })
  clicked_count: number;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.channels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column()
  campaign_id: string;
}
