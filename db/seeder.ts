import { Connection, EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { CategoryEntity } from 'src/post/entities/category.entity';
import * as bcrypt from 'bcrypt';


function hashPassword(): Promise<string> {
    const password = process.env.SEED_USER_PASSWORD;
    return new Promise((resolve, reject) => {
      const salt = bcrypt.genSaltSync(10);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
}

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

    if (entity instanceof User) {
        [
            {
              id: 12,
              email: "dex@gmail.com",
              password: await hashPassword(),
              first_name: "dexter",
              last_name: "Mackey"
            },
            {
              id: 12,
              email: "will@gmail.com",
              password: await hashPassword(),
              first_name: "will",
              last_name: "johnson"
            }
          ]
    }

    if (entity instanceof PostEntity) {
      // populate post data
    }

    if (entity instanceof CategoryEntity) {
      // populate category data
    }
  }
}
