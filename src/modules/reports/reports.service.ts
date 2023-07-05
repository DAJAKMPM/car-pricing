import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

import { CreateReportDto } from './dto/request/create-report.dto';
import { GetEstimateDto } from './dto/request/get-estimate.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportDto);
    report.user = user;

    return await this.reportsRepository.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportsRepository.findOneBy({ id });

    if (!report) throw new NotFoundException('Report not found!');

    report.approved = approved;

    return await this.reportsRepository.save(report);
  }

  async createEstimate(details: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = details;

    return await this.reportsRepository
      .createQueryBuilder('report')
      .select('AVG(report.price)', 'price')
      .innerJoin(
        (subquery) => {
          return subquery
            .select('*')
            .from(Report, 'subreport')
            .where('subreport.make = :make', { make })
            .andWhere('subreport.model = :model', { model })
            .andWhere('subreport.lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('subreport.lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('subreport.year - :year BETWEEN -3 AND 3', { year })
            .andWhere('subreport.approved IS TRUE')
            .orderBy('ABS(subreport.mileage - :mileage)', 'ASC')
            .limit(3);
        },
        'subreport',
        'report.id = subreport.id',
      )
      .setParameters({ make, model, lng, lat, year, mileage })
      .getRawOne();
  }
}
