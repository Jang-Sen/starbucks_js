import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

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
    return await this.authService.login(dto);
  }
}
