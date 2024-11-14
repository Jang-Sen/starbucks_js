import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guard/role.guard';
import { Role } from '@user/entities/role.enum';

@ApiTags('product')
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
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  @ApiBody({ type: CreateProductDto })
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  // 삭제 api
  @Delete('/:id')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }

  // 수정 api
  @Put('/:id')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN, Role.ADMIN]))
  @ApiBody({ type: CreateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.update(id, dto);
  }
}
