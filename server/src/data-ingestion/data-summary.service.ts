import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleAdsSummary } from './entities/google-ads-summary.entity';
import { ShopifySummary } from './entities/shopify-summary.entity';
import { WebsiteAnalyticsSummary } from './entities/website-analytics-summary.entity';

@Injectable()
export class DataSummaryService {
  constructor(
    @InjectRepository(GoogleAdsSummary)
    private readonly googleAdsSummaryRepository: Repository<GoogleAdsSummary>,

    @InjectRepository(ShopifySummary)
    private readonly shopifySummaryRepository: Repository<ShopifySummary>,

    @InjectRepository(WebsiteAnalyticsSummary)
    private readonly websiteAnalyticsSummaryRepository: Repository<WebsiteAnalyticsSummary>,
  ) {}

  async getLatestGoogleAdsSummaryByUserId(userId: string) {
    const summary = await this.googleAdsSummaryRepository.findOne({
      where: { store: { user_id: userId } },
      order: { created_at: 'DESC' },
    });
    return {
      google_ads: summary,
    };
  }

  async getLatestShopifySummaryByUserId(userId: string) {
    const summary = await this.shopifySummaryRepository.findOne({
      where: { store: { user_id: userId } },
      order: { created_at: 'DESC' },
    });
    return {
      shopify: summary,
    };
  }

  async getLatestWebsiteAnalyticsSummaryByUserId(userId: string) {
    const summary = await this.websiteAnalyticsSummaryRepository.findOne({
      where: { store: { user_id: userId } },
      order: { created_at: 'DESC' },
    });
    return {
      website_analytics: summary,
    };
  }
}
