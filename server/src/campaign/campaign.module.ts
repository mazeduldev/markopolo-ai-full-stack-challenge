import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { CampaignChannel } from './entities/campaign-channel.entity';
import { CampaignService } from './campaign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, CampaignChannel])],
  providers: [CampaignService],
})
export class CampaignModule {}
