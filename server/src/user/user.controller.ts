import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/passport/access-token.guard';
import type { AuthenticatedRequest } from 'src/auth/dto/auth.dto';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  @Get('me')
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
