import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Sse,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
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
  ): Promise<{ threadId: string; content: CreateCampaignDto | string }> {
    const campaign = await this.chatService.generateCampaign(
      body.content,
      body.thread_id,
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
  ): Observable<MessageEvent> {
    return this.chatService
      .generateCampaignStream(body.content, body.thread_id, req.user.id)
      .pipe(
        map(
          (data) =>
            ({
              type: 'message',
              data: JSON.stringify({
                threadId: data.threadId,
                chunk: data.data,
              }),
            }) as MessageEvent,
        ),
      );
  }

  // todo: add pagination in real world implementation
  @Get('threads')
  getChatThreadsByUser(@Req() req: AuthenticatedRequest) {
    return this.chatService.getChatThreads(req.user.id);
  }

  @Get('/threads/:threadId')
  getChatThreadById(
    @Param('threadId') threadId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.chatService.getChatThreadById(threadId, req.user.id);
  }
}
