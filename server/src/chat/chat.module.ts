import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatThread } from './chat-thread.entity';
import { AgentModule } from 'src/agent/agent.module';
import { ChatService } from './chat.service';

@Module({
  imports: [AgentModule, TypeOrmModule.forFeature([ChatThread, ChatMessage])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
