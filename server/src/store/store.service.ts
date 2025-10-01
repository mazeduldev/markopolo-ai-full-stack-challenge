import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly userService: UserService,
  ) {}

  async create(createStoreDto: CreateStoreDto, userId: string) {
    const isExists = await this.storeRepository.exists({
      where: { user_id: userId },
    });
    if (isExists) {
      // Only one store per user is allowed
      throw new Error('isExists');
    }

    const newStore = this.storeRepository.create({
      ...createStoreDto,
      user_id: userId,
    });

    const user = await this.userService.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('userNotFound');
    }

    user.store = newStore;
    await this.userService.save(user);

    return newStore;
  }

  getStoreByUserId(userId: string) {
    return this.storeRepository.findOne({
      where: { user_id: userId },
    });
  }

  removeByUserId(userId: string) {
    return this.storeRepository.delete({ user_id: userId });
  }
}
