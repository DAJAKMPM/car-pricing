import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UsersModule } from '@/users/modules/users.module';
import { LocalStrategy } from '../utils/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from '../utils/session.serializer';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
