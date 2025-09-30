import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/auth.types';
import { User } from 'src/database/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  create(registerUserDto: RegisterUserDto) {
    return this.userRepository.create(registerUserDto);
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
