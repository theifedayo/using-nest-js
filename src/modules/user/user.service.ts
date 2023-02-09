import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: UserRegisterDto): Promise<void> {
    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
}


as