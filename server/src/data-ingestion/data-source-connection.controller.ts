import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DataSourceConnectionService } from './data-source-connection.service';
import type { AuthenticatedRequest } from 'src/auth/auth.types';
import {
  dataSourceConnectionZodSchema,
  type CreateDataSourceConnectionDto,
} from './data-source-connection.type';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import { ZodPipe } from 'src/pipes/zod.pipe';

@UseGuards(AccessTokenGuard)
@Controller('data-source-connection')
export class DataSourceConnectionController {
  constructor(
    private readonly dataSourceService: DataSourceConnectionService,
  ) {}

  @Post()
  @UsePipes(new ZodPipe(dataSourceConnectionZodSchema))
  createConnection(
    @Req() request: AuthenticatedRequest,
    @Body() createConnectionDto: CreateDataSourceConnectionDto,
  ) {
    return this.dataSourceService.createConnection(
      createConnectionDto,
      request.user.id,
    );
  }

  @Patch(':id/toggle-connection')
  toggleConnection(
    @Req() request: AuthenticatedRequest,
    @Param('id') connectionId: string,
  ) {
    return this.dataSourceService.toggleConnection(
      connectionId,
      request.user.id,
    );
  }
}
