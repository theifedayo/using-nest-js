import { Connection, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { CategoryEntity } from 'src/post/entities/category.entity';

@EventSubscriber()
export class Seeder implements EntitySubscriberInterface {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return [User, PostEntity, CategoryEntity];
  }

  async afterInsert(event) {
    const { entity } = event;
    const { manager } = this.connection;

    if (entity instanceof User) {
      const user = new User();
      user.username = 'testuser';
      user.email = 'testuser@example.com';
      user.password = 'testpassword';
      await manager.save(user);
    }

    if (entity instanceof PostEntity) {
      const post = new PostEntity();
      post.title = 'Test Post';
      post.content = 'Test post content';
      post.user = await manager.findOne(User, { where: { username: 'testuser' } });
      post.category = await manager.findOne(CategoryEntity, { where: { name: 'Test Category' } });
      await manager.save(post);
    }

    if (entity instanceof CategoryEntity) {
      const category = new CategoryEntity();
      category.name = 'Test Category';
      category.user = await manager.findOne(User, { where: { username: 'testuser' } });
      await manager.save(category);
    }
  }
}
