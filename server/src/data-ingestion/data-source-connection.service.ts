import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceConnection } from './data-source-connection.entity';
import { Repository } from 'typeorm';
import {
  ConnectionStatus,
  CreateDataSourceConnectionDto,
  dataSourceConnectionZodSchema,
} from './data-source-connection.type';

@Injectable()
export class DataSourceConnectionService {
  constructor(
    @InjectRepository(DataSourceConnection)
    private readonly dataSourceConnectionRepository: Repository<DataSourceConnection>,
  ) {}

  async createConnection(
    createConnectionDto: CreateDataSourceConnectionDto,
    userId: string,
  ) {
    const isExists = await this.dataSourceConnectionRepository.existsBy({
      type: createConnectionDto.type,
      user_id: userId,
    });

    if (isExists) {
      // Allow only one connection per type per user
      throw new BadRequestException('Connection already exists');
    }

    const connection = this.dataSourceConnectionRepository.create({
      ...createConnectionDto,
      user_id: userId,
    });

    return this.dataSourceConnectionRepository.save(connection);
  }

  async toggleConnection(connectionId: string, userId: string) {
    const connection = await this.dataSourceConnectionRepository.findOne({
      where: { id: connectionId, user_id: userId },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    connection.status =
      connection.status === ConnectionStatus.CONNECTED
        ? ConnectionStatus.DISCONNECTED
        : ConnectionStatus.CONNECTED;

    return this.dataSourceConnectionRepository.save(connection);
  }
}
