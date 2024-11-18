import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
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
import { EmailDto } from '@user/dto/email.dto';
import { UserService } from '@user/user.service';
import { ChangePasswordDto } from '@user/dto/change-password.dto';
import { RefreshTokenGuard } from '@auth/guard/refresh-token.guard';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 회원가입 API
  @Post('/signup')
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.create(dto);
    await this.authService.signupMail(user.email);

    return { user };
  }

  // 로그인 API
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async login(@Req() req: RequestUserInterface, @Res() res: Response) {
    const user = req.user;
    const { token: accessToken, cookie: accessCookie } =
      this.authService.generateToken(user.id, 'access');
    const { token: refreshToken, cookie: refreshCookie } =
      this.authService.generateToken(user.id, 'refresh');

    // refresh token -> redis 담기
    await this.userService.saveRedisWithRefreshToken(user.id, refreshToken);

    // token -> cookie에 담기
    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    res.send({ user });
  }

  // 로그인 이후 토큰 기반으로 정보 조회 API
  @Get()
  @UseGuards(TokenGuard)
  @ApiBearerAuth()
  async authenticate(@Req() req: RequestUserInterface) {
    return req.user;
  }

  // access token 갱신 API
  @Get('/refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  async refresh(@Req() req: RequestUserInterface, @Res() res: Response) {
    const user = req.user;

    const { token, cookie } = this.authService.generateToken(user.id, 'access');

    res.setHeader('Set-Cookie', [cookie]);

    res.send({ user });
  }

  // 이메일로 비밀번호 변경 토큰 전송 API
  @Post('/find/password')
  async findPassword(@Body() dto: EmailDto) {
    return await this.authService.findPasswordWithMail(dto.email);
  }

  // 비밀번호 변경 API
  @Post('/change/password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.userService.changePasswordWithToken(
      dto.token,
      dto.newPassword,
    );
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
  async googleLoginCallback(
    @Req() req: RequestUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;
    const { cookie: accessCookie } = this.authService.generateToken(
      user.id,
      'access',
    );
    const { token: refreshToken, cookie: refreshCookie } =
      this.authService.generateToken(user.id, 'refresh');

    await this.userService.saveRedisWithRefreshToken(user.id, refreshToken);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    res.send({ user });
    // return { user };
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
  async kakaoLoginCallback(
    @Req() req: RequestUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;
    const { cookie: accessCookie } = this.authService.generateToken(
      user.id,
      'access',
    );
    const { token: refreshToken, cookie: refreshCookie } =
      this.authService.generateToken(user.id, 'refresh');

    await this.userService.saveRedisWithRefreshToken(user.id, refreshToken);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    res.send({ user });
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
  async naverLoginCallback(
    @Req() req: RequestUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;
    const { cookie: accessCookie } = this.authService.generateToken(
      user.id,
      'access',
    );
    const { token: refreshToken, cookie: refreshCookie } =
      this.authService.generateToken(user.id, 'refresh');

    await this.userService.saveRedisWithRefreshToken(user.id, refreshToken);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    res.send({ user });
  }

  // 이메일로 인증번호 발송 API
  @Post('/email/send')
  async emailOTP(@Body('email') email: string) {
    return await this.authService.sendEmailOTP(email);
  }
}
