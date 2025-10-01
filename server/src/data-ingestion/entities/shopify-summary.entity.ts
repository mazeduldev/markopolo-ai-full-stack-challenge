import { Store } from 'src/store/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('shopify_summaries')
export class ShopifySummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store) => store.shopify_summaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_id: string;

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
