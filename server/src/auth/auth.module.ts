import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './passport/local.strategy';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AccessTokenStrategy } from './passport/access-token.strategy';
import { AccessTokenGuard } from './passport/access-token.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from './secret.entity';

@Module({
  imports: [UserModule, JwtModule, TypeOrmModule.forFeature([Secret])],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    AccessTokenStrategy,
    AccessTokenGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
