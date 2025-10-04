export interface Campaign {
  campaign_title: string;
  target_audience: string;
  message: {
    headline: string;
    body: string;
    call_to_action?: {
      label: string;
      url: string;
    };
  };
  channels: string[];
  timeline: {
    start_date: string;
    end_date: string;
  };
  budget: string;
  expected_metrics: {
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
    roi: number;
  };
}
