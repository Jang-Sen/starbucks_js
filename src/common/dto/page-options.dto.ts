import { Order } from '@common/constant/order.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: '검색어',
  })
  readonly keyword?: string;

  @IsOptional()
  @IsEnum(Order)
  @ApiPropertyOptional({
    description: '정렬 기준(기본으로 오름차순)',
    enum: Order,
    default: Order.ASC,
  })
  readonly order?: Order = Order.ASC;

  @IsOptional()
  // @IsInt()
  @ApiPropertyOptional({
    description: '현재 페이지',
    default: 1,
  })
  readonly page?: number = 1;

  @IsOptional()
  // @IsInt()
  // @Max(50)
  @ApiPropertyOptional({
    description: '현재 페이지에서 보여지는 수',
    maximum: 50,
    default: 10,
  })
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
