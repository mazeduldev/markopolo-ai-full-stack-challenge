import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  type Relation,
} from 'typeorm';
import type { User } from 'src/user/entities/user.entity';
import type { GoogleAdsSummary } from 'src/data-ingestion/entities/google-ads-summary.entity';
import type { ShopifySummary } from 'src/data-ingestion/entities/shopify-summary.entity';
import type { WebsiteAnalyticsSummary } from 'src/data-ingestion/entities/website-analytics-summary.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne('User', (user: User) => user.store)
  user: Relation<User>;

  @OneToMany('GoogleAdsSummary', (summary: GoogleAdsSummary) => summary.store)
  google_ads_summaries: Relation<GoogleAdsSummary[]>;

  @OneToMany('ShopifySummary', (summary: ShopifySummary) => summary.store)
  shopify_summaries: Relation<ShopifySummary[]>;

  @OneToMany(
    'WebsiteAnalyticsSummary',
    (summary: WebsiteAnalyticsSummary) => summary.store,
  )
  website_analytics_summaries: Relation<WebsiteAnalyticsSummary[]>;

  @Column()
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
