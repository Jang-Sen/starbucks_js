import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { Provider } from '@user/entities/provider.enum';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원 등록 로직
  async createUser(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    await this.repository.save(user);

    return user;
  }

  // 회원의 id나 email을 통해 정보 가져오는 로직
  async getUserBy(key: 'id' | 'email', value: string) {
    const user = await this.repository.findOneBy({ [key]: value });

    if (user) {
      return user;
    }

    throw new NotFoundException(`유저의 ${key} 가 존재하지 않습니다.`);
  }

  // 토큰으로 비밀번호 변경하는 로직
  async changePasswordWithToken(token: string, newPassword: string) {
    // 이메일로 받은 토큰이 일치한지 확인
    const { email } = await this.jwtService.verify(token, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN'),
    });

    // 계정이 존재하는지 확인
    const user = await this.getUserBy('email', email);

    // 소셜 로그인은 이용 불가
    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        `소셜 로그인 계정은 사용할 수 없습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 암호화
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, genSalt);

    // 비밀번호 수정
    const result = await this.repository.update(user.id, {
      password: hashedPassword,
    });

    if (!result) {
      throw new BadRequestException('Bad Request');
    }

    return 'Updated Password';
  }
}
