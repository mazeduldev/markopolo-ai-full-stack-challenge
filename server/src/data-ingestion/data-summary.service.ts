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

  async getLatestGoogleAdsSummaryByStore(storeId: string) {
    return this.googleAdsSummaryRepository.findOne({
      where: { store_id: storeId },
      order: { created_at: 'DESC' },
    });
  }

  async getLatestShopifySummaryByStore(storeId: string) {
    return this.shopifySummaryRepository.findOne({
      where: { store_id: storeId },
      order: { created_at: 'DESC' },
    });
  }

  async getLatestWebsiteAnalyticsSummaryByStore(storeId: string) {
    return this.websiteAnalyticsSummaryRepository.findOne({
      where: { store_id: storeId },
      order: { created_at: 'DESC' },
    });
  }
}
