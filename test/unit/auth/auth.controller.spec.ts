import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthenticatedGuard } from '@/modules/auth/guards/authenticated.guard';
import { LocalAuthGuard } from '@/modules/auth/guards/local.guard';
import { User } from '@/modules/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    email: 'test@test.com',
    password: 'password',
    admin: true,
  };

  const mockRequest: Partial<Request> = {
    logIn: jest.fn((_user: User, done: (err: any) => void) => {
      done(null);
    }) as jest.Mock,
    logOut: jest.fn(),
    user: mockUser as User,
  };

  const mockResponse: Partial<Response> = {
    send: jest.fn(),
  };

  const mockAuthService: jest.Mocked<Partial<AuthService>> = {
    signup: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: APP_GUARD,
          useClass: LocalAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: AuthenticatedGuard,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('signup', () => {
    it('should signup a user', async () => {
      authService.signup.mockResolvedValue(mockRequest.user as User);

      expect(
        await controller.register(mockUser, mockRequest as Request),
      ).toEqual(mockRequest.user);
      expect(mockRequest.logIn).toHaveBeenCalledWith(
        mockRequest.user,
        expect.any(Function),
      );
    });
  });

  describe('signin', () => {
    it('should login a user', async () => {
      authService.validateUser.mockResolvedValue(mockRequest.user as User);
      expect(await controller.login(mockRequest as Request)).toEqual(
        mockRequest.user,
      );
    });
  });

  describe('signout', () => {
    it('should logout a user', async () => {
      await controller.logout(mockRequest as Request, mockResponse as Response);
      expect(mockRequest.logOut).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith({});
    });
  });
});
