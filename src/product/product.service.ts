import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly minioClientService: MinioClientService,
    @InjectRepository(Product)
    private repository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 전체 데이터 로직
  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    // return this.repository.find();

    const redisProduct = await this.cacheManager.get('product');
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
      .leftJoinAndSelect('product.comments', 'comment')
      .orderBy('product.createdAt', pageOptionsDto.order)
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    if (redisProduct) {
      console.log('Redis에 저장된 데이터');
      return new PageDto(redisProduct, pageMetaDto);
    } else {
      console.log('DB에 저장된 데이터 출력 및 Redis에 저장');
      await this.cacheManager.set('product', entities);
      return new PageDto(entities, pageMetaDto);
    }
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

    await this.cacheManager.del('product');

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
