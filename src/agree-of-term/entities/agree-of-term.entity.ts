import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@user/entities/user.entity';

@Entity()
export class AgreeOfTerm {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: false })
  public agreeFourTeen: boolean;

  @Column({ default: false })
  public agreeOfTerm: boolean;

  @Column({ default: false })
  public agreeOfPersonalInfo: boolean;

  @Column({ default: false })
  public agreeOfMarketing: boolean;

  @Column({ default: false })
  public agreeOfEvent: boolean;

  @OneToOne(() => User, (user) => user.agreeOfTerm)
  public user: User;
}
