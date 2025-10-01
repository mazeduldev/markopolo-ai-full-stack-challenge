import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { DataSourceSummary } from './data-source-summary.entity';

@Entity('shopify_summaries')
export class ShopifySummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataSourceSummary, (ds) => ds.shopify_summaries)
  data_source: DataSourceSummary;

  @Column('jsonb')
  products: Array<{
    id: string;
    name: string;
    price: number;
    total_sales: number;
    category: string;
  }>;

  @Column('jsonb')
  orders_summary: {
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
    repeat_purchase_rate: number;
  };

  @Column('jsonb')
  customers_summary: {
    total_customers: number;
    inactive_60d: number;
    new_last30d: number;
    vip_customers: number;
  };

  @CreateDateColumn()
  created_at: Date;
}
