import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '@movie/entities/movie.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly repository: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 등록 로직
  async createMovie() {
    const tmdbUrl = `${this.configService.get('MOVIE_URL')}/now_playing?language=en-US&page=1`;

    const config = {
      headers: {
        Authorization: `Bearer ${this.configService.get('MOVIE_TOKEN')}`,
      },
    };

    const { data, status } = await this.httpService
      .get(tmdbUrl, config)
      .toPromise();

    if (status === 200) {
      const results = data.results;

      const movieData = results?.map((data) => ({
        adult: data.adult,
        genre_ids: data.genre_ids,
        mid: data.id,
        original_language: data.original_language,
        original_title: data.original_title,
        overview: data.overview,
        popularity: data.popularity,
        poster_path: 'https://image.tmdb.org/t/p/w500' + data.poster_path,
      }));

      return await this.repository.save(movieData);
    }
  }
}
