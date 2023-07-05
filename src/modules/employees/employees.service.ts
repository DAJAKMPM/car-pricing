import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MeetingsService } from '../meetings/meetings.service';
import { TasksService } from '../tasks/tasks.service';

import { CreateContactInfoDto } from './dto/request/create-contact-info-dto';
import { CreateEmployeeDto } from './dto/request/create-employee.dto';
import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
    private readonly taskService: TasksService,
    private readonly meetingService: MeetingsService,
  ) {}

  async findEmployeeById(id: number) {
    const employee = await this.employeeRepository.findOneBy({ id });

    if (!employee) throw new NotFoundException('Employee not found!');

    return employee;
  }

  // TODO: convert to patch instead of post
  async createContactInfo(employeeId: number, body: CreateContactInfoDto) {
    const employee = await this.findEmployeeById(employeeId);

    const contactInfo = this.contactInfoRepository.create({ ...body });

    contactInfo.employee = employee;

    return await this.contactInfoRepository.save(contactInfo);
  }

  async createEmployee(body: CreateEmployeeDto) {
    const { name, managerId, contactInfo, meetingIds, taskIds } = body;

    const employee = this.employeeRepository.create({ name });

    const newContactInfo = this.contactInfoRepository.create({
      ...contactInfo,
    });

    employee.contactInfo = newContactInfo;

    if (managerId) {
      const manager = await this.findEmployeeById(managerId);

      employee.manager = manager;
    }

    if (taskIds && taskIds.length) {
      const tasks = await this.taskService.findByIds(taskIds);

      const hasAssignedUsers = tasks.some((task) => !!task.employee);

      if (!tasks || !tasks.length || hasAssignedUsers)
        throw new BadRequestException('Invalid task ids!');

      employee.tasks = tasks;
    }

    if (meetingIds && meetingIds.length) {
      const meetings = await this.meetingService.findByIds(meetingIds);

      if (!meetings || !meetings.length)
        throw new BadRequestException('Invalid task ids!');

      employee.meetings = meetings;
    }

    return await this.employeeRepository.save(employee);
  }

  async removeEmployee(id: number) {
    const employee = await this.findEmployeeById(id);

    return await this.employeeRepository.remove(employee);
  }
}
