import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API
  @Post('/signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.create(dto);
    await this.authService.signupMail(user.email);

    return user;
  }

  // 로그인 API
  @Post('/login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.login(dto);
    const token = this.authService.generateToken(user.id);

    return { user, token };
  }
}
