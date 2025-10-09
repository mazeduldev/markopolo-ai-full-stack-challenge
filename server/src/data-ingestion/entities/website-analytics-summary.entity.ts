import type { Store } from 'src/store/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
  type Relation,
} from 'typeorm';

@Entity('website_analytics_summaries')
export class WebsiteAnalyticsSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Store', (store: Store) => store.website_analytics_summaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Relation<Store>;

  @Column()
  store_id: string;

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
    age_groups: Record<string, number> | null;
    locations: Record<string, number> | null;
    devices: Record<string, number> | null;
  };

  @CreateDateColumn()
  created_at: Date;
}
