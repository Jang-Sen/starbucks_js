import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { BaseEntity } from '@common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Provider } from '@user/entities/provider.enum';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';
import { Role } from '@user/entities/role.enum';
import { Comment } from '@comment/entities/comment.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public username: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public phone?: number;

  @Column({ nullable: true })
  public grade?: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  public provider: Provider;

  @Column({ type: 'enum', array: true, enum: Role, default: [Role.USER] })
  @Exclude()
  public roles: Role[];

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agreeOfTerm: AgreeOfTerm;

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments: Comment[];

  @BeforeInsert()
  async beforeSave() {
    try {
      // provider가 local일 경우에만 사용
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        // 패스워드 암호화
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);

        // 프로필 사진 자동생성
        this.profileImg = gravatar.url(this.profileImg, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
