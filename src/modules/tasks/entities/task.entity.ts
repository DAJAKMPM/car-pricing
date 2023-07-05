import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Employee } from '@/modules/employees/entities/employee.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, (employee) => employee.tasks, {
    onDelete: 'SET NULL',
  })
  employee: Employee;
}
