import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import { DataSummaryService } from './data-summary.service';
import type { AuthenticatedRequest } from 'src/auth/dto/auth.dto';
import { DataSourceConnectionService } from './data-source-connection.service';
import { DataSourceType } from './dto/data-source-connection.dto';

@UseGuards(AccessTokenGuard)
@Controller('data-summary')
export class DataSummaryController {
  constructor(
    private readonly dataSummaryService: DataSummaryService,
    private readonly dataSourceConnectionService: DataSourceConnectionService,
  ) {}

  @Get('google-ads/:storeId')
  async getLatestGoogleAdsSummaryByStore(
    @Param('storeId') storeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        DataSourceType.GOOGLE_ADS,
        userId,
      );

    if (!connection) {
      throw new NotFoundException(
        'No Google Ads connection found for the user',
      );
    }

    const dataSummary =
      await this.dataSummaryService.getLatestGoogleAdsSummaryByStoreIdAndUserId(
        storeId,
        userId,
      );

    if (!dataSummary) {
      throw new NotFoundException('No Google Ads summary found for the store');
    }

    return dataSummary;
  }

  @Get('shopify/:storeId')
  async getLatestShopifySummaryByStore(
    @Param('storeId') storeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        DataSourceType.SHOPIFY,
        userId,
      );

    if (!connection) {
      throw new NotFoundException('No Shopify connection found for the user');
    }

    const dataSummary =
      await this.dataSummaryService.getLatestShopifySummaryByStoreIdAndUserId(
        storeId,
        userId,
      );

    if (!dataSummary) {
      throw new NotFoundException('No Shopify summary found for the store');
    }

    return dataSummary;
  }

  @Get('website-analytics/:storeId')
  async getLatestWebsiteAnalyticsSummaryByStore(
    @Param('storeId') storeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        DataSourceType.WEBSITE_ANALYTICS,
        userId,
      );

    if (!connection) {
      throw new NotFoundException(
        'No Website Analytics connection found for the user',
      );
    }

    const dataSummary =
      await this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByStoreIdAndUserId(
        storeId,
        userId,
      );

    if (!dataSummary) {
      throw new NotFoundException(
        'No Website Analytics summary found for the store',
      );
    }

    return dataSummary;
  }

  @Get('/store/:storeId')
  async getAvailableDataSummaryForStore(
    @Param('storeId') storeId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const connections =
      await this.dataSourceConnectionService.getConnections(userId);
    if (connections.length === 0) {
      throw new NotFoundException('No data source connections found for user');
    }

    const promises = connections.map((connection) => {
      switch (connection.type) {
        case DataSourceType.GOOGLE_ADS:
          return this.dataSummaryService.getLatestGoogleAdsSummaryByStoreIdAndUserId(
            storeId,
            userId,
          );
        case DataSourceType.SHOPIFY:
          return this.dataSummaryService.getLatestShopifySummaryByStoreIdAndUserId(
            storeId,
            userId,
          );
        case DataSourceType.WEBSITE_ANALYTICS:
          return this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByStoreIdAndUserId(
            storeId,
            userId,
          );
        default:
          return Promise.resolve(null);
      }
    });

    const results = await Promise.all(promises);
    return results
      .filter((result) => result != null)
      .reduce(
        (acc, curr) => {
          acc = { ...acc, ...curr };
          return acc;
        },
        {} as Record<'google_ads' | 'shopify' | 'website_analytics', unknown>,
      );
  }
}
