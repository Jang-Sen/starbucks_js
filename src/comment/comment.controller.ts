import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '@comment/comment.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestUserInterface } from '@auth/interface/requestUser.interface';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { TokenGuard } from '@auth/guard/token.guard';
import { UpdateCommentDto } from '@comment/dto/update-comment.dto';

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

  @Get('/:productId')
  @ApiParam({ name: 'productId', description: '제품 ID' })
  @ApiOperation({
    summary: '댓글 조회',
    description: '제품 ID를 통해 조회',
  })
  async findCommentByProduct(@Param('productId') productId: string) {
    return await this.commentService.findCommentByProductId(productId);
  }

  @Delete('/:commentId')
  @UseGuards(TokenGuard)
  @ApiParam({ name: 'commentId', description: '댓글 ID' })
  @ApiOperation({
    summary: '댓글 삭제',
    description: '작성자 본인만 삭제 가능',
  })
  async deleteCommentOnlySelf(
    @Req() req: RequestUserInterface,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentService.deleteComment(req.user, commentId);
  }

  @Put('/:commentId')
  @UseGuards(TokenGuard)
  @ApiParam({ name: 'commentId', description: '댓글 ID' })
  @ApiOperation({
    summary: '댓글 수정',
    description: '작성자 본인만 수정 가능',
  })
  async updateComment(
    @Req() req: RequestUserInterface,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return await this.commentService.updateComment(req.user, commentId, dto);
  }
}
