import { Store } from 'src/store/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('google_ads_summaries')
export class GoogleAdsSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store) => store.google_ads_summaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_id: string;

  @Column('jsonb')
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  }>;

  @Column('jsonb')
  top_keywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;

  @Column('jsonb')
  ads: Array<{
    id: string;
    headline: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }>;

  @CreateDateColumn()
  created_at: Date;
}
