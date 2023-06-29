import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Serialize } from '@/interceptors/serialize.interceptor';
import { AuthenticatedGuard } from '@/modules/auth/guards/authenticated.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  private readonly DEFAULT_PASSWORD: string = '123456';

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return await this.usersService.create(body.email, this.DEFAULT_PASSWORD);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAllUsers(@Query('email') email: string) {
    return await this.usersService.find(email);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(+id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
