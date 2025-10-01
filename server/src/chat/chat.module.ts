import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatThread } from './entities/chat-thread.entity';
import { AgentModule } from 'src/agent/agent.module';
import { ChatService } from './chat.service';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatThread, ChatMessage]),
    AgentModule,
    CampaignModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
