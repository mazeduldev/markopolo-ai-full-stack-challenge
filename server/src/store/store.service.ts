import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DataSummaryService } from 'src/data-ingestion/data-summary.service';
import { CreateGoogleAdsSummaryZodSchema } from 'src/data-ingestion/dto/google-ads-summary.dto';
import { CreateShopifySummaryZodSchema } from 'src/data-ingestion/dto/shopify-summary.dto';
import { CreateWebsiteAnalyticsSummaryZodSchema } from 'src/data-ingestion/dto/website-analytics-summary.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly userService: UserService,
    private readonly dataSummaryService: DataSummaryService,
  ) {}

  async createAndSave(createStoreDto: CreateStoreDto, userId: string) {
    const isExists = await this.storeRepository.exists({
      where: { user_id: userId },
    });
    if (isExists) {
      // Only one store per user is allowed
      throw new Error('isExists');
    }

    const newStore = this.storeRepository.create({
      ...createStoreDto,
      user_id: userId,
    });

    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('userNotFound');
    }

    user.store = newStore;
    await this.userService.save(user);

    return newStore;
  }

  updateByUserId(userId: string, updateStoreDto: UpdateStoreDto) {
    return this.storeRepository.update(
      {
        user_id: userId,
      },
      updateStoreDto,
    );
  }

  getStoreByUserId(userId: string) {
    return this.storeRepository.findOne({
      where: { user_id: userId },
    });
  }

  removeByUserId(userId: string) {
    return this.storeRepository.delete({ user_id: userId });
  }

  async getStoreDataForCampaignCreation(userId: string) {
    const store = await this.storeRepository.findOne({
      where: { user_id: userId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const [google_ads, shopify, website_analytics] = await Promise.all([
      this.dataSummaryService.getLatestGoogleAdsSummaryByStoreIdAndUserId(
        store.id,
        userId,
      ),
      this.dataSummaryService.getLatestShopifySummaryByStoreIdAndUserId(
        store.id,
        userId,
      ),
      this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByStoreIdAndUserId(
        store.id,
        userId,
      ),
    ]);

    return {
      store: {
        name: store.name,
        url: store.url,
        currency: store.currency,
        timezone: store.timezone,
      },
      google_ads: CreateGoogleAdsSummaryZodSchema.parse(google_ads.google_ads),
      shopify: CreateShopifySummaryZodSchema.parse(shopify.shopify),
      website_analytics: CreateWebsiteAnalyticsSummaryZodSchema.parse(
        website_analytics.website_analytics,
      ),
    };
  }
}
