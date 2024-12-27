import { Controller, Post } from '@nestjs/common';
import { MovieService } from '@movie/movie.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({
    summary: '영화 등록',
    description: '외부 API 값을 갖고와서 DB에 저장',
  })
  async createMovie() {
    return await this.movieService.createMovie();
  }
}
