import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Payroll } from '../../payroll/entities/payroll.entity';

export enum LabourStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave',
}

@Entity('labours')
export class Labour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 50, default: 'General Labour' })
  trade: string; // e.g. Mason, Carpenter, Electrician, Plumber, Painter, Welder, Helper

  @Column('decimal', { precision: 10, scale: 2, default: 600.0 })
  dailyWage: number;

  @Column({
    type: 'enum',
    enum: LabourStatus,
    default: LabourStatus.ACTIVE,
  })
  status: LabourStatus;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  emergencyContact: string;

  @Column({ type: 'date', nullable: true })
  joiningDate: string;

  @Column('text', { nullable: true })
  notes: string;

  @OneToMany(() => Attendance, (attendance) => attendance.labour)
  attendances: Attendance[];

  @OneToMany(() => Payroll, (payroll) => payroll.labour)
  payrolls: Payroll[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
