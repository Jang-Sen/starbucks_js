import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '@product/product.service';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guard/role.guard';
import { Role } from '@user/entities/role.enum';
import { PageDto } from '@common/dto/page.dto';
import { Product } from '@product/entities/product.entity';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@minio-client/interface/file.model';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 전체 데이터 api
  @Get('/all')
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    return await this.productService.getAll(pageOptionsDto);
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
  @UseInterceptors(FilesInterceptor('imgs'))
  @ApiBody({ type: CreateProductDto })
  @ApiBody({
    description: '제품 이미지 변경',
    schema: {
      type: 'object',
      properties: {
        imgs: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'productImgs',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() imgs?: BufferedFile[],
  ) {
    return await this.productService.update(id, dto, imgs);
  }
}
