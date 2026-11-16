import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labour, LabourStatus } from '../labours/entities/labour.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';
import { Payroll, PaymentStatus, PaymentMethod } from '../payroll/entities/payroll.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

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

  async onApplicationBootstrap() {
    await this.seedInitialData();
  }

  async seedInitialData() {
    const labourCount = await this.labourRepo.count();
    if (labourCount > 0) {
      this.logger.log('Database already seeded. Skipping initial seeding.');
      return;
    }

    this.logger.log('Seeding initial demo data for Labour Management System...');

    // 1. Projects
    const projectsData = [
      {
        name: 'Metro Line Corridor - Pier 42 to 58',
        location: 'Outer Ring Road, North Sector',
        clientName: 'City Urban Transit Corp',
        status: ProjectStatus.IN_PROGRESS,
        startDate: '2026-01-10',
        endDate: '2027-03-31',
        budget: 4500000,
        description: 'Pillar erection, deck slab reinforcement, and overhead guideway construction.',
      },
      {
        name: 'Skyline Grand Towers (Tower B & C)',
        location: 'Cyber City Expressway',
        clientName: 'Skyline Infra Developers',
        status: ProjectStatus.IN_PROGRESS,
        startDate: '2025-09-01',
        endDate: '2027-08-30',
        budget: 8200000,
        description: '24-storey high-rise commercial office complex with multi-tier basement parking.',
      },
      {
        name: 'Greenfield Industrial Warehouse',
        location: 'Sector 18 Logistics Hub',
        clientName: 'Apex LogiCorp Ltd',
        status: ProjectStatus.IN_PROGRESS,
        startDate: '2026-02-15',
        endDate: '2026-12-15',
        budget: 2800000,
        description: 'Prefabricated steel warehouse shed, epoxy flooring, and dock leveller installations.',
      },
      {
        name: 'Riverfront Residential Villas',
        location: 'Riverside Enclave',
        clientName: 'Trident Realty',
        status: ProjectStatus.PLANNED,
        startDate: '2026-12-01',
        endDate: '2028-01-15',
        budget: 5400000,
        description: 'Luxury villa community with perimeter stone work and drainage network.',
      },
    ];

    const savedProjects = await this.projectRepo.save(projectsData);
    this.logger.log(`Created ${savedProjects.length} demo projects.`);

    // 2. Labours
    const laboursData = [
      {
        firstName: 'Ramesh',
        lastName: 'Kumar',
        phone: '+91 98450 12345',
        email: 'ramesh.kumar@example.com',
        trade: 'Mason',
        dailyWage: 850.0,
        status: LabourStatus.ACTIVE,
        address: 'H-24 Shanti Nagar, Ward 4',
        emergencyContact: '+91 98450 12346',
        joiningDate: '2025-06-15',
        notes: 'Senior stone and brick mason with 8 years experience.',
      },
      {
        firstName: 'Suresh',
        lastName: 'Yadav',
        phone: '+91 97110 54321',
        email: 'suresh.yadav@example.com',
        trade: 'Carpenter',
        dailyWage: 800.0,
        status: LabourStatus.ACTIVE,
        address: 'B-12 Labour Camp, Site 2',
        emergencyContact: '+91 97110 54322',
        joiningDate: '2025-08-01',
        notes: 'Formwork and shuttering specialist.',
      },
      {
        firstName: 'Manish',
        lastName: 'Verma',
        phone: '+91 94220 88990',
        email: 'manish.v@example.com',
        trade: 'Electrician',
        dailyWage: 900.0,
        status: LabourStatus.ACTIVE,
        address: 'Flat 102, Colony Rd',
        emergencyContact: '+91 94220 88991',
        joiningDate: '2025-04-10',
        notes: 'Licensed industrial wiring & conduit installation.',
      },
      {
        firstName: 'Vikram',
        lastName: 'Singh',
        phone: '+91 93120 77665',
        email: 'vikram.singh@example.com',
        trade: 'Welder',
        dailyWage: 850.0,
        status: LabourStatus.ACTIVE,
        address: 'Sector 4 Village',
        emergencyContact: '+91 93120 77666',
        joiningDate: '2025-07-20',
        notes: 'Arc & MIG welding expert for steel trusses.',
      },
      {
        firstName: 'Pooja',
        lastName: 'Sharma',
        phone: '+91 98102 33445',
        email: 'pooja.sharma@example.com',
        trade: 'Site Supervisor',
        dailyWage: 1200.0,
        status: LabourStatus.ACTIVE,
        address: 'Green Meadows #404',
        emergencyContact: '+91 98102 33446',
        joiningDate: '2025-02-01',
        notes: 'Handles site labor muster and safety inspections.',
      },
      {
        firstName: 'Arjun',
        lastName: 'Patel',
        phone: '+91 98980 11223',
        email: 'arjun.patel@example.com',
        trade: 'Plumber',
        dailyWage: 750.0,
        status: LabourStatus.ACTIVE,
        address: 'Block C, Old Market',
        emergencyContact: '+91 98980 11224',
        joiningDate: '2025-10-05',
        notes: 'Sanitary fittings and water line connections.',
      },
      {
        firstName: 'Deepak',
        lastName: 'Nath',
        phone: '+91 96540 66778',
        email: 'deepak.nath@example.com',
        trade: 'Painter',
        dailyWage: 700.0,
        status: LabourStatus.ACTIVE,
        address: 'Plot 55, Railway Road',
        emergencyContact: '+91 96540 66779',
        joiningDate: '2025-11-12',
        notes: 'Primer, putty, and spray finishing specialist.',
      },
      {
        firstName: 'Rajesh',
        lastName: 'Mondal',
        phone: '+91 95550 44332',
        email: 'rajesh.m@example.com',
        trade: 'General Labour',
        dailyWage: 600.0,
        status: LabourStatus.ACTIVE,
        address: 'Staff Quarters Room 6',
        emergencyContact: '+91 95550 44333',
        joiningDate: '2025-11-20',
        notes: 'Material handling, concrete mixing support.',
      },
      {
        firstName: 'Gopal',
        lastName: 'Das',
        phone: '+91 91234 55667',
        email: 'gopal.das@example.com',
        trade: 'General Labour',
        dailyWage: 600.0,
        status: LabourStatus.ACTIVE,
        address: 'Labour Colony #14',
        emergencyContact: '+91 91234 55668',
        joiningDate: '2025-12-01',
        notes: 'Excavation and debris clearing.',
      },
      {
        firstName: 'Sunil',
        lastName: 'Prasad',
        phone: '+91 99887 66554',
        email: 'sunil.p@example.com',
        trade: 'Mason',
        dailyWage: 800.0,
        status: LabourStatus.ON_LEAVE,
        address: 'Village Post Office Road',
        emergencyContact: '+91 99887 66555',
        joiningDate: '2025-05-18',
        notes: 'On annual harvest leave.',
      },
    ];

    const savedLabours = await this.labourRepo.save(laboursData);
    this.logger.log(`Created ${savedLabours.length} demo labourers.`);

    // 3. Attendances for the last 5 days
    const today = new Date();
    const attendanceRecords = [];

    for (let dayOffset = 4; dayOffset >= 0; dayOffset--) {
      const d = new Date();
      d.setDate(today.getDate() - dayOffset);
      const dateStr = d.toISOString().split('T')[0];

      for (let i = 0; i < savedLabours.length; i++) {
        const labour = savedLabours[i];
        if (labour.status === LabourStatus.ON_LEAVE) continue;

        // Alternate sites
        const project = savedProjects[i % savedProjects.length];

        // Randomize status slightly: mostly present, occasionally half-day or absent
        let status = AttendanceStatus.PRESENT;
        let hoursWorked = 8;
        let overtimeHours = 0;

        if (dayOffset === 0) {
          // Today: all active are present, some with overtime
          status = AttendanceStatus.PRESENT;
          hoursWorked = 8;
          if (i % 3 === 0) overtimeHours = 2;
        } else if (i === 7 && dayOffset === 2) {
          status = AttendanceStatus.ABSENT;
          hoursWorked = 0;
        } else if (i === 3 && dayOffset === 3) {
          status = AttendanceStatus.HALF_DAY;
          hoursWorked = 4;
        } else if (i % 2 === 0) {
          overtimeHours = 1.5;
        }

        attendanceRecords.push({
          date: dateStr,
          labourId: labour.id,
          projectId: project.id,
          status,
          hoursWorked,
          overtimeHours,
          notes: overtimeHours > 0 ? `Overtime for concrete pouring on ${project.name}` : '',
        });
      }
    }

    await this.attendanceRepo.save(attendanceRecords);
    this.logger.log(`Created ${attendanceRecords.length} attendance records across past 5 days.`);

    // 4. Sample payroll records for previous month and current month
    const payrollRecords = [
      {
        labourId: savedLabours[0].id,
        period: '2026-10',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        daysPresent: 26,
        halfDays: 0,
        daysAbsent: 2,
        totalHours: 208,
        overtimeHours: 12,
        baseWage: 22100.0,
        overtimePay: 1912.5,
        bonus: 1000.0,
        deductions: 500.0,
        netPayable: 24512.5,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentDate: '2026-11-02',
        notes: 'October wage disbursed via direct deposit.',
      },
      {
        labourId: savedLabours[1].id,
        period: '2026-10',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        daysPresent: 25,
        halfDays: 1,
        daysAbsent: 2,
        totalHours: 204,
        overtimeHours: 8,
        baseWage: 20400.0,
        overtimePay: 1200.0,
        bonus: 500.0,
        deductions: 0.0,
        netPayable: 22100.0,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.UPI,
        paymentDate: '2026-11-03',
        notes: 'October wage cleared via UPI.',
      },
      {
        labourId: savedLabours[2].id,
        period: '2026-10',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        daysPresent: 27,
        halfDays: 0,
        daysAbsent: 1,
        totalHours: 216,
        overtimeHours: 15,
        baseWage: 24300.0,
        overtimePay: 2531.25,
        bonus: 1200.0,
        deductions: 0.0,
        netPayable: 28031.25,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentDate: '2026-11-02',
        notes: 'Electrician full-cycle payout.',
      },
      {
        labourId: savedLabours[0].id,
        period: '2026-11',
        startDate: '2026-11-01',
        endDate: '2026-11-14',
        daysPresent: 12,
        halfDays: 0,
        daysAbsent: 0,
        totalHours: 96,
        overtimeHours: 6,
        baseWage: 10200.0,
        overtimePay: 956.25,
        bonus: 0.0,
        deductions: 0.0,
        netPayable: 11156.25,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: null,
        paymentDate: null,
        notes: 'Mid-month settlement pending approval.',
      },
      {
        labourId: savedLabours[3].id,
        period: '2026-11',
        startDate: '2026-11-01',
        endDate: '2026-11-14',
        daysPresent: 11,
        halfDays: 1,
        daysAbsent: 0,
        totalHours: 92,
        overtimeHours: 4,
        baseWage: 9775.0,
        overtimePay: 637.5,
        bonus: 250.0,
        deductions: 0.0,
        netPayable: 10662.5,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: null,
        paymentDate: null,
        notes: 'Welder fortnightly payout.',
      },
      {
        labourId: savedLabours[4].id,
        period: '2026-11',
        startDate: '2026-11-01',
        endDate: '2026-11-14',
        daysPresent: 12,
        halfDays: 0,
        daysAbsent: 0,
        totalHours: 96,
        overtimeHours: 0,
        baseWage: 14400.0,
        overtimePay: 0.0,
        bonus: 500.0,
        deductions: 0.0,
        netPayable: 14900.0,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: null,
        paymentDate: null,
        notes: 'Supervisor compensation muster.',
      },
    ];

    await this.payrollRepo.save(payrollRecords);
    this.logger.log(`Created ${payrollRecords.length} demo payroll slips.`);
    this.logger.log('Demo data seeding completed successfully!');
  }
}
