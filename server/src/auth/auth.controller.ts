import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  AuthenticatedRequest,
  AuthTokens,
  RegisterUserDto,
} from './dto/auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerUserDto: RegisterUserDto): Promise<AuthTokens> {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Req() req: AuthenticatedRequest): Promise<AuthTokens> {
    return this.authService.login(req.user);
  }
}
