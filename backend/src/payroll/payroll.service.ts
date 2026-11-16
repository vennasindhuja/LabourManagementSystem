import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payroll, PaymentStatus, PaymentMethod } from './entities/payroll.entity';
import { Labour } from '../labours/entities/labour.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { UpdatePayrollStatusDto } from './dto/update-payroll-status.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    @InjectRepository(Labour)
    private readonly labourRepository: Repository<Labour>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(period?: string, status?: string, labourId?: number): Promise<Payroll[]> {
    const query = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.labour', 'labour');

    if (period && period !== 'All') {
      query.andWhere('payroll.period = :period', { period });
    }

    if (status && status !== 'All') {
      query.andWhere('payroll.paymentStatus = :status', { status });
    }

    if (labourId) {
      query.andWhere('payroll.labourId = :labourId', { labourId });
    }

    query.orderBy('payroll.id', 'DESC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['labour'],
    });
    if (!payroll) {
      throw new NotFoundException(`Payroll record #${id} not found`);
    }
    return payroll;
  }

  async generatePayroll(dto: GeneratePayrollDto): Promise<Payroll[]> {
    let labours: Labour[] = [];
    if (dto.labourId) {
      const labour = await this.labourRepository.findOne({ where: { id: dto.labourId } });
      if (labour) labours.push(labour);
    } else {
      labours = await this.labourRepository.find({ where: { status: 'Active' as any } });
    }

    const createdPayrolls: Payroll[] = [];

    for (const labour of labours) {
      // Find attendances between startDate and endDate
      const attendances = await this.attendanceRepository.find({
        where: {
          labourId: labour.id,
          date: Between(dto.startDate, dto.endDate),
        },
      });

      let daysPresent = 0;
      let halfDays = 0;
      let daysAbsent = 0;
      let totalHours = 0;
      let overtimeHours = 0;

      for (const att of attendances) {
        if (att.status === AttendanceStatus.PRESENT) {
          daysPresent++;
        } else if (att.status === AttendanceStatus.HALF_DAY) {
          halfDays++;
        } else if (att.status === AttendanceStatus.ABSENT) {
          daysAbsent++;
        }
        totalHours += Number(att.hoursWorked || 0);
        overtimeHours += Number(att.overtimeHours || 0);
      }

      const dailyRate = Number(labour.dailyWage || 600);
      const hourlyRate = dailyRate / 8;

      const baseWage = Number((daysPresent * dailyRate + halfDays * (dailyRate * 0.5)).toFixed(2));
      const overtimePay = Number((overtimeHours * hourlyRate * 1.5).toFixed(2));
      const bonus = Number(dto.bonus || 0);
      const deductions = Number(dto.deductions || 0);
      const netPayable = Number((baseWage + overtimePay + bonus - deductions).toFixed(2));

      // Check if payroll already exists for this labour and period
      let payroll = await this.payrollRepository.findOne({
        where: {
          labourId: labour.id,
          period: dto.period,
        },
      });

      if (payroll) {
        payroll.startDate = dto.startDate;
        payroll.endDate = dto.endDate;
        payroll.daysPresent = daysPresent;
        payroll.halfDays = halfDays;
        payroll.daysAbsent = daysAbsent;
        payroll.totalHours = totalHours;
        payroll.overtimeHours = overtimeHours;
        payroll.baseWage = baseWage;
        payroll.overtimePay = overtimePay;
        payroll.bonus = bonus;
        payroll.deductions = deductions;
        payroll.netPayable = netPayable;
      } else {
        payroll = this.payrollRepository.create({
          labourId: labour.id,
          period: dto.period,
          startDate: dto.startDate,
          endDate: dto.endDate,
          daysPresent,
          halfDays,
          daysAbsent,
          totalHours,
          overtimeHours,
          baseWage,
          overtimePay,
          bonus,
          deductions,
          netPayable,
          paymentStatus: PaymentStatus.PENDING,
        });
      }

      const saved = await this.payrollRepository.save(payroll);
      createdPayrolls.push(saved);
    }

    return createdPayrolls;
  }

  async updateStatus(id: number, dto: UpdatePayrollStatusDto): Promise<Payroll> {
    const payroll = await this.findOne(id);
    payroll.paymentStatus = dto.paymentStatus;
    if (dto.paymentMethod) payroll.paymentMethod = dto.paymentMethod;
    if (dto.paymentDate) {
      payroll.paymentDate = dto.paymentDate;
    } else if (dto.paymentStatus === PaymentStatus.PAID) {
      payroll.paymentDate = new Date().toISOString().split('T')[0];
    }
    if (dto.notes !== undefined) payroll.notes = dto.notes;

    return await this.payrollRepository.save(payroll);
  }

  async remove(id: number): Promise<{ message: string }> {
    const payroll = await this.findOne(id);
    await this.payrollRepository.remove(payroll);
    return { message: `Payroll record #${id} removed` };
  }
}
