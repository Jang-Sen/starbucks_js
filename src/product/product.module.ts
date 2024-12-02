import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@product/entities/product.entity';
import { ProductController } from '@product/product.controller';
import { ProductService } from '@product/product.service';
import { MinioClientModule } from '@minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), MinioClientModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
