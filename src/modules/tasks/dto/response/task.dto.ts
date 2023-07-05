import { Expose } from 'class-transformer';

export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
