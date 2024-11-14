import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ObjectIdDto } from '@common/dto/object-id.dto';
import { ApiParam } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guard/role.guard';
import { Role } from '@user/entities/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 전체 조회
  @Get('/all')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  async findUser() {
    return await this.userService.getUser();
  }

  // id에 따른 유저 조회
  @Get('/:id')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  @ApiParam(ObjectIdDto)
  async findUserById(@Param() { id }: ObjectIdDto) {
    return await this.userService.getUserBy('id', id);
  }
}
