import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { Provider } from '@user/entities/provider.enum';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.LOCAL,
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  // 검증 함수
  async validate(email: string, password: string) {
    return await this.authService.login({ email, password });
  }
}
