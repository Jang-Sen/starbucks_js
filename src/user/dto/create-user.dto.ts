import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Provider } from '@user/entities/provider.enum';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  phone?: number;

  @IsString()
  provider?: Provider;

  @IsString()
  profileImg?: string;

  @ApiProperty({ type: CreateAgreeOfTermDto })
  agreeOfTerm?: AgreeOfTerm;
}
