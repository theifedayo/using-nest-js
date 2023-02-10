import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from './entities/post.entity';



@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}



@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}