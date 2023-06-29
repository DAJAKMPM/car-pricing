import { NotFoundException } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticatedGuard } from '@/modules/auth/guards/authenticated.guard';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@test.com',
  };

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: APP_GUARD,
          useClass: AuthenticatedGuard,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      usersService.create.mockResolvedValue(mockUser as User);

      expect(await controller.createUser(mockUser as CreateUserDto)).toEqual(
        mockUser,
      );
      expect(usersService.create).toHaveBeenCalledWith(
        mockUser.email,
        expect.any(String),
      );
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      usersService.find.mockResolvedValue([mockUser as User]);

      expect(await controller.findAllUsers(mockUser.email)).toEqual([mockUser]);
      expect(usersService.find).toHaveBeenCalledWith(mockUser.email);
    });
  });

  describe('findUser', () => {
    it('should return a user', async () => {
      usersService.findOne.mockResolvedValue(mockUser as User);

      expect(await controller.findUser(String(mockUser.id))).toEqual(
        mockUser as User,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      usersService.findOne.mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(
        controller.findUser(String(mockUser.id)),
      ).rejects.toThrowError(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = { email: 'test2@test.com' };
      usersService.update.mockResolvedValue({
        ...(mockUser as User),
        ...(updateData as UpdateUserDto),
      } as User);

      expect(
        await controller.updateUser(
          String(mockUser.id),
          updateData as UpdateUserDto,
        ),
      ).toEqual({
        ...mockUser,
        ...updateData,
      });
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, updateData);
    });

    it('should throw NotFoundException if user is not found', async () => {
      usersService.update.mockImplementation(() => {
        throw new NotFoundException();
      });

      const updateData = { email: 'test2@test.com' };

      await expect(
        controller.updateUser(String(mockUser.id), updateData as UpdateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, updateData);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      usersService.remove.mockResolvedValue(mockUser as User);

      expect(await controller.removeUser(String(mockUser.id))).toEqual(
        mockUser as User,
      );
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      usersService.remove.mockImplementation(() => {
        throw new NotFoundException();
      });

      await expect(controller.removeUser(String(mockUser.id))).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
