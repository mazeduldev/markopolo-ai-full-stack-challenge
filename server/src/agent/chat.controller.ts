import { Body, Controller, Logger, Post, UsePipes } from '@nestjs/common';
import { CampaignGeneratorService } from './campaign-generator.service';
import { type MessageDto, messageZodSchema } from './chat.types';
import { ZodValidationPipe } from 'src/pipes/zod_validation.pipe';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly campaignGeneratorService: CampaignGeneratorService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(messageZodSchema))
  async generateCampaign(@Body() body: MessageDto) {
    const campaign = await this.campaignGeneratorService.generateCampaign(
      body.content,
    );
    return campaign;
  }
}
