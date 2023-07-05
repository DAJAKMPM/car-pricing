import { Expose, Transform } from 'class-transformer';

import { BaseEmployeeDto } from './base-employee.dto';

export class ContactInfoDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ obj }) => obj?.employee)
  employee: BaseEmployeeDto;
}
