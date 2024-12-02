import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
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
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { PageDto } from '@common/dto/page.dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageMetaDto } from '@common/dto/page-meta.dto';
import { MinioClientService } from '@minio-client/minio-client.service';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { BufferedFile } from '@minio-client/interface/file.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly minioClientService: MinioClientService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // 회원 등록 로직
  async createUser(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    await this.repository.save(user);

    return user;
  }

  // 회원 조회
  async getUser(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    // return await this.repository.find();
    const queryBuilder = this.repository.createQueryBuilder('user');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('user.username = :username', {
        username: pageOptionsDto.keyword,
      });
    }

    queryBuilder
      .leftJoinAndSelect('user.agreeOfTerm', 'agreeOfTerm')
      .orderBy('user.createdAt', pageOptionsDto.order)
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
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

  // Refresh Token을 Redis에 담는 로직
  async saveRedisWithRefreshToken(userId: string, refreshToken: string) {
    // 토큰 암호화
    const genSalt = await bcrypt.genSalt(10);
    // JWT 서명 부분 추출
    // const tokenSignature = refreshToken.split('.')[2];
    // JWT token의 경우 전체를 암호화 하는게 낫다 -> 서명 부분만 암호화할 경우, 토큰 위조 가능성 높음
    const hashedRefreshToken = await bcrypt.hash(refreshToken, genSalt);

    // Redis에 저장하기 위해 userId에 대한 암호화한 refresh token 넣기
    await this.cacheManager.set(userId, hashedRefreshToken);
  }

  // Redis에 담긴 Refresh Token & userId에 대한 Refresh Token 검증 로직
  async matchedRefreshToken(userId: string, refreshToken: string) {
    const user = await this.getUserBy('id', userId);
    // console.log('user = ' + user);
    const redisUserId = await this.cacheManager.get(user.id);
    // console.log('redisUserId = ' + redisUserId);

    // JWT 서명 부분 추출
    // const tokenSignature = refreshToken.split('.')[2];
    // console.log('tokenSignature = ' + tokenSignature);

    // 비교
    const result = await bcrypt.compare(refreshToken, redisUserId);

    if (result) {
      return user;
    }
  }

  // 토큰을 이용한 프로필 수정(사진 포함)
  async updateUserInfo(
    user: User,
    dto: UpdateUserDto,
    img?: BufferedFile,
  ): Promise<string> {
    const profileImgUrl = await this.minioClientService.uploadProfileImg(
      user,
      img,
      'profile',
    );
    const result = await this.repository.update(user.id, {
      ...dto,
      profileImg: profileImgUrl,
    });

    if (!result.affected) {
      throw new HttpException(
        '회원을 찾을 수 없습니다.',
        HttpStatus.NO_CONTENT,
      );
    }

    return '업데이트 완료';
  }
}
