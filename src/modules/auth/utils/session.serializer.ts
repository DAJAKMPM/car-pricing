import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { User } from '@/modules/users/entities/user.entity';

import { AuthenticateUserDto } from '../dto/request/authenticate-user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: CallableFunction) {
    const mappedUser = { id: user.id, email: user.email, admin: user.admin };

    done(null, mappedUser);
  }

  deserializeUser(payload: AuthenticateUserDto, done: CallableFunction) {
    done(null, payload);
  }
}
