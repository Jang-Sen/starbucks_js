import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @IsString()
  @ApiProperty({ description: '제목', example: '공지사항1' })
  title: string;

  @IsString()
  @ApiProperty({
    description: '내용',
    example: '공지사항 입니다.',
  })
  description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '조회수',
    example: 1,
    default: 0,
  })
  views?: number = 0;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description: '첨부 파일',
    example: ['image1.jpg', 'image2.png', 'PDF1.pdf'],
  })
  files?: string[];
}
