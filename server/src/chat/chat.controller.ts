import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Sse,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { CreateCampaignDto } from 'src/campaign/dto/campaign.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { type MessageDto, messageZodSchema } from './dto/chat.types';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import type { AuthenticatedRequest } from 'src/auth/dto/auth.dto';

@Controller('chat')
@UseGuards(AccessTokenGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UsePipes(new ZodPipe(messageZodSchema))
  async generateCampaign(
    @Body() body: MessageDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreateCampaignDto | string> {
    const campaign = await this.chatService.generateCampaign(
      body.content,
      req.user.id,
    );
    return campaign;
  }

  @Post('stream')
  @Sse('stream')
  @UsePipes(new ZodPipe(messageZodSchema))
  generateCampaignStream(
    @Body() body: MessageDto,
    @Req() req: AuthenticatedRequest,
  ): Observable<any> {
    return this.chatService.generateCampaignStream(body.content, req.user.id);
  }
}
