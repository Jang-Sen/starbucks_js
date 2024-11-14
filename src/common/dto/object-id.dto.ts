import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ObjectIdDto {
  @IsString()
  @ApiProperty()
  id: string;
}
