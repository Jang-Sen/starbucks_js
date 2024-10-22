import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@user/entities/provider.enum';
import { UserService } from '@user/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.GOOGLE,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    // 데이터 가져올 것 정리
    const { provider, displayName, email, picture } = profile;

    try {
      // 중복 이메일 체크
      const user = await this.userService.getUserBy('email', email);

      if (user.provider !== provider) {
        throw new HttpException(
          `이미 ${user.provider} 에서 가입되어있습니다.`,
          HttpStatus.CONFLICT,
        );
      }

      console.log('이미 가입 되어있는 회원');
      done(null, user);
    } catch (e) {
      // 없을경우 회원가입
      if (e.status === 404) {
        const newUser = await this.userService.createUser({
          username: displayName,
          email: email,
          profileImg: picture,
          provider: provider,
        });

        console.log('회원가입 성공');
        done(null, newUser);
      }
    }
  }
}
