import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  // 삭제 api
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }

  // 수정 api
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.update(id, dto);
  }
}
