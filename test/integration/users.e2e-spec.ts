import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MockAuthenticatedGuard,
  TestDatabaseManagementService,
} from '@test/utils/setup';
import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { AuthenticatedGuard } from '@/modules/auth/guards/authenticated.guard';
import { UsersService } from '@/modules/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let testDbManagementService: TestDatabaseManagementService;
  let createdUserId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestDatabaseManagementService],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue(new MockAuthenticatedGuard())
      .compile();

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

    await testDbManagementService.clearDatabase();

    const newUser = await usersService.create('random@test.com', 'password');
    createdUserId = newUser.id;
  });

  afterEach(async () => {
    await testDbManagementService.clearDatabase();
    await app.getHttpServer().close();
    await app.close();
  });

  it('/users/:id (GET) - Success', async () => {
    return request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdUserId);
        expect(res.body.email).toEqual('random@test.com');
      });
  });

  it('/users/:id (GET) - Not Found', async () => {
    return request(app.getHttpServer()).get('/users/99999').expect(404).expect({
      message: 'User not found!',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/users (GET) - Success', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(createdUserId);
        expect(res.body[0].email).toEqual('random@test.com');
      });
  });

  it('/users/:id (DELETE) - Success', async () => {
    return request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .expect(200)
      .expect({
        email: 'random@test.com',
      });
  });

  it('/users/:id (DELETE) - Not Found', async () => {
    return request(app.getHttpServer())
      .delete('/users/99999')
      .expect(404)
      .expect({
        message: 'User not found!',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('/users/:id (PATCH) - Success', async () => {
    return request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send({ email: 'test2@test.com' })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdUserId);
        expect(res.body.email).toEqual('test2@test.com');
      });
  });

  it('/users/:id (PATCH) - Not Found', async () => {
    return request(app.getHttpServer())
      .patch('/users/99999')
      .send({ email: 'test2@test.com' })
      .expect(404)
      .expect({
        message: 'User not found!',
        error: 'Not Found',
        statusCode: 404,
      });
  });

  it('/users/:id (PATCH) - Bad Request', async () => {
    return request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send({ email: 'invalidEmail' })
      .expect(400);
  });
});
