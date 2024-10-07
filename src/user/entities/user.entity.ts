import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../product/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public phone: number;

  @Column({ nullable: true })
  public grade: string;
}
