import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { TokenInterface } from '@auth/interface/token.interface';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true, // Request 객체를 validate 메서드로 전달
    });
  }

  async validate(req: Request, payload: TokenInterface) {
    const refreshToken = req.headers.authorization
      ?.replace('Bearer', '')
      .trim();

    const user = await this.userService.matchedRefreshToken(
      payload.userId,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token 입니다.');
    }

    return user;
  }
}
