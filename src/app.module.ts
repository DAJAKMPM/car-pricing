import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { appSetup } from './config/setup';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appSetup],
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(appSetup().database),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
})
export class AppModule {}
