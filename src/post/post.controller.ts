import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CategoryEntity } from './entities/category.entity';
import { UsersService } from 'src/users/services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly userService: UsersService,
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.postRepository.find({
      relations: ['category', 'user'],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.postRepository.findOne({ id }, {
      relations: ['category', 'user'],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() post: PostEntity,
    @Body('categoryId') categoryId: number,
    @Body('userId') userId: number,
  ) {
    const category = await this.categoryRepository.findOne({ where: {id: categoryId} });
    const user = await this.userService.findOne(userId);

    post.category = category;
    post.user = user;

    return await this.postRepository.save(post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() post: PostEntity, @Body('userId') userId: number) {
    const originalPost = await this.postRepository.findOne({id} , {
      relations: ['user'],
    });

    if (originalPost.user.id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    originalPost.title = post.title;
    originalPost.content = post.content;

    return await this.postRepository.save(originalPost);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Body('userId') userId: number) {
    const post = await this.postRepository.findOne({ id }, {
      relations: ['user'],
    });
    if (post.user.id !== userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
  
      return await this.postRepository.remove(post);
    }
  }

  @Controller('categories')
  export class CategoriesController {
    constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}
  
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
      return await this.categoryRepository.find();
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: number) {
      return await this.categoryRepository.findOne({ where: {id: id} });
    }
  
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() category: CategoryEntity) {
      return await this.categoryRepository.save(category);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() category: CategoryEntity) {
      let originalCategory = await this.categoryRepository.findOne({ where: {id}});
      originalCategory.name = category.name;
      return await this.categoryRepository.save(originalCategory);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return await this.categoryRepository.delete(id);
    }
  }


  

