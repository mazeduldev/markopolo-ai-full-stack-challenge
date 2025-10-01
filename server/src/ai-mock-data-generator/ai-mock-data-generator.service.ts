import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { DataSourceType } from 'src/data-ingestion/data-source-connection.type';
import {
  CreateGoogleAdsSummaryDto,
  CreateGoogleAdsSummaryZodSchema,
} from 'src/data-ingestion/dto/google-ads-summary.dto';
import {
  CreateShopifySummaryDto,
  CreateShopifySummaryZodSchema,
} from 'src/data-ingestion/dto/shopify-summary.dto';
import {
  CreateWebsiteAnalyticsSummaryDto,
  CreateWebsiteAnalyticsSummaryZodSchema,
} from 'src/data-ingestion/dto/website-analytics-summary.dto';

/**
 * This service would contain methods to generate mock data to make this demo app work.
 */
@Injectable()
export class AiMockDataGeneratorService implements OnModuleInit {
  private readonly logger = new Logger(AiMockDataGeneratorService.name);
  private openai: OpenAI;
  private readonly defaultModel = 'gpt-5-nano';

  onModuleInit() {
    this.openai = new OpenAI();
  }

  async generateMockData(
    store: { name: string; url: string },
    provider: DataSourceType,
  ) {
    this.logger.log(
      `Generating mock data for store ${store.name} with provider ${provider}`,
    );

    switch (provider) {
      case DataSourceType.GOOGLE_ADS:
        return this.generateMockDataForGoogleAds(store);
      case DataSourceType.SHOPIFY:
        return this.generateMockDataForShopify(store);
      case DataSourceType.WEBSITE_ANALYTICS:
        return this.generateMockDataForWebsiteAnalytics(store);
      default:
        throw new Error(`Unsupported provider`);
    }
  }

  private async generateMockDataForGoogleAds({
    name,
    url,
  }: {
    name: string;
    url: string;
  }): Promise<CreateGoogleAdsSummaryDto> {
    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: `
You are a helpful assistant that generates mock data for a Google Ads account based on Account Name and URL.
Account Name: ${name}
Account URL: ${url}
`,
      text: {
        format: zodTextFormat(
          CreateGoogleAdsSummaryZodSchema,
          'googleAdsSummary',
        ),
      },
    });

    const googleAdsSummary = response.output_parsed;

    Logger.log(
      `Generated mock data for Google Ads account ${name}: ${JSON.stringify(googleAdsSummary)}`,
    );

    if (!googleAdsSummary) {
      throw new Error('Failed to generate mock data for Google Ads');
    }

    return googleAdsSummary;
  }

  private async generateMockDataForShopify({
    name,
    url,
  }: {
    name: string;
    url: string;
  }): Promise<CreateShopifySummaryDto> {
    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: `
You are a helpful assistant that generates mock data for a Shopify store based on Store Name and URL.
Shop Name: ${name}
Shop URL: ${url}
`,
      text: {
        format: zodTextFormat(CreateShopifySummaryZodSchema, 'shopifySummary'),
      },
    });

    const shopifySummary = response.output_parsed;

    Logger.log(
      `Generated mock data for Shopify store ${name}: ${JSON.stringify(shopifySummary)}`,
    );

    if (!shopifySummary) {
      throw new Error('Failed to generate mock data for Shopify');
    }

    return shopifySummary;
  }

  private async generateMockDataForWebsiteAnalytics({
    name,
    url,
  }: {
    name: string;
    url: string;
  }): Promise<CreateWebsiteAnalyticsSummaryDto> {
    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: `
You are a helpful assistant that generates mock data for website analytics based on Website Name and URL.
Website Name: ${name}
Website URL: ${url}
`,
      text: {
        format: zodTextFormat(
          CreateWebsiteAnalyticsSummaryZodSchema,
          'websiteAnalyticsSummary',
        ),
      },
    });

    const websiteAnalyticsSummary = response.output_parsed;

    Logger.log(
      `Generated mock data for Website Analytics ${name}: ${JSON.stringify(websiteAnalyticsSummary)}`,
    );

    if (!websiteAnalyticsSummary) {
      throw new Error('Failed to generate mock data for Website Analytics');
    }

    return websiteAnalyticsSummary;
  }
}
