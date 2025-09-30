import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceConnection } from './data-source-connection.entity';
import { Repository } from 'typeorm';
import { CreateDataSourceConnectionDto } from './data-source-connection.type';

@Injectable()
export class DataSourceConnectionService {
  constructor(
    @InjectRepository(DataSourceConnection)
    private readonly dataSourceConnectionRepository: Repository<DataSourceConnection>,
  ) {}

  createConnection(
    createConnectionDto: CreateDataSourceConnectionDto,
    userId: string,
  ) {
    const connection = this.dataSourceConnectionRepository.create({
      ...createConnectionDto,
      user_id: userId,
    });
    return this.dataSourceConnectionRepository.save(connection);
  }
}
