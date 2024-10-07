import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../product/entities/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';

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

  @Column({ nullable: true })
  public profileImg?: string;

  @BeforeInsert()
  async beforeSave() {
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
}
