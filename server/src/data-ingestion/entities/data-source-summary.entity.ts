import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { GoogleAdsSummary } from './google-ads-summary';
import { ShopifySummary } from './shopify-summary';
import { WebsiteAnalyticsSummary } from './website-analytics-summary.entity';

@Entity('data_source_summaries')
export class DataSourceSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store) => store.data_sources, { eager: true })
  store: Store;

  @Column({ type: 'varchar' })
  source_type: 'shopify' | 'google_ads' | 'website_analytics';

  @OneToMany(() => ShopifySummary, (s) => s.data_source, { cascade: true })
  shopify_summaries: ShopifySummary[];

  @OneToMany(() => GoogleAdsSummary, (g) => g.data_source, { cascade: true })
  google_ads_summaries: GoogleAdsSummary[];

  @OneToMany(() => WebsiteAnalyticsSummary, (w) => w.data_source, {
    cascade: true,
  })
  website_analytics_summaries: WebsiteAnalyticsSummary[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
