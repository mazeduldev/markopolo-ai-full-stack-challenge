import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DataSourceConnectionService } from './data-source-connection.service';
import type { TAuthenticatedRequest } from 'src/auth/dto/auth.dto';
import {
  DataSourceConnectionViewDto,
  CreateDataSourceConnectionDto,
  DataSourceConnectionDto,
} from './dto/data-source-connection.dto';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import { ZodResponse } from 'nestjs-zod';

@UseGuards(AccessTokenGuard)
@Controller('data-source-connection')
export class DataSourceConnectionController {
  private readonly logger = new Logger(DataSourceConnectionController.name);
  constructor(
    private readonly dataSourceService: DataSourceConnectionService,
  ) {}

  @Post()
  @ZodResponse({ type: DataSourceConnectionDto, status: HttpStatus.CREATED })
  createConnection(
    @Req() request: TAuthenticatedRequest,
    @Body() createConnectionDto: CreateDataSourceConnectionDto,
  ) {
    return this.dataSourceService.createConnection(
      createConnectionDto,
      request.user.id,
    );
  }

  @Patch(':id/toggle-connection')
  @ZodResponse({ type: DataSourceConnectionDto, status: HttpStatus.OK })
  toggleConnection(
    @Param('id') connectionId: string,
    @Req() request: TAuthenticatedRequest,
  ) {
    return this.dataSourceService.toggleConnection(
      connectionId,
      request.user.id,
    );
  }

  @Get()
  @ZodResponse({ type: [DataSourceConnectionViewDto], status: HttpStatus.OK })
  getConnections(@Req() request: TAuthenticatedRequest) {
    return this.dataSourceService.getConnections(request.user.id);
  }
}
