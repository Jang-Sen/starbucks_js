import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@product/entities/product.entity';
import { ProductController } from '@product/product.controller';
import { ProductService } from '@product/product.service';
import { MinioClientModule } from '@minio-client/minio-client.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MinioClientModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: 60000,
          limit: 15,
        },
      ],
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
