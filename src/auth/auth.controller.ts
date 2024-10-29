import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthService } from '@auth/auth.service';
import { RequestUserInterface } from '@auth/interface/requestUser.interface';
import { LocalAuthGuard } from '@auth/guard/local-auth.guard';
import { TokenGuard } from '@auth/guard/token.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { GoogleAuthGuard } from '@auth/guard/google-auth.guard';
import { KakaoAuthGuard } from '@auth/guard/kakao-auth.guard';
import { NaverAuthGuard } from '@auth/guard/naver-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API
  @Post('/signup')
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.create(dto);
    await this.authService.signupMail(user.email);

    return user;
  }

  // 로그인 API
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async login(@Req() req: RequestUserInterface) {
    const user = req.user;
    const token = this.authService.generateToken(user.id);

    return { user, token };
  }

  // 로그인 이후 토큰 기반으로 정보 조회 API
  @Get()
  @UseGuards(TokenGuard)
  @ApiBearerAuth()
  async authenticate(@Req() req: RequestUserInterface) {
    return req.user;
  }

  // 구글 로그인 API
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  // 구글 로그인 콜백 API
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: RequestUserInterface) {
    const user = req.user;
    const token = this.authService.generateToken(user.id);

    return { user, token };
  }

  // 카카오 로그인 API
  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  // 카카오 로그인 콜백 API
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(@Req() req: RequestUserInterface) {
    const user = req.user;
    const token = this.authService.generateToken(user.id);

    return { user, token };
  }

  // 네이버 로그인 API
  @Get('/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  // 네이버 로그인 콜백 API
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req: RequestUserInterface) {
    const user = req.user;
    const token = this.authService.generateToken(user.id);

    return { user, token };
  }

  // 이메일로 인증번호 발송 API
  @Post('/email/send')
  async emailOTP(@Body('email') email: string) {
    return await this.authService.sendEmailOTP(email);
  }
}
