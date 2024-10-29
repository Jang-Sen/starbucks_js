import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Provider } from '@user/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.NAVER,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID'),
      clientSecret: configService.get('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, displayName } = profile;
    const { email, profile_image } = profile._json;

    try {
      const user = await this.userService.getUserBy('email', email);

      if (user.provider !== provider) {
        throw new HttpException(
          `이미 ${user.provider}에 연동되어 있는 계정입니다.`,
          HttpStatus.CONFLICT,
        );
      }

      done(null, user);
    } catch (e) {
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          provider,
          username: displayName,
          email,
          profileImg: profile_image,
        });

        done(null, newUser);
      }
    }
  }
}
