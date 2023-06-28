import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';

import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: await argon2.hash('password'),
      };

      mockUsersService.find.mockResolvedValueOnce([user as User]);

      const result = await authService.validateUser(user.email, 'password');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const user: Partial<User> = {
        email: 'incorrect@test.com',
        password: await argon2.hash('incorrect'),
      };

      mockUsersService.find.mockResolvedValue([]);

      await expect(
        authService.validateUser(user.email, user.password),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: await argon2.hash('password'),
      };

      mockUsersService.find.mockResolvedValueOnce([user as User]);

      await expect(
        authService.validateUser(user.email, 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: await argon2.hash('password'),
      };

      mockUsersService.find.mockResolvedValueOnce([]);
      mockUsersService.create.mockResolvedValueOnce(user as User);

      const result = await authService.signup(user.email, 'password');

      expect(result).toEqual(user);
    });

    it('should throw error if email is already used', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: await argon2.hash('password'),
      };

      mockUsersService.find.mockResolvedValueOnce([user as User]);

      await expect(authService.signup(user.email, 'password')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
