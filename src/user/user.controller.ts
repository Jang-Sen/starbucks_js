import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ObjectIdDto } from '@common/dto/object-id.dto';
import { RoleGuard } from '@auth/guard/role.guard';
import { Role } from '@user/entities/role.enum';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageDto } from '@common/dto/page.dto';
import { User } from '@user/entities/user.entity';
import { TokenGuard } from '@auth/guard/token.guard';
import { RequestUserInterface } from '@auth/interface/requestUser.interface';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { BufferedFile } from '@minio-client/interface/file.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
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

  // 프로필 변경 API
  @Put()
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('profileImg'))
  @ApiBody({
    description: '프로필 이미지 변경',
    schema: {
      type: 'object',
      properties: {
        profileImg: {
          type: 'string',
          format: 'binary',
          description: 'profileImg',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateUserProfile(
    @Req() req: RequestUserInterface,
    @Body() dto: UpdateUserDto,
    @UploadedFile() profileImg?: BufferedFile,
  ) {
    return await this.userService.updateUserInfo(req.user, dto, profileImg);
  }
}
