import { Expose } from 'class-transformer';

export class BaseEmployeeDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
