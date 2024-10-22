import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Provider } from '@user/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.KAKAO,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { provider, username } = profile;
    const { profile_image } = profile._json.properties;
    const { email } = profile._json.kakao_account;

    try {
      const user = await this.userService.getUserBy('email', email);

      if (user.provider !== provider) {
        throw new HttpException(
          `이미 ${user.provider}에 연동되어 있는 계정입니다.`,
          HttpStatus.CONFLICT,
        );
      }

      console.log('이미 처리된 계정');
      done(null, user);
    } catch (e) {
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          username: username,
          email: email,
          profileImg: profile_image,
          provider: provider,
        });

        console.log('회원가입 완료');
        done(null, newUser);
      }
    }
  }
}
