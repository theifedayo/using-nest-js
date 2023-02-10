import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(type => CategoryEntity, category => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(type => User, user => user.posts)
  user: User;
}