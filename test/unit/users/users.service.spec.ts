import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUserRepository: jest.Mocked<Partial<Repository<User>>> = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: 'password',
      };

      const hashedUser: Partial<User> = {
        email: user.email,
        password: await argon2.hash(user.password),
      };

      userRepository.create.mockReturnValue(hashedUser as User);
      userRepository.save.mockResolvedValueOnce(hashedUser as User);

      const result = await service.create(user.email, user.password);

      expect(result).toEqual(hashedUser);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const user: Partial<User> = {
        id: 11,
        email: 'test@gmail.com',
      };

      const filterOptions: FindOptionsWhere<User> = {
        id: user.id,
      };

      userRepository.findOneBy.mockResolvedValueOnce(user as User);

      const result = await service.findOne(user.id);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith(filterOptions);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should find all users', async () => {
      const users: Partial<User>[] = [
        {
          id: 11,
          email: 'test@gmail.com',
        },
      ];

      userRepository.find.mockResolvedValueOnce(users as User[]);

      const result = await service.find();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user: Partial<User> = {
        id: 11,
        email: 'test@gmail.com',
      };

      const updatedUser: Partial<User> = {
        id: 11,
        email: 'testing@gmail.com',
      };

      const filterOptions: FindOptionsWhere<User> = {
        id: user.id,
      };

      userRepository.findOneBy.mockResolvedValueOnce(user as User);
      userRepository.save.mockResolvedValueOnce(updatedUser as User);

      const result = await service.update(user.id, { ...updatedUser });

      expect(result).toEqual(updatedUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith(filterOptions);
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user: Partial<User> = {
        id: 11,
        email: 'test@gmail.com',
      };

      const filterOptions: FindOptionsWhere<User> = {
        id: user.id,
      };

      userRepository.findOneBy.mockResolvedValueOnce(user as User);
      userRepository.remove.mockResolvedValueOnce(user as User);

      const result = await service.remove(user.id);

      expect(result).toEqual(user);
      expect(userRepository.findOneBy).toHaveBeenCalledWith(filterOptions);
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
