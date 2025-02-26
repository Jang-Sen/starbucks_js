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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { GoogleAuthGuard } from '@auth/guard/google-auth.guard';
import { KakaoAuthGuard } from '@auth/guard/kakao-auth.guard';
import { NaverAuthGuard } from '@auth/guard/naver-auth.guard';
import { EmailDto } from '@user/dto/email.dto';
import { UserService } from '@user/user.service';
import { ChangePasswordDto } from '@user/dto/change-password.dto';
import { RefreshTokenGuard } from '@auth/guard/refresh-token.guard';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 회원가입 API
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: CreateUserDto })
  @ApiConsumes('application/x-www-form-urlencoded')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.authService.create(dto);
    await this.authService.signupMail(user.email);

    return { user };
  }

  // 로그인 API
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginUserDto })
  @ApiConsumes('application/x-www-form-urlencoded')
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

    res.send({ user, accessToken });
  }

  // 로그인 이후 토큰 기반으로 정보 조회 API
  @Get()
  @UseGuards(TokenGuard)
  @ApiOperation({ summary: '정보 조회' })
  @ApiBearerAuth()
  async authenticate(@Req() req: RequestUserInterface) {
    return req.user;
  }

  // access token 갱신 API
  @Get('/refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Access Token 갱신' })
  @ApiBearerAuth()
  async refresh(@Req() req: RequestUserInterface, @Res() res: Response) {
    const user = req.user;

    const { token, cookie } = this.authService.generateToken(user.id, 'access');

    res.setHeader('Set-Cookie', [cookie]);

    res.send({ user });
  }

  // 이메일로 비밀번호 변경 토큰 전송 API
  @Post('/find/password')
  @ApiOperation({ summary: '비밀번호 변경 메일 발송' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async findPassword(@Body() dto: EmailDto) {
    return await this.authService.findPasswordWithMail(dto.email);
  }

  // 비밀번호 변경 API
  @Post('/change/password')
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.userService.changePasswordWithToken(
      dto.token,
      dto.newPassword,
    );
  }

  // 구글 로그인 API
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: '구글 로그인' })
  async googleLogin() {
    return HttpStatus.OK;
  }

  // 구글 로그인 콜백 API
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: '구글 로그인 콜백' })
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
  @ApiOperation({ summary: '카카오 로그인' })
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  // 카카오 로그인 콜백 API
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ summary: '카카오 로그인 콜백' })
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
  @ApiOperation({ summary: '네이버 로그인' })
  async naverLogin() {
    return HttpStatus.OK;
  }

  // 네이버 로그인 콜백 API
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({ summary: '네이버 로그인 콜백' })
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
  @ApiOperation({ summary: '이메일 인증번호 발송' })
  async emailOTP(@Body('email') email: string) {
    return await this.authService.sendEmailOTP(email);
  }

  // 이메일 인증 확인 API
  @Post('/email/check')
  @ApiOperation({ summary: '이메일 인증 확인' })
  async checkEmailOTP(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<boolean> {
    return await this.authService.checkEmailOTP(email, code);
  }
}
