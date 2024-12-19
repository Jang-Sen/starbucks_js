import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from '@comment/comment.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestUserInterface } from '@auth/interface/requestUser.interface';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { TokenGuard } from '@auth/guard/token.guard';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:productId')
  @UseGuards(TokenGuard)
  @ApiParam({ name: 'productId', description: '제품 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiOperation({
    summary: '댓글 생성',
    description: '로그인 유저, 댓글쓸 제품, 댓글 내용',
  })
  async create(
    @Req() req: RequestUserInterface,
    @Param('productId') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(req.user, id, dto);
  }
}
