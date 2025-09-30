import { Body, Controller, Logger, Post, Sse, UsePipes } from '@nestjs/common';
import { CampaignGeneratorService } from './campaign-generator.service';
import { type MessageDto, messageZodSchema } from './chat.types';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { Observable } from 'rxjs';
import { CampaignOutputType } from './campaign-generator.types';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    private readonly campaignGeneratorService: CampaignGeneratorService,
  ) {}

  @Post()
  @UsePipes(new ZodPipe(messageZodSchema))
  async generateCampaign(
    @Body() body: MessageDto,
  ): Promise<CampaignOutputType> {
    const campaign = await this.campaignGeneratorService.generateCampaign(
      body.content,
    );
    return campaign;
  }

  @Post('stream')
  @Sse('stream')
  @UsePipes(new ZodPipe(messageZodSchema))
  generateCampaignStream(
    @Body() body: MessageDto,
  ): Observable<CampaignOutputType> {
    return this.campaignGeneratorService.generateCampaignStream(body.content);
  }
}
