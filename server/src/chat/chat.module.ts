import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatThread } from './chat-thread.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatThread, ChatMessage])],
  controllers: [ChatController],
})
export class ChatModule {}
