import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async create(post: Post): Promise<Post> {
    return await this.postRepository.save(post);
  }

  async update(id: number, post: Post): Promise<void> {
    await this.postRepository.update(id, post);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async create(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async update(id: number, category: Category): Promise<void> {
    await this.categoryRepository.update(id, category);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}