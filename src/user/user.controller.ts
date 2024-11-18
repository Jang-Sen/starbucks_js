import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ObjectIdDto } from '@common/dto/object-id.dto';
import { RoleGuard } from '@auth/guard/role.guard';
import { Role } from '@user/entities/role.enum';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageDto } from '@common/dto/page.dto';
import { User } from '@user/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 전체 조회
  @Get('/all')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  async findUser(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.userService.getUser(pageOptionsDto);
  }

  // id에 따른 유저 조회
  @Get('/:id')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  async findUserById(@Param() { id }: ObjectIdDto) {
    return await this.userService.getUserBy('id', id);
  }
}
