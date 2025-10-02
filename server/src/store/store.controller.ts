import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoreService } from './store.service';
import {
  createStoreDtoZodSchema,
  type CreateStoreDto,
} from './dto/create-store.dto';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import type { AuthenticatedRequest } from 'src/auth/dto/auth.dto';

@Controller('store')
@UseGuards(AccessTokenGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UsePipes(new ZodPipe(createStoreDtoZodSchema))
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    try {
      return await this.storeService.createAndSave(createStoreDto, req.user.id);
    } catch (error) {
      if (error instanceof Error && error.message === 'isExists') {
        throw new BadRequestException('Store already exists for this user');
      }
      if (error instanceof Error && error.message === 'userNotFound') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @Get()
  async getStoreByUser(@Req() req: AuthenticatedRequest) {
    const store = await this.storeService.getStoreByUserId(req.user.id);
    if (!store) {
      throw new NotFoundException('Store not found for this user');
    }
    return store;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStoreByUser(@Req() req: AuthenticatedRequest) {
    await this.storeService.removeByUserId(req.user.id);
  }
}
