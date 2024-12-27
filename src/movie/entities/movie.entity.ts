import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Movie extends BaseEntity {
  @Column()
  public adult: boolean;

  @Column({ type: 'simple-array' })
  public genre_ids: number[];

  @Column()
  public mid: number;

  @Column()
  public original_language: string;

  @Column()
  public original_title: string;

  @Column({ type: 'text' })
  public overview: string;

  @Column({ type: 'float' })
  public popularity: number;

  @Column()
  public poster_path: string;
}
