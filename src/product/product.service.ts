import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  // 전체 데이터 로직
  async getAll() {
    return this.repository.find();
  }

  // 상세 데이터 로직
  async getProductById(productId: string) {
    const product = await this.repository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    return product;
  }

  // 등록 로직
  async create(dto: CreateProductDto) {
    const product = await this.repository.create(dto);
    await this.repository.save(product);

    return product;
  }

  // 삭제 로직
  async delete(id: string) {
    const product = await this.repository.delete(id);

    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    return product;
  }

  // 수정 로직
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.repository.update(id, dto);

    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    return product;
  }
}
