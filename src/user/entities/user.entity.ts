import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { BaseEntity } from '@product/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Provider } from '@user/entities/provider.enum';
import { AgreeOfTerm } from '@root/agree-of-term/entities/agree-of-term.entity';

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

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agreeOfTerm: AgreeOfTerm;

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
        await gravatar.url(this.profileImg, {
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
