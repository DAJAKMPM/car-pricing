import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthenticateUserDto } from '../dto/authenticate-user.dto';
import { LocalAuthGuard } from '../guards/local.guard';
import { Request, Response } from 'express';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UserDto } from '@/users/dto/user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { noop } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async register(@Body() body: AuthenticateUserDto, @Req() req: Request) {
    const user = await this.authService.signup(body.email, body.password);

    req.logIn(user, noop);

    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Serialize(UserDto)
  @Post('/signin')
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/signout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logOut(noop);
    res.send({});
  }
}
