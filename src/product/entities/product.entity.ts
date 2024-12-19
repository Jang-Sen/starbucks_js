import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Comment } from '@comment/entities/comment.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true })
  public name: string;

  @Column()
  public price: number;

  @Column()
  public description: string;

  @Column()
  public category: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  public productImgs?: string[];

  @OneToMany(() => Comment, (comment) => comment.product)
  public comments: Comment[];
}
