import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterUserResponseDto,
  RegisterUserDto,
  LoginUserDto,
  type TAuthenticatedRequest,
  LoginUserResponseDto,
} from './dto/auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { ZodResponse } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: RegisterUserResponseDto, status: HttpStatus.CREATED })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ZodResponse({ type: LoginUserResponseDto, status: HttpStatus.OK })
  login(@Req() req: TAuthenticatedRequest, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(req.user);
  }
}
