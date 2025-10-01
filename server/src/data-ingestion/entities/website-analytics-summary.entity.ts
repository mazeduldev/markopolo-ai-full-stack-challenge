import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { DataSourceSummary } from './data-source-summary.entity';

@Entity('website_analytics_summaries')
export class WebsiteAnalyticsSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataSourceSummary, (ds) => ds.website_analytics_summaries)
  data_source: DataSourceSummary;

  @Column('jsonb')
  traffic_summary: {
    sessions: number;
    page_views: number;
    avg_session_duration_sec: number;
    bounce_rate: number;
    conversions: number;
  };

  @Column('jsonb')
  top_pages: Array<{
    url: string;
    views: number;
    conversions: number;
  }>;

  @Column('jsonb')
  user_demographics: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };

  @CreateDateColumn()
  created_at: Date;
}
