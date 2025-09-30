import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignGeneratorAgentService } from 'src/agent/campaign-generator-agent.service';
import { ChatThread } from './chat-thread.entity';
import { ChatMessage } from './chat-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    private readonly campaignGeneratorAgentService: CampaignGeneratorAgentService,

    @InjectRepository(ChatThread)
    private readonly chatThreadRepository: Repository<ChatThread>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  generateCampaign(prompt: string) {
    return this.campaignGeneratorAgentService.generateCampaign(prompt);
  }

  generateCampaignStream(prompt: string) {
    return this.campaignGeneratorAgentService.generateCampaignStream(prompt);
  }
}
