import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new BadRequestException('User not found!');

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials!');

    return user;
  }

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) throw new BadRequestException('Email is in use!');

    const newUser = await this.usersService.create(email, password);

    return newUser;
  }
}
