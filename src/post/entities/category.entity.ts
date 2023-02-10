import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';


@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => PostEntity, post => post.category)
  posts: PostEntity[];

  @ManyToOne(type => User, user => user.categories)
  user: User;

}
