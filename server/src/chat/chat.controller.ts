import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  CreateMessageDto,
  MessageResponseDto,
  ThreadDetailDto,
  ThreadDto,
} from './dto/chat.dto';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import type { TAuthenticatedRequest } from 'src/auth/dto/auth.dto';
import { ZodResponse } from 'nestjs-zod';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiProduces,
} from '@nestjs/swagger';

@Controller('chat')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ZodResponse({ type: MessageResponseDto, status: HttpStatus.CREATED })
  async generateCampaign(
    @Body() body: CreateMessageDto,
    @Req() req: TAuthenticatedRequest,
  ) {
    const campaign = await this.chatService.generateCampaign(
      body.content,
      body.thread_id,
      req.user.id,
    );
    return campaign;
  }

  @Post('stream')
  @Sse('stream')
  @ApiCreatedResponse({
    type: MessageResponseDto,
  })
  @ApiProduces('text/event-stream')
  generateCampaignStream(
    @Body() body: CreateMessageDto,
    @Req() req: TAuthenticatedRequest,
  ): Observable<MessageEvent<MessageResponseDto>> {
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
  @ZodResponse({ type: [ThreadDto], status: HttpStatus.OK })
  getChatThreadsByUser(@Req() req: TAuthenticatedRequest) {
    return this.chatService.getChatThreads(req.user.id);
  }

  @Get('/threads/:threadId')
  @ZodResponse({ type: ThreadDetailDto, status: HttpStatus.OK })
  getChatThreadById(
    @Param('threadId') threadId: string,
    @Req() req: TAuthenticatedRequest,
  ) {
    return this.chatService.getChatThreadById(threadId, req.user.id);
  }
}
