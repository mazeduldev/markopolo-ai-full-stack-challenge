import { Module } from '@nestjs/common';
import { DataSourceConnection } from './data-source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConnectionController } from './data-source-connection.controller';
import { DataSourceConnectionService } from './data-source-connection.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataSourceConnection])],
  controllers: [DataSourceConnectionController],
  providers: [DataSourceConnectionService],
})
export class DataIngestionModule {}
