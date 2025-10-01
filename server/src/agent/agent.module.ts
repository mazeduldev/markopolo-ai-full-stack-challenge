import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignGeneratorAgentService } from './campaign-generator-agent.service';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [ConfigModule, StoreModule],
  providers: [CampaignGeneratorAgentService],
  exports: [CampaignGeneratorAgentService],
})
export class AgentModule {}
