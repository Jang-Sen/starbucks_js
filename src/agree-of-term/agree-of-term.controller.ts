import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateAgreeOfTermDto } from '@root/agree-of-term/dto/create-agree-of-term.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateAgreeOfTermDto } from '@root/agree-of-term/dto/update-agree-of-term.dto';
import { TokenGuard } from '@auth/guard/token.guard';
import { RequestUserInterface } from '@auth/interface/requestUser.interface';
import { AgreeOfTermService } from '@root/agree-of-term/agree-of-term.service';

@ApiTags('terms')
@Controller('agree-of-term')
export class AgreeOfTermController {
  constructor(private readonly agreeOfTermService: AgreeOfTermService) {}

  // 이용약관 생성 API
  @Post()
  @UseGuards(TokenGuard)
  @ApiBody({ type: CreateAgreeOfTermDto })
  @ApiBearerAuth()
  async createAgreeOfTerm(
    @Req() req: RequestUserInterface,
    @Body() dto: CreateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.create(req.user, dto);
  }

  // 이용약관 수정 API
  @Put()
  @UseGuards(TokenGuard)
  @ApiBody({ type: CreateAgreeOfTermDto })
  @ApiBearerAuth()
  async updateAgreeOfTerm(
    @Req() req: RequestUserInterface,
    @Body() dto: UpdateAgreeOfTermDto,
  ) {
    return await this.agreeOfTermService.update(req.user, dto);
  }
}
