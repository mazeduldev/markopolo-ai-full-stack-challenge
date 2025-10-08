import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import { DataSummaryService } from './data-summary.service';
import type { AuthenticatedRequest } from 'src/auth/dto/auth.dto';
import { DataSourceConnectionService } from './data-source-connection.service';
import {
  EConnectionStatus,
  EDataSourceType,
} from './dto/data-source-connection.dto';
import { ZodResponse } from 'nestjs-zod';
import { GoogleAdsSummaryDto } from './dto/google-ads-summary.dto';
import { ShopifySummaryDto } from './dto/shopify-summary.dto';
import { WebsiteAnalyticsSummaryDto } from './dto/website-analytics-summary.dto';
import { CombinedSummaryDto } from './dto/combined-summary.dto';

@UseGuards(AccessTokenGuard)
@Controller('data-summary')
export class DataSummaryController {
  constructor(
    private readonly dataSummaryService: DataSummaryService,
    private readonly dataSourceConnectionService: DataSourceConnectionService,
  ) {}

  @Get('google-ads')
  @ZodResponse({ type: GoogleAdsSummaryDto, status: HttpStatus.OK })
  async getLatestGoogleAdsSummaryByStore(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        EDataSourceType.GOOGLE_ADS,
        userId,
      );

    if (!connection) {
      throw new NotFoundException(
        'No Google Ads connection found for the user',
      );
    }

    const dataSummary =
      await this.dataSummaryService.getLatestGoogleAdsSummaryByUserId(userId);

    if (!dataSummary) {
      throw new NotFoundException('No Google Ads summary found for the store');
    }

    return dataSummary;
  }

  @Get('shopify')
  @ZodResponse({ type: ShopifySummaryDto, status: HttpStatus.OK })
  async getLatestShopifySummaryByStore(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        EDataSourceType.SHOPIFY,
        userId,
      );

    if (!connection) {
      throw new NotFoundException('No Shopify connection found for the user');
    }

    const dataSummary =
      await this.dataSummaryService.getLatestShopifySummaryByUserId(userId);

    if (!dataSummary) {
      throw new NotFoundException('No Shopify summary found for the store');
    }

    return dataSummary;
  }

  @Get('website-analytics')
  @ZodResponse({ type: WebsiteAnalyticsSummaryDto, status: HttpStatus.OK })
  async getLatestWebsiteAnalyticsSummaryByStore(
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const connection =
      await this.dataSourceConnectionService.getConnectionByTypeAndUserId(
        EDataSourceType.WEBSITE_ANALYTICS,
        userId,
      );

    if (!connection) {
      throw new NotFoundException(
        'No Website Analytics connection found for the user',
      );
    }

    const dataSummary =
      await this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByUserId(
        userId,
      );

    if (!dataSummary) {
      throw new NotFoundException(
        'No Website Analytics summary found for the store',
      );
    }

    return dataSummary;
  }

  @Get()
  @ZodResponse({ type: CombinedSummaryDto, status: HttpStatus.OK })
  async getAvailableDataSummaryForStore(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;

    const connections = (
      await this.dataSourceConnectionService.getConnections(userId)
    ).filter((c) => c.status === EConnectionStatus.CONNECTED);

    if (connections.length === 0) {
      throw new NotFoundException('No data source connections found for user');
    }

    const promises = connections.map((connection) => {
      switch (connection.type) {
        case EDataSourceType.GOOGLE_ADS:
          return this.dataSummaryService.getLatestGoogleAdsSummaryByUserId(
            userId,
          );
        case EDataSourceType.SHOPIFY:
          return this.dataSummaryService.getLatestShopifySummaryByUserId(
            userId,
          );
        case EDataSourceType.WEBSITE_ANALYTICS:
          return this.dataSummaryService.getLatestWebsiteAnalyticsSummaryByUserId(
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
