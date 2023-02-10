import * as bcrypt from 'bcrypt';
import { CategoryEntity } from 'src/post/entities/category.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../auth/models/roles.model';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('users')
export class User extends DefaultEntity {

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @OneToMany(type => PostEntity, post => post.user)
  posts: PostEntity[];

  @OneToMany(type => CategoryEntity, category => category.user)
  categories: CategoryEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
