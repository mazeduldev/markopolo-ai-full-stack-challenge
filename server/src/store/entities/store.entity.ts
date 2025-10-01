import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { GoogleAdsSummary } from 'src/data-ingestion/entities/google-ads-summary.entity';
import { ShopifySummary } from 'src/data-ingestion/entities/shopify-summary.entity';
import { WebsiteAnalyticsSummary } from 'src/data-ingestion/entities/website-analytics-summary.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.store)
  user: User;

  @OneToMany(() => GoogleAdsSummary, (summary) => summary.store)
  google_ads_summaries: GoogleAdsSummary[];

  @OneToMany(() => ShopifySummary, (summary) => summary.store)
  shopify_summaries: ShopifySummary[];

  @OneToMany(() => WebsiteAnalyticsSummary, (summary) => summary.store)
  website_analytics_summaries: WebsiteAnalyticsSummary[];

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
