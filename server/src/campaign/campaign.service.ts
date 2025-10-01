import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCampaignDto,
  CreateCampaignWithUserDto,
} from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  saveCampaign(
    campaignDto: CreateCampaignDto | CreateCampaignWithUserDto,
    userId?: string,
  ): Promise<Campaign> {
    const campaign = this.campaignRepository.create({
      ...campaignDto,
      ...(userId ? { user_id: userId } : {}),
    });
    return this.campaignRepository.save(campaign);
  }
}
