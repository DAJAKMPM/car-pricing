import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseManagementService } from '@test/utils/setup';
import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { UsersService } from '@/modules/users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let testDbManagementService: TestDatabaseManagementService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestDatabaseManagementService],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(
      session({
        secret: process.env.APP_SECRET,
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();

    testDbManagementService = moduleFixture.get(TestDatabaseManagementService);
    usersService = moduleFixture.get(UsersService);
  });

  afterEach(async () => {
    await testDbManagementService.clearDatabase();
    await app.getHttpServer().close();
    await app.close();
  });

  it('/signup - Success', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'tests@test.com', password: 'demo123' })
      .expect(201);
  });

  it('/signup - Email is in use!', async () => {
    await usersService.create('tests@test.com', 'demo123');

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'tests@test.com', password: 'demo123' })
      .expect(400)
      .expect({
        message: 'Email is in use!',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/signin - Success', async () => {
    await usersService.create('tests@test.com', 'demo123');

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'tests@test.com', password: 'demo123' })
      .expect(201);
  });

  it('/signin - User not found!', async () => {
    await usersService.create('tests@test.com', 'demo123');

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: '123@test.com', password: 'demo123' })
      .expect(400)
      .expect({
        message: 'User not found!',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/signin - Invalid Credentials!', async () => {
    await usersService.create('tests@test.com', 'demo123');

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'tests@test.com', password: '123456' })
      .expect(401)
      .expect({
        message: 'Invalid credentials!',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });
});
