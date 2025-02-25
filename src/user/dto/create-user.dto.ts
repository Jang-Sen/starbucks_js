import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Provider } from '@user/entities/provider.enum';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: '홍길동' })
  username: string;

  @IsString()
  @ApiProperty({ example: '123456a!' })
  password?: string;

  @IsEmail()
  @ApiProperty({ example: 'dh789521@gmail.com' })
  email: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  phone?: number;

  @IsString()
  provider?: Provider;

  @IsString()
  @IsOptional()
  profileImg?: string;

  @ApiProperty({ type: CreateAgreeOfTermDto })
  agreeOfTerm?: AgreeOfTerm;
}
