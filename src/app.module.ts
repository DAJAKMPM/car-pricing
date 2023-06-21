import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/modules/users.module';
import { ReportsModule } from './reports/modules/reports.module';
import { AuthModule } from './auth/modules/auth.module';
import { appSetup } from './config/setup';

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
