import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignChannel } from './campaign-channel.entity';
import { CampaignService } from './campaign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, CampaignChannel])],
  providers: [CampaignService],
})
export class CampaignModule {}
