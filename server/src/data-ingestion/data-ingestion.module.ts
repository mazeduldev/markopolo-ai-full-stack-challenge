import { Module } from '@nestjs/common';
import { DataSourceConnection } from './entities/data-source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConnectionController } from './data-source-connection.controller';
import { DataSourceConnectionService } from './data-source-connection.service';
import { GoogleAdsSummary } from './entities/google-ads-summary.entity';
import { ShopifySummary } from './entities/shopify-summary.entity';
import { WebsiteAnalyticsSummary } from './entities/website-analytics-summary.entity';
import { AgentModule } from 'src/agent/agent.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataSourceConnection,
      GoogleAdsSummary,
      ShopifySummary,
      WebsiteAnalyticsSummary,
    ]),
    AgentModule,
    StoreModule,
  ],
  controllers: [DataSourceConnectionController],
  providers: [DataSourceConnectionService],
})
export class DataIngestionModule {}
