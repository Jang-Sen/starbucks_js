import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@user/user.service';
import { EmailService } from '@email/email.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenInterface } from '@auth/interface/token.interface';
import { Provider } from '@user/entities/provider.enum';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입 로직
  async create(dto: CreateUserDto) {
    return await this.userService.createUser({
      ...dto,
      provider: Provider.LOCAL,
    });
    // user.password = undefined; // 비밀번호 숨김 -> validation 기능으로 뺌
  }

  // 로그인 로직
  async login(dto: LoginUserDto) {
    // 1. 이메일 체크
    const user = await this.userService.getUserBy('email', dto.email);

    if (!user) {
      throw new HttpException(
        '해당 이메일을 가진 사용자가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. 비밀번호 매칭
    const pass = await bcrypt.compare(dto.password, user.password);

    if (!pass) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. return user
    return user;
  }

  // AccessToken 발행 로직
  // public generateAccessToken(userId: string): {
  //   token: string;
  //   cookie: string;
  // } {
  //   const load: TokenInterface = { userId };
  //
  //   const token = this.jwtService.sign(load, {
  //     secret: this.configService.get('TOKEN_SECRET'),
  //     expiresIn: this.configService.get('TOKEN_EXPIRATION_TIME'),
  //   });
  //
  //   const cookie = `Authentication=${token}; Path=/; Max-Age=${this.configService.get('TOKEN_EXPIRATION_TIME')}`;
  //
  //   return { token, cookie };
  // }

  // Refresh Token 발행 로직
  // public generateRefreshToken(userId: string): {
  //   token: string;
  //   cookie: string;
  // } {
  //   const payload: TokenInterface = { userId };
  //
  //   const token = this.jwtService.sign(payload, {
  //     secret: this.configService.get('REFRESH_TOKEN_SECRET'),
  //     expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
  //   });
  //
  //   const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`;
  //
  //   return { token, cookie };
  // }
  // Token & Cookie 발행 로직
  public generateToken(
    userId: string,
    tokenType: 'access' | 'refresh',
  ): {
    token: string;
    cookie: string;
  } {
    const payload: TokenInterface = { userId };
    const secret = this.configService.get(
      tokenType === 'access' ? 'TOKEN_SECRET' : 'REFRESH_TOKEN_SECRET',
    );
    const expiresIn = this.configService.get(
      tokenType === 'access'
        ? 'TOKEN_EXPIRATION_TIME'
        : 'REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    const cookieName = tokenType === 'access' ? 'Authentication' : 'Refresh';
    const cookie = `${cookieName}=${token}; Path=/; Max-Age=${expiresIn}`;

    return { token, cookie };
  }

  // 이메일로 비밀번호 변경 토큰 받는 로직
  async findPasswordWithMail(email: string) {
    const payload = { email };
    const user = await this.userService.getUserBy('email', email);

    // 소셜 로그인은 사용 불가
    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        `소셜 로그인 계정은 사용할 수 없습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 변경 토큰 생성
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN'),
      expiresIn: this.configService.get('FIND_PASSWORD_EXPIRATION_TIME'),
    });

    // 비밀번호 변경을 위한 front url 주소 및 토큰
    const url = `${this.configService.get('EMAIL_BASE_FRONT_URL')}/change/password?token=${token}`;

    // 이메일로 url 보내기
    await this.emailService.sendMail({
      to: email,
      subject: '안녕하세요. 비밀번호 변경 관련 이메일 입니다.',
      text: `비밀번호 변경 주소: ${url}`,
    });
  }

  // 회원가입 후 이메일로 메세지 보내는 로직
  async signupMail(email: string) {
    return await this.emailService.sendMail({
      to: email,
      subject: '안녕하세요. 스타벅스 장센점 입니다.',
      text: '회원가입이 정상적으로 되었습니다. 감사합니다.',
    });
  }

  // 이메일 인증 로직
  async sendEmailOTP(email: string) {
    const otp = this.generateOTP();

    // 캐시에 저장
    await this.cacheManager.set(email, otp);

    return await this.emailService.sendMail({
      to: email,
      subject: '회원님이 요청하신 인증 번호 입니다.',
      text: `인증번호는 ${otp} 입니다. 감사합니다.`,
    });
  }

  // 랜덤 번호 로직
  generateOTP() {
    let otp = '';

    for (let i = 1; i <= 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    return otp;
  }
}
