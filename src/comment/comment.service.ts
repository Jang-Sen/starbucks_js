import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { ProductService } from '@product/product.service';
import { UpdateCommentDto } from '@comment/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    private readonly productService: ProductService,
  ) {}

  // 등록
  async createComment(
    user: User,
    productId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const product = await this.productService.getProductById(productId);

    const comment = this.repository.create({
      user,
      product,
      ...createCommentDto,
    });

    await this.repository.save(comment);

    return comment;
  }

  // 조회(제품 ID)
  async findCommentByProductId(productId: string) {
    const product = await this.productService.getProductById(productId);

    const comments = await this.repository.find({
      where: {
        product: {
          id: product.id,
        },
      },
      relations: {
        user: true,
        product: true,
      },
    });

    if (!comments) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    return comments;
  }

  // 삭제
  async deleteComment(user: User, commentId: string): Promise<string> {
    const comment = await this.repository.findOne({
      where: {
        id: commentId,
      },
      relations: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('본인이 작성한 댓글만 삭제 가능합니다.');
    }

    await this.repository.remove(comment);

    return '삭제 완료';
  }

  // 수정
  async updateComment(
    user: User,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<string> {
    const comment = await this.repository.findOne({
      where: {
        id: commentId,
      },
      relations: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('본인이 작성한 댓글만 수정 가능합니다.');
    }

    Object.assign(comment, updateCommentDto);
    await this.repository.save(comment);

    return '수정 완료';
  }
}
