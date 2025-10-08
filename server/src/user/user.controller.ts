import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import { UserDto, type AuthenticatedRequest } from 'src/auth/dto/auth.dto';
import { ZodResponse } from 'nestjs-zod';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  @Get('me')
  @ZodResponse({ type: UserDto, status: 200 })
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
