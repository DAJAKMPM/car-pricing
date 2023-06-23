import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthenticateUserDto } from '../dto/authenticate-user.dto';
import type { IUserSession } from '../interfaces/user-session.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async register(
    @Body() body: AuthenticateUserDto,
    @Session() session: IUserSession,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async login(
    @Body() body: AuthenticateUserDto,
    @Session() session: IUserSession,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
}
