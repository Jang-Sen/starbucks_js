import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notice extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column({ nullable: true })
  public views?: number;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  public files?: string[];
}
