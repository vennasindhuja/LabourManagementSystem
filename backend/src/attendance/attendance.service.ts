import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(date?: string, projectId?: number, labourId?: number): Promise<Attendance[]> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.labour', 'labour')
      .leftJoinAndSelect('attendance.project', 'project');

    if (date) {
      query.andWhere('attendance.date = :date', { date });
    }

    if (projectId) {
      query.andWhere('attendance.projectId = :projectId', { projectId });
    }

    if (labourId) {
      query.andWhere('attendance.labourId = :labourId', { labourId });
    }

    query.orderBy('attendance.date', 'DESC');
    query.addOrderBy('labour.id', 'ASC');
    return await query.getMany();
  }

  async findByRange(startDate: string, endDate: string, labourId?: number): Promise<Attendance[]> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.labour', 'labour')
      .leftJoinAndSelect('attendance.project', 'project')
      .where('attendance.date BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (labourId) {
      query.andWhere('attendance.labourId = :labourId', { labourId });
    }

    query.orderBy('attendance.date', 'ASC');
    return await query.getMany();
  }

  async record(dto: RecordAttendanceDto): Promise<Attendance> {
    let attendance = await this.attendanceRepository.findOne({
      where: {
        labourId: dto.labourId,
        date: dto.date,
      },
    });

    const defaultHours =
      dto.status === AttendanceStatus.PRESENT
        ? 8
        : dto.status === AttendanceStatus.HALF_DAY
        ? 4
        : 0;

    const hoursWorked = dto.hoursWorked !== undefined ? dto.hoursWorked : defaultHours;
    const overtimeHours = dto.overtimeHours !== undefined ? dto.overtimeHours : 0;

    if (attendance) {
      attendance.status = dto.status;
      attendance.hoursWorked = hoursWorked;
      attendance.overtimeHours = overtimeHours;
      attendance.projectId = dto.projectId || attendance.projectId;
      attendance.notes = dto.notes !== undefined ? dto.notes : attendance.notes;
    } else {
      attendance = this.attendanceRepository.create({
        labourId: dto.labourId,
        projectId: dto.projectId,
        date: dto.date,
        status: dto.status,
        hoursWorked,
        overtimeHours,
        notes: dto.notes,
      });
    }

    return await this.attendanceRepository.save(attendance);
  }

  async bulkRecord(bulkDto: BulkAttendanceDto): Promise<Attendance[]> {
    const savedRecords: Attendance[] = [];
    for (const recordDto of bulkDto.records) {
      const saved = await this.record(recordDto);
      savedRecords.push(saved);
    }
    return savedRecords;
  }

  async remove(id: number): Promise<{ message: string }> {
    const record = await this.attendanceRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Attendance record #${id} not found`);
    }
    await this.attendanceRepository.remove(record);
    return { message: `Attendance #${id} removed` };
  }
}
