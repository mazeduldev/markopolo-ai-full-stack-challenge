import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload, userMinimalZodSchema } from '../auth.types';
import { ConfigService } from '@nestjs/config';
import type { Env } from 'src/config/env.zod';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private configService: ConfigService<Env>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return userMinimalZodSchema.parse(user);
  }
}
