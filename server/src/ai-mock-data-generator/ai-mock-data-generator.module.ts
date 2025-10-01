import { Module } from '@nestjs/common';
import { AiMockDataGeneratorService } from './ai-mock-data-generator.service';

@Module({
  providers: [AiMockDataGeneratorService],
  exports: [AiMockDataGeneratorService],
})
export class AiMockDataGeneratorModule {}
