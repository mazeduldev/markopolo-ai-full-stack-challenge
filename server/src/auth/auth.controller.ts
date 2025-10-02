import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  registerUserZodSchema,
  type AuthenticatedRequest,
  type AuthTokens,
  type RegisterUserDto,
} from './dto/auth.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodPipe(registerUserZodSchema))
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
