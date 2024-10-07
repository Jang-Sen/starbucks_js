import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  // 회원 등록 로직
  async createUser(dto: CreateUserDto) {
    const user = await this.repository.create(dto);
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
}
