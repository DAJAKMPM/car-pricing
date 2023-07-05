import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Serialize } from '@/interceptors/serialize.interceptor';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { ApproveReportDto } from './dto/request/approve-report.dto';
import { CreateReportDto } from './dto/request/create-report.dto';
import { GetEstimateDto } from './dto/request/get-estimate.dto';
import { ReportDto } from './dto/response/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  @Serialize(ReportDto)
  async createReport(@Body() body: CreateReportDto, @Req() req: Request) {
    return this.reportsService.create(body, req.user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  @Serialize(ReportDto)
  approvedReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(+id, body.approved);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
