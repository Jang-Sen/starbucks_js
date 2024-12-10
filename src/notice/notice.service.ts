import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from '@notice/entities/notice.entity';
import { Repository } from 'typeorm';
import { MinioClientService } from '@minio-client/minio-client.service';
import { PageDto } from '@common/dto/page.dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageMetaDto } from '@common/dto/page-meta.dto';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
import { UpdateNoticeDto } from '@notice/dto/update-notice.dto';
import { BufferedFile } from '@minio-client/interface/file.model';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly repository: Repository<Notice>,
    private readonly minioClientService: MinioClientService,
  ) {}

  // 전체 조회
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Notice>> {
    const queryBuilder = this.repository.createQueryBuilder('notice');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('notice.title LIKE :keyword', {
        keyword: `%${pageOptionsDto.keyword}%`,
      });
    }

    queryBuilder
      .orderBy('notice.createdAt', pageOptionsDto.order)
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
  }

  // 상세 조회
  async findNoticeId(id: string) {
    const notice = await this.repository.findOneBy({ id });

    if (!notice) {
      throw new NotFoundException('일치하는 글을 찾을 수 없습니다.');
    }

    return notice;
  }

  // 생성
  async create(dto: CreateNoticeDto) {
    const notice = this.repository.create(dto);

    if (!notice) {
      throw new HttpException('생성 불가', HttpStatus.BAD_REQUEST);
    }
    await this.repository.save(notice);

    return notice;
  }

  // 삭제
  async delete(id: string): Promise<string> {
    const result = await this.repository.delete(id);

    if (!result) {
      throw new NotFoundException('삭제할 글을 찾을 수 없습니다');
    }

    return '삭제 완료';
  }

  // 수정
  async update(
    id: string,
    dto?: UpdateNoticeDto,
    files?: BufferedFile[],
  ): Promise<string> {
    const notice = await this.findNoticeId(id);
    const noticeFileUrl = files.length
      ? await this.minioClientService.uploadNoticeFiles(notice, files, 'notice')
      : [];

    await this.repository.update(id, {
      ...dto,
      files: noticeFileUrl,
    });

    return '수정 완료';
  }
}
