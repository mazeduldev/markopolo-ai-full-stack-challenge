import { Module } from '@nestjs/common';
import { DataSourceConnection } from './data-source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DataSourceConnection])],
})
export class DataIngestionModule {}
