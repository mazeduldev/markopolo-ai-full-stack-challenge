import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}
}
