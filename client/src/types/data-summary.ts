export interface DataSummaryResponse {
  shopify?: {
    id: string;
    store_id: string;
    products: Array<{
      id: string;
      name: string;
      price: number;
      category: string;
      total_sales: number;
    }>;
    orders_summary: {
      total_orders: number;
      total_revenue: number;
      avg_order_value: number;
      repeat_purchase_rate: number;
    };
    customers_summary: {
      new_last30d: number;
      inactive_60d: number;
      vip_customers: number;
      total_customers: number;
    };
    created_at: string;
  };
  google_ads?: {
    id: string;
    store_id: string;
    campaigns: Array<{
      id: string;
      name: string;
      roas: number;
      spend: number;
      clicks: number;
      status: string;
      conversions: number;
      impressions: number;
    }>;
    top_keywords: Array<{
      ctr: number;
      clicks: number;
      keyword: string;
      impressions: number;
    }>;
    ads: Array<{
      id: string;
      clicks: number;
      headline: string;
      conversions: number;
      impressions: number;
    }>;
    created_at: string;
  };
  website_analytics?: {
    id: string;
    store_id: string;
    traffic_summary: {
      sessions: number;
      page_views: number;
      bounce_rate: number;
      conversions: number;
      avg_session_duration_sec: number;
    };
    top_pages: Array<{
      url: string;
      views: number;
      conversions: number;
    }>;
    user_demographics: {
      devices: Record<string, number>;
      locations: Record<string, number>;
      age_groups: Record<string, number>;
    };
    created_at: string;
  };
}
