import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }
}