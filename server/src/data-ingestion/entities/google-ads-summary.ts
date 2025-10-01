import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { DataSourceSummary } from './data-source-summary.entity';

@Entity('google_ads_summaries')
export class GoogleAdsSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataSourceSummary, (ds) => ds.google_ads_summaries)
  data_source: DataSourceSummary;

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
