import * as bcrypt from 'bcrypt';
import ms from 'ms';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  AuthTokens,
  JwtPayload,
  LoginResponse,
  RegisterUserDto,
  UserMinimal,
  userMinimalZodSchema,
} from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Secret } from 'src/auth/entities/secret.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Env } from 'src/config/env.zod';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,
    private readonly storeService: StoreService,
    @InjectRepository(Secret)
    private readonly userSecretRepository: Repository<Secret>,
  ) {}

  async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.findOne({
      where: { email },
      relations: ['secret'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.secret.password_hash,
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

    const { store, ...userDto } = registerUserDto;

    const newUser = this.userService.create(userDto);
    const passwordHash = await this.hashPassword(registerUserDto.password);

    const userSecret = this.userSecretRepository.create({
      password_hash: passwordHash,
      user: newUser,
    });
    newUser.secret = userSecret;

    const savedUser = await this.userService.save(newUser);
    const newStore = await this.storeService.createAndSave(store, savedUser.id);

    this.logger.log(
      `Created new user with ID: ${savedUser.id} and associated store with ID: ${newStore.id}`,
    );

    return this.login(newUser);
  }

  private async generateTokens(user: UserMinimal): Promise<AuthTokens> {
    const accessToken = await this.generateAccessToken(user);
    // const refreshToken = await this.generateRefreshToken(user);
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');
    const expiresInMs = this.parseExpirationToMilliseconds(expiresIn);
    return { access_token: accessToken, access_token_expires_in: expiresInMs };
  }

  private parseExpirationToMilliseconds(expiresIn: unknown): number {
    if (typeof expiresIn === 'number') {
      if (expiresIn < 0) throw new Error('expiresIn cannot be negative.');
      return Math.round(expiresIn * 1000); // Convert seconds to milliseconds
    }

    if (typeof expiresIn === 'string') {
      const result = ms(expiresIn as ms.StringValue);
      if (typeof result !== 'number' || result < 0) {
        throw new Error(`Invalid expiresIn format: "${expiresIn}"`);
      }
      return result;
    }

    throw new Error(`Invalid expiresIn type: ${typeof expiresIn}`);
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
