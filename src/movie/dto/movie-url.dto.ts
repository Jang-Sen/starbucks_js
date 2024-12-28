import { IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovieUrlDto {
  @IsString()
  @ApiProperty({ description: '영화 리스트', example: 'now_playing' })
  region: string;

  @IsString()
  @ApiPropertyOptional({
    description: '영화 개봉 지역',
    example: 'en-US',
    default: 'en-US',
  })
  language?: string;

  @IsNumber()
  @ApiPropertyOptional({
    description: '영화 리스트 페이지',
    example: 1,
    default: 1,
  })
  page?: number;
}
