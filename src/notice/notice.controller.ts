import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NoticeService } from '@notice/notice.service';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
import { UpdateNoticeDto } from '@notice/dto/update-notice.dto';
import { BufferedFile } from '@minio-client/interface/file.model';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 전체 조회
  @Get('/all')
  @ApiOperation({ summary: '전체 조회' })
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.noticeService.findAll(pageOptionsDto);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', description: '공지사항 ID', example: 'uuid' })
  @ApiOperation({ summary: '상세 조회' })
  async findNoticeId(@Param('id') id: string) {
    return await this.noticeService.findNoticeId(id);
  }

  @Post()
  @ApiBody({ type: CreateNoticeDto })
  @ApiOperation({ summary: '생성' })
  async create(@Body() dto: CreateNoticeDto) {
    return await this.noticeService.create(dto);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', description: '공지사항 ID', example: 'uuid' })
  @ApiOperation({ summary: '삭제' })
  async delete(@Param('id') id: string) {
    return await this.noticeService.delete(id);
  }

  @Put('/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiParam({ name: 'id', description: '공지사항 ID', example: 'uuid' })
  @ApiBody({
    description: '공지사항 변경 DTO',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          description: '공지사항 파일들(3개 까지 첨부 가능)',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: {
          type: 'string',
          example: '공지사항 제목',
          description: '글 제목',
        },
        description: {
          type: 'string',
          example: '공지사항 내용 입니다.',
          description: '글 내용',
        },
      },
    },
  })
  @ApiOperation({ summary: '수정' })
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() dto?: UpdateNoticeDto,
    @UploadedFiles() files?: BufferedFile[],
  ) {
    return await this.noticeService.update(id, dto, files);
  }
}
