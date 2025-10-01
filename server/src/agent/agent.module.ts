import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignGeneratorAgentService } from './campaign-generator-agent.service';
import { MockDataGeneratorService } from './mock-data-generator.service';

@Module({
  imports: [ConfigModule],
  providers: [CampaignGeneratorAgentService, MockDataGeneratorService],
  exports: [CampaignGeneratorAgentService, MockDataGeneratorService],
})
export class AgentModule {}
