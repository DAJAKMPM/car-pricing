import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateMeetingDto } from './dto/request/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  async create(body: CreateMeetingDto) {
    const meeting = this.meetingRepository.create({ ...body });

    return await this.meetingRepository.save(meeting);
  }

  async findByIds(ids: number[]) {
    const tasks = this.meetingRepository.findBy({ id: In(ids) });

    return tasks;
  }
}
