import { User } from '@/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthenticateUserDto } from '../dto/authenticate-user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  deserializeUser(payload: AuthenticateUserDto, done: CallableFunction) {
    done(null, payload);
  }
}
