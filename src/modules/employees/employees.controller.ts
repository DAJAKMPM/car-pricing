import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { CreateContactInfoDto } from './dto/request/create-contact-info-dto';
import { CreateEmployeeDto } from './dto/request/create-employee.dto';
import { ContactInfoDto } from './dto/response/contact-info.dto';
import { EmployeeDto } from './dto/response/employee.dto';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  @Serialize(EmployeeDto)
  async createEmployee(@Body() body: CreateEmployeeDto) {
    return await this.employeesService.createEmployee(body);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id/contact-info')
  @Serialize(ContactInfoDto)
  async createContactInfo(
    @Param('id') id: string,
    @Body() body: CreateContactInfoDto,
  ) {
    return await this.employeesService.createContactInfo(+id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async removeEmployee(@Param('id') id: string) {
    return await this.employeesService.removeEmployee(+id);
  }
}
