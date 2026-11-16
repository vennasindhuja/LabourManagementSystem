import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Labour } from '../labours/entities/labour.entity';
import { Project } from '../projects/entities/project.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Payroll } from '../payroll/entities/payroll.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Labour, Project, Attendance, Payroll])],
  providers: [SeedService],
})
export class SeedModule {}
