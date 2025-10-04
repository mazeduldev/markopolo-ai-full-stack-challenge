import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { DataSourceConnectionService } from 'src/data-ingestion/data-source-connection.service';
import {
  ConnectionStatus,
  DataSourceType,
} from 'src/data-ingestion/dto/data-source-connection.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly userService: UserService,
    private readonly dataSummaryService: DataSummaryService,
    @Inject(forwardRef(() => DataSourceConnectionService))
    private readonly dataSourceConnectionService: DataSourceConnectionService,
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

    const connections = (
      await this.dataSourceConnectionService.getConnections(userId)
    ).filter((c) => c.status === ConnectionStatus.CONNECTED);

    if (connections.length === 0) {
      throw new NotFoundException('No data source connections found for user');
    }

    const promises = connections.map((connection) => {
      switch (connection.type) {
        case DataSourceType.GOOGLE_ADS:
          return this.dataSummaryService.getLatestGoogleAdsSummaryByUserId(
            userId,
          );
        case DataSourceType.SHOPIFY:
          return this.dataSummaryService.getLatestShopifySummaryByUserId(
            userId,
          );
        case DataSourceType.WEBSITE_ANALYTICS:
          return this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByUserId(
            userId,
          );
        default:
          return Promise.resolve(null);
      }
    });

    const results = await Promise.all(promises);

    const processedResults = results
      .filter((result) => result != null)
      .reduce(
        (acc, curr) => {
          acc = { ...acc, ...curr };
          return acc;
        },
        {} as Record<'google_ads' | 'shopify' | 'website_analytics', unknown>,
      );

    return {
      store: {
        name: store.name,
        url: store.url,
        currency: store.currency,
        timezone: store.timezone,
      },
      ...processedResults,
    };
  }
}
