import { forwardRef, Module } from '@nestjs/common';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConnectionController } from './data-source-connection.controller';
import { DataSourceConnectionService } from './data-source-connection.service';
import { GoogleAdsSummary } from './entities/google-ads-summary.entity';
import { ShopifySummary } from './entities/shopify-summary.entity';
import { WebsiteAnalyticsSummary } from './entities/website-analytics-summary.entity';
import { StoreModule } from 'src/store/store.module';
import { DataSummaryService } from './data-summary.service';
import { DataSummaryController } from './data-summary.controller';
import { AiMockDataGeneratorModule } from 'src/ai-mock-data-generator/ai-mock-data-generator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataSourceConnection,
      GoogleAdsSummary,
      ShopifySummary,
      WebsiteAnalyticsSummary,
    ]),
    AiMockDataGeneratorModule,
    forwardRef(() => StoreModule),
  ],
  controllers: [DataSourceConnectionController, DataSummaryController],
  providers: [DataSourceConnectionService, DataSummaryService],
  exports: [DataSummaryService, DataSourceConnectionService],
})
export class DataIngestionModule {}
