import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignGeneratorAgentService } from './campaign-generator-agent.service';

@Module({
  imports: [ConfigModule],
  providers: [CampaignGeneratorAgentService],
  exports: [CampaignGeneratorAgentService],
})
export class AgentModule {}
