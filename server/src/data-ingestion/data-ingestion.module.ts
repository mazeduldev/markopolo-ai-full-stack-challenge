import { Module } from '@nestjs/common';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConnectionController } from './data-source-connection.controller';
import { DataSourceConnectionService } from './data-source-connection.service';
import { DataSourceSummary } from './entities/data-source-summary.entity';
import { GoogleAdsSummary } from './entities/google-ads-summary';
import { ShopifySummary } from './entities/shopify-summary';
import { WebsiteAnalyticsSummary } from './entities/website-analytics-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataSourceConnection,
      DataSourceSummary,
      GoogleAdsSummary,
      ShopifySummary,
      WebsiteAnalyticsSummary,
    ]),
  ],
  controllers: [DataSourceConnectionController],
  providers: [DataSourceConnectionService],
})
export class DataIngestionModule {}
