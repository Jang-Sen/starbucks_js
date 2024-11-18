import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameterInterface } from '@common/interface/page-meta-dto-parameter.interface';

export class PageMetaDto {
  @ApiProperty({ description: '현재 페이지' })
  readonly page: number;

  @ApiProperty({ description: '현재 페이지에서 보여지는 수' })
  readonly take: number;

  @ApiProperty({ description: '모든 데이터의 수' })
  readonly itemCount: number;

  @ApiProperty({ description: '모든 페이지 수' })
  readonly pageCount: number;

  @ApiProperty({ description: '다음 페이지가 있는지 여부' })
  readonly nextPage: boolean;

  @ApiProperty({ description: '전 페이지가 있는지 여부' })
  readonly beforePage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameterInterface) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.nextPage = this.page < this.pageCount;
    this.beforePage = this.page > 1;
  }
}
