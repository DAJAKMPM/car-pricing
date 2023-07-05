import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeetingsModule } from '../meetings/meetings.module';
import { TasksModule } from '../tasks/tasks.module';

import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [
    TasksModule,
    MeetingsModule,
    TypeOrmModule.forFeature([Employee, ContactInfo]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [TypeOrmModule, EmployeesService],
})
export class EmployeesModule {}
