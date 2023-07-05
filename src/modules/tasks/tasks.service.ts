import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateTaskDto } from './dto/request/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(body: CreateTaskDto) {
    const task = this.taskRepository.create({ ...body });

    return await this.taskRepository.save(task);
  }

  async findByIds(ids: number[]) {
    const tasks = await this.taskRepository.find({
      where: { id: In(ids) },
      relations: ['employee'],
    });

    return tasks;
  }
}
