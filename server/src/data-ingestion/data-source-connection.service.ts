import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { Repository } from 'typeorm';
import {
  ConnectionStatus,
  CreateDataSourceConnectionDto,
  DataSourceConnectionViewType,
  dataSourceConnectionViewZodSchema,
  DataSourceType,
} from './dto/data-source-connection.dto';
import { StoreService } from 'src/store/store.service';
import { ShopifySummary } from './entities/shopify-summary.entity';
import { GoogleAdsSummary } from './entities/google-ads-summary.entity';
import { WebsiteAnalyticsSummary } from './entities/website-analytics-summary.entity';
import {
  CreateGoogleAdsSummaryDto,
  CreateGoogleAdsSummaryZodSchema,
} from './dto/google-ads-summary.dto';
import {
  CreateShopifySummaryDto,
  CreateShopifySummaryZodSchema,
} from './dto/shopify-summary.dto';
import {
  CreateWebsiteAnalyticsSummaryDto,
  CreateWebsiteAnalyticsSummaryZodSchema,
} from './dto/website-analytics-summary.dto';
import { AiMockDataGeneratorService } from 'src/ai-mock-data-generator/ai-mock-data-generator.service';

@Injectable()
export class DataSourceConnectionService {
  private readonly logger = new Logger(DataSourceConnectionService.name);

  constructor(
    @InjectRepository(DataSourceConnection)
    private readonly dataSourceConnectionRepository: Repository<DataSourceConnection>,

    @InjectRepository(ShopifySummary)
    private readonly shopifySummaryRepository: Repository<ShopifySummary>,

    @InjectRepository(GoogleAdsSummary)
    private readonly googleAdsSummaryRepository: Repository<GoogleAdsSummary>,

    @InjectRepository(WebsiteAnalyticsSummary)
    private readonly websiteAnalyticsSummaryRepository: Repository<WebsiteAnalyticsSummary>,

    private readonly storeService: StoreService,
    private readonly mockDataGeneratorService: AiMockDataGeneratorService,
  ) {}

  async createConnection(
    createConnectionDto: CreateDataSourceConnectionDto,
    userId: string,
  ) {
    const isExists = await this.dataSourceConnectionRepository.existsBy({
      type: createConnectionDto.type,
      user_id: userId,
    });

    if (isExists) {
      // Allow only one connection per type per user
      throw new BadRequestException('Connection already exists');
    }

    const store = await this.storeService.getStoreByUserId(userId);
    if (!store) {
      throw new NotFoundException('Please create a store first');
    }

    const connection = this.dataSourceConnectionRepository.create({
      ...createConnectionDto,
      user_id: userId,
    });

    const savedConnection =
      await this.dataSourceConnectionRepository.save(connection);

    // Once connection is created, data ingestion pipeline should start
    // This can be implemented using event emitters or message queues in real world applications
    try {
      const dataSummary = await this.mockDataGeneratorService.generateMockData(
        store,
        connection.type,
      );
      this.logger.log(`Generated data summary: ${JSON.stringify(dataSummary)}`);
      await this.saveDataSummary(connection.type, dataSummary, store.id);
    } catch (error) {
      this.logger.error(
        `Failed to ingest data for connection ${savedConnection.id}: ${error.message}`,
      );
    }

    return savedConnection;
  }

  private async saveDataSummary(
    type: DataSourceType,
    dataSummary:
      | CreateGoogleAdsSummaryDto
      | CreateShopifySummaryDto
      | CreateWebsiteAnalyticsSummaryDto,
    storeId: string,
  ) {
    this.logger.log(
      `Saving data summary for store ${storeId} and data source type ${type}`,
    );

    switch (type) {
      case DataSourceType.SHOPIFY: {
        const shopifyData = CreateShopifySummaryZodSchema.parse(dataSummary);
        const shopifySummary = this.shopifySummaryRepository.create({
          ...shopifyData,
          store_id: storeId,
        });
        this.logger.log(
          `Shopify Summary to be saved: ${JSON.stringify(shopifySummary)}`,
        );
        await this.shopifySummaryRepository.save(shopifySummary);
        break;
      }
      case DataSourceType.GOOGLE_ADS: {
        const googleAdsData =
          CreateGoogleAdsSummaryZodSchema.parse(dataSummary);
        const googleAdsSummary = this.googleAdsSummaryRepository.create({
          ...googleAdsData,
          store_id: storeId,
        });
        this.logger.log(
          `Google Ads Summary to be saved: ${JSON.stringify(googleAdsSummary)}`,
        );
        await this.googleAdsSummaryRepository.save(googleAdsSummary);
        break;
      }
      case DataSourceType.WEBSITE_ANALYTICS: {
        const websiteAnalyticsData =
          CreateWebsiteAnalyticsSummaryZodSchema.parse(dataSummary);
        const websiteAnalyticsSummary =
          this.websiteAnalyticsSummaryRepository.create({
            ...websiteAnalyticsData,
            store_id: storeId,
          });
        this.logger.log(
          `Website Analytics Summary to be saved: ${JSON.stringify(websiteAnalyticsSummary)}`,
        );
        await this.websiteAnalyticsSummaryRepository.save(
          websiteAnalyticsSummary,
        );
        break;
      }
      default:
        throw new Error('Unsupported data source type');
    }
  }

  async toggleConnection(connectionId: string, userId: string) {
    const connection = await this.dataSourceConnectionRepository.findOne({
      where: { id: connectionId, user_id: userId },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    connection.status =
      connection.status === ConnectionStatus.CONNECTED
        ? ConnectionStatus.DISCONNECTED
        : ConnectionStatus.CONNECTED;

    return this.dataSourceConnectionRepository.save(connection);
  }

  async getConnections(
    userId: string,
  ): Promise<DataSourceConnectionViewType[]> {
    const connections = await this.dataSourceConnectionRepository.find({
      where: { user_id: userId },
    });

    return connections.map((connection) =>
      dataSourceConnectionViewZodSchema.parse(connection),
    );
  }

  async getConnectionByTypeAndUserId(
    type: DataSourceType,
    userId: string,
  ): Promise<DataSourceConnectionViewType | null> {
    const connection = await this.dataSourceConnectionRepository.findOne({
      where: { type, user_id: userId },
    });

    if (!connection) {
      return null;
    }

    return dataSourceConnectionViewZodSchema.parse(connection);
  }
}
