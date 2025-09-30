import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DataSourceConnectionService } from './data-source-connection.service';
import type { AuthenticatedRequest } from 'src/auth/auth.types';
import type { CreateDataSourceConnectionDto } from './data-source-connection.type';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('data-source-connection')
export class DataSourceConnectionController {
  constructor(
    private readonly dataSourceService: DataSourceConnectionService,
  ) {}

  @Post()
  createConnection(
    @Req() request: AuthenticatedRequest,
    @Body() createConnectionDto: CreateDataSourceConnectionDto,
  ) {
    return this.dataSourceService.createConnection(
      createConnectionDto,
      request.user.id,
    );
  }
}
