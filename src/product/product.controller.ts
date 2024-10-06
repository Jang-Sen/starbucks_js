import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 전체 데이터 api
  @Get('/all')
  async getAll() {
    return await this.productService.getAll();
  }

  // 상세 데이터 api
  @Get('/:productId')
  async getProductById(@Param('productId') productId: string) {
    return await this.productService.getProductById(productId);
  }

  // 등록 api
  @Post('/create')
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }
}
