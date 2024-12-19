import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @ApiProperty({
    description: '댓글 내용',
    example: '정말 맛있게 잘 먹었습니다.',
  })
  contents: string;
}
