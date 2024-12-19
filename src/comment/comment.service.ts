import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { ProductService } from '@product/product.service';

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
}
