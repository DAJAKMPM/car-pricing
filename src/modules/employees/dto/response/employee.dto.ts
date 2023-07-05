import { Expose, Type } from 'class-transformer';

import { MeetingDto } from '@/modules/meetings/dto/response/meeting.dto';
import { TaskDto } from '@/modules/tasks/dto/response/task.dto';

import { BaseEmployeeDto } from './base-employee.dto';
import { ContactInfoDto } from './contact-info.dto';

export class EmployeeDto extends BaseEmployeeDto {
  @Expose()
  @Type(() => BaseEmployeeDto)
  manager: BaseEmployeeDto;

  @Expose()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;

  @Expose()
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @Expose()
  @Type(() => MeetingDto)
  meetings: MeetingDto[];
}
