import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async find(email?: string) {
    return await this.usersRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attrs);

    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return await this.usersRepository.remove(user);
  }
}
