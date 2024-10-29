import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreeOfTermDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  agreeFourTeen: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  agreeOfTerm: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  agreeOfPersonalInfo: boolean;

  @IsBoolean()
  @ApiProperty()
  agreeOfMarketing?: boolean;

  @IsBoolean()
  @ApiProperty()
  agreeOfEvent?: boolean;
}
