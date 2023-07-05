import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { CreateTaskDto } from './dto/request/create-task.dto';
import { TaskDto } from './dto/response/task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  @Serialize(TaskDto)
  async createTask(@Body() body: CreateTaskDto) {
    return await this.tasksService.create(body);
  }
}
