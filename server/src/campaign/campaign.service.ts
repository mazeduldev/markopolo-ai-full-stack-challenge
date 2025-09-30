import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignChannel } from './campaign-channel.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,

    @InjectRepository(CampaignChannel)
    private readonly campaignChannelRepository: Repository<CampaignChannel>,
  ) {}
}
