import { User } from '@/modules/users/entities/user.entity';

import 'express';

declare module 'express' {
  interface Request extends Request {
    user: User;
  }
}
