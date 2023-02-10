import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEntity } from 'src/post/entities/category.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import * as request from 'supertest';
import { createConnection, Connection } from 'typeorm';
import { AppModule } from './../src/app.module';
import { userAdmin, userCustomer, userLogin } from './utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminJwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    const connection = app.get(Connection);
    await connection.synchronize(true);

    await connection
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([userAdmin])
      .execute();
  });

  afterAll(() => {
    app.close();
  });

  describe('Authentication', () => {
    //some tests are of  => https://gist.github.com/mjclemente/e13995c29376f0924eb2eacf98eaa5a6

    it('authenticates user with valid credentials and provides a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('api/v1/auth/login')
        .send({ email: userLogin.email, password: userLogin.password })
        .expect(200);

      adminJwtToken = response.body.accessToken;
      expect(adminJwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });

    it('fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('api/v1/auth/login')
        .send({ email: userLogin.email, password: 'wrong' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });

    it('fails to authenticate user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('api/v1/auth/login')
        .send({ email: 'nobody@example.com', password: 'test' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });
  });

  describe('Users', () => {
    let customerId: number;
    it('should create a customer user', async () => {
      const response = await request(app.getHttpServer())
        .post('api/v1/users')
        .send({
          email: userCustomer.email,
          password: userCustomer.password,
          firstName: userCustomer.firstName,
          lastName: userCustomer.lastName,
        })
        .expect(201);

      customerId = response.body.id;
      expect(response.body.email).toBe(userCustomer.email);
      expect(response.body.firstName).toBe(userCustomer.firstName);
      expect(response.body.lastName).toBe(userCustomer.lastName);
    });

    it('should not create a customer user with an invalid email', async () => {
      await request(app.getHttpServer())
        .post('api/v1/users')
        .send({
          email: 'invalid',
          password: userCustomer.password,
          firstName: userCustomer.firstName,
          lastName: userCustomer.lastName,
        })
        .expect(400);
    });

    it('should get a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`api/v1/users/${customerId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.email).toBe(userCustomer.email);
    });

    it('should list all users', async () => {
      const response = await request(app.getHttpServer())
        .get('api/v1/users')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('should update a customer user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`api/v1/users/${customerId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send({
          email: userCustomer.email,
          password: userCustomer.password,
          firstName: 'Jordi',
          lastName: 'test',
        })
        .expect(200);

      expect(response.body.email).toBe(userCustomer.email);
      expect(response.body.firstName).toBe('Jordi');
      expect(response.body.lastName).toBe('test');
    });

    it('should delete a customer user', async () => {
      await request(app.getHttpServer())
        .delete(`api/v1/users/${customerId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);
    });

    it('should not delete a customer user with an invalid id', async () => {
      await request(app.getHttpServer())
        .delete('api/v1/users/0')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(404);
    });
  });

  describe('Categories and Posts API', () => {
    let token: string;
    let user: User;
  
    beforeEach(async () => {
      // create a user
      user = new User();
      user.firstName = 'testuser';
      user.email = 'testuser@example.com';
      user.password = 'testpassword';
  
      // log in the user to get a JWT token
      const response = await request(app)
        .post('api/v1/auth/login')
        .send({
          email: user.email,
          password: 'testpassword',
        });
      token = response.body.token;
    });
  
    describe('GET api/v1/categories', () => {
      it('should return a list of categories', async () => {
        // create a category
        const category = new CategoryEntity();
        category.name = 'Test Category';
        category.user = user;
  
        // send the GET /categories request
        const response = await request(app)
          .get('api/v1/categories')
          .set('Authorization', `Bearer ${token}`);
  
        // check the response
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toEqual({
          id: category.id,
          name: category.name,
        });
      });
    });
  
    describe('GET api/v1/posts', () => {
      it('should return a list of posts', async () => {
        // create a category
        const category = new CategoryEntity();
        category.name = 'Test Category';
        category.user = user;
  
        // create a post
        const post = new PostEntity();
        post.title = 'Test Post';
        post.content = 'Test post content';
        post.user = user;
        post.category = category;
  
        // send the GET /posts request
        const response = await request(app)
          .get('api/v1/posts')
          .set('Authorization', `Bearer ${token}`);
  
        // check the response
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toEqual({
          id: post.id,
          title: post.title,
          content: post.content,
          category: {
            id: category.id,
            name: category.name,
          },
          user: {
            id: user.id,
            email: user.email,
          },
        });
      });
    })
  })
});
