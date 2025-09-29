import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignGeneratorService } from './campaign-generator.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [ConfigModule],
  providers: [CampaignGeneratorService],
  controllers: [ChatController],
})
export class AgentModule {}
