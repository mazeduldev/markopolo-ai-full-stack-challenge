import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignGeneratorService } from './campaign-generator.service';

@Module({
  imports: [ConfigModule],
  providers: [CampaignGeneratorService],
})
export class AgentModule {}
