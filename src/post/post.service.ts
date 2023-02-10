import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number): Promise<PostEntity> {
    return this.postRepository.findOne({ id }, {
      relations: ['category', 'user'],
    });
  }

  async create(post: PostEntity): Promise<PostEntity> {
    return await this.postRepository.save(post);
  }

  async update(id: number, post: PostEntity): Promise<void> {
    await this.postRepository.update(id, post);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    return await this.categoryRepository.save(category);
  }

  async update(id: number, category: CategoryEntity): Promise<void> {
    await this.categoryRepository.update(id, category);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}