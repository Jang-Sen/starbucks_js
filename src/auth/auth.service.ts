import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  // 회원가입 로직
  async create(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    user.password = undefined; // 비밀번호 숨김

    return user;
  }

  // 로그인 로직
  async login(dto: LoginUserDto) {
    // 1. 이메일 체크
    const user = await this.userService.getUserBy('email', dto.email);
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

  // 회원가입 후 이메일로 메세지 보내는 로직
  async signupMail(email: string) {
    return await this.emailService.sendMail({
      to: email,
      subject: '안녕하세요. 스타벅스 장센점 입니다.',
      text: '회원가입이 정상적으로 되었습니다. 감사합니다.',
    });
  }
}
