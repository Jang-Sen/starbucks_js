import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { Product } from '@product/entities/product.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  public contents: string;

  @ManyToOne(() => User, (user) => user.comments)
  public user: User;

  @ManyToOne(() => Product, (product) => product.comments)
  public product: Product;
}
