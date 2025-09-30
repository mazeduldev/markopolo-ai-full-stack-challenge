import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  AuthTokens,
  JwtPayload,
  LoginResponse,
  RegisterUserDto,
  UserMinimal,
  userMinimalZodSchema,
} from './auth.types';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserSecret } from 'src/database/entities/user-secret.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Env } from 'src/config/env.zod';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,
    @InjectRepository(UserSecret)
    private readonly userSecretRepository: Repository<UserSecret>,
  ) {}

  async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.findOne({
      where: { email },
      relations: ['user_secret'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.user_secret.password_hash,
    );

    return isPasswordValid ? userMinimalZodSchema.parse(user) : null;
  }

  async login(user: UserMinimal): Promise<LoginResponse> {
    const tokens = await this.generateTokens(user);
    return { ...tokens, user: userMinimalZodSchema.parse(user) };
  }

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userService.findOne({
      where: { email: registerUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = this.userService.create(registerUserDto);
    const passwordHash = await this.hashPassword(registerUserDto.password);

    const userSecret = this.userSecretRepository.create({
      password_hash: passwordHash,
      user: newUser,
    });

    newUser.user_secret = userSecret;
    await this.userService.save(newUser);

    return this.login(newUser);
  }

  private async generateTokens(user: UserMinimal): Promise<AuthTokens> {
    const accessToken = await this.generateAccessToken(user);
    // const refreshToken = await this.generateRefreshToken(user);
    return { access_token: accessToken };
  }

  private async generateAccessToken(user: UserMinimal): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
    return token;
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
