import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@product/entities/product.entity';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { PageDto } from '@common/dto/page.dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageMetaDto } from '@common/dto/page-meta.dto';
import { BufferedFile } from '@minio-client/interface/file.model';
import { MinioClientService } from '@minio-client/minio-client.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly minioClientService: MinioClientService,
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  // 전체 데이터 로직
  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    // return this.repository.find();
    const queryBuilder = this.repository.createQueryBuilder('product');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere(
        `product.name LIKE :keyword OR product.category LIKE :keyword`,
        {
          keyword: `%${pageOptionsDto.keyword}%`,
        },
      );
    }

    queryBuilder
      .orderBy('product.createdAt', pageOptionsDto.order)
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
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
    const product = this.repository.create(dto);
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
  async update(
    id: string,
    dto: UpdateProductDto,
    imgs?: BufferedFile[],
  ): Promise<Product> {
    const product = await this.getProductById(id);
    const productImgsUrl = imgs.length
      ? await this.minioClientService.uploadProductImgs(
          product,
          imgs,
          'product',
        )
      : [];

    await this.repository.update(id, {
      ...dto,
      productImgs: productImgsUrl,
    });

    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    return await this.repository.findOneBy({ id });
  }
}
