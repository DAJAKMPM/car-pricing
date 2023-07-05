import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { CreateMeetingDto } from './dto/request/create-meeting.dto';
import { MeetingDto } from './dto/response/meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  @Serialize(MeetingDto)
  async createMeeting(@Body() body: CreateMeetingDto) {
    return await this.meetingsService.create(body);
  }
}
