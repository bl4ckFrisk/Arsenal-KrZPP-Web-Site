import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'dev_user',
          password: '12345',
          database: 'postgres',
          entities: [User], // Specify your entities here
          synchronize: true, // Set to true for testing, false for production
          logging: ['query', 'error'],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ 
        email: 'testEmail',
        password: 'testPassword'
      }) // Provide valid email and password
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token'); // Check if access_token is returned
      });
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testEmail',
        password: 'testPassword',
        username: 'testN',
        nickname: 'testnick'
      }) // Provide valid registration data
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id'); // Check if user ID is returned
      });
  });
});

  