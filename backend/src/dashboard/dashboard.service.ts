import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labour, LabourStatus } from '../labours/entities/labour.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';
import { Payroll, PaymentStatus } from '../payroll/entities/payroll.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Labour)
    private readonly labourRepo: Repository<Labour>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,
  ) {}

  async getStats() {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalLabours,
      activeLabours,
      totalProjects,
      activeProjects,
      todayAttendances,
      payrolls,
    ] = await Promise.all([
      this.labourRepo.count(),
      this.labourRepo.count({ where: { status: LabourStatus.ACTIVE } }),
      this.projectRepo.count(),
      this.projectRepo.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
      this.attendanceRepo.find({
        where: { date: today },
        relations: ['labour', 'project'],
      }),
      this.payrollRepo.find(),
    ]);

    const presentToday = todayAttendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT,
    ).length;
    const halfDayToday = todayAttendances.filter(
      (a) => a.status === AttendanceStatus.HALF_DAY,
    ).length;
    const absentToday = todayAttendances.filter(
      (a) => a.status === AttendanceStatus.ABSENT,
    ).length;

    let pendingPayrollAmount = 0;
    let pendingPayrollCount = 0;
    let paidPayrollAmount = 0;
    let paidPayrollCount = 0;

    for (const p of payrolls) {
      if (p.paymentStatus === PaymentStatus.PENDING) {
        pendingPayrollAmount += Number(p.netPayable || 0);
        pendingPayrollCount++;
      } else {
        paidPayrollAmount += Number(p.netPayable || 0);
        paidPayrollCount++;
      }
    }

    // Trade breakdown
    const tradeCountsRaw = await this.labourRepo
      .createQueryBuilder('labour')
      .select('labour.trade', 'trade')
      .addSelect('COUNT(*)', 'count')
      .groupBy('labour.trade')
      .getRawMany();

    const tradeBreakdown = tradeCountsRaw.map((t) => ({
      trade: t.trade,
      count: parseInt(t.count, 10),
    }));

    // Recent 5 attendances
    const recentAttendances = await this.attendanceRepo.find({
      order: { id: 'DESC' },
      take: 6,
      relations: ['labour', 'project'],
    });

    return {
      today,
      labours: {
        total: totalLabours,
        active: activeLabours,
        inactive: totalLabours - activeLabours,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
      },
      attendanceToday: {
        totalRecorded: todayAttendances.length,
        present: presentToday,
        halfDay: halfDayToday,
        absent: absentToday,
        attendanceRate:
          activeLabours > 0
            ? Math.round(((presentToday + halfDayToday * 0.5) / activeLabours) * 100)
            : 0,
      },
      payroll: {
        pendingAmount: Number(pendingPayrollAmount.toFixed(2)),
        pendingCount: pendingPayrollCount,
        paidAmount: Number(paidPayrollAmount.toFixed(2)),
        paidCount: paidPayrollCount,
      },
      tradeBreakdown,
      recentAttendances,
    };
  }
}
