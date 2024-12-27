import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from '@movie/dto/create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
