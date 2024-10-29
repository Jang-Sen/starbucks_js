import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';
import { User } from '@user/entities/user.entity';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';
import { UpdateAgreeOfTermDto } from '@root/agree-of-term/dto/update-agree-of-term.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AgreeOfTermService {
  constructor(
    @InjectRepository(AgreeOfTerm)
    private readonly repository: Repository<AgreeOfTerm>,
  ) {}

  // 생성 로직
  async create(user: User, dto: CreateAgreeOfTermDto) {
    const agreeOfTerm = this.repository.create({ user, ...dto });
    await this.repository.save(agreeOfTerm);

    return agreeOfTerm;
  }

  // 수정 로직
  async update(user: User, dto: UpdateAgreeOfTermDto) {
    const result = await this.repository.update(
      { id: user.agreeOfTerm.id },
      dto,
    );

    if (!result.affected) {
      throw new BadRequestException('error');
    }

    return 'update';
  }
}
