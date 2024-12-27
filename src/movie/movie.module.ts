import { Module } from '@nestjs/common';
import { MovieController } from '@movie/movie.controller';
import { MovieService } from '@movie/movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '@movie/entities/movie.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), HttpModule, ConfigModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
