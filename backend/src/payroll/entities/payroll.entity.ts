import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Labour } from '../../labours/entities/labour.entity';

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
}

export enum PaymentMethod {
  CASH = 'Cash',
  BANK_TRANSFER = 'Bank Transfer',
  UPI = 'UPI',
  CHEQUE = 'Cheque',
}

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Labour, (labour) => labour.payrolls, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'labourId' })
  labour: Labour;

  @Column()
  labourId: number;

  @Column({ length: 7 }) // YYYY-MM
  period: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column('int', { default: 0 })
  daysPresent: number;

  @Column('int', { default: 0 })
  halfDays: number;

  @Column('int', { default: 0 })
  daysAbsent: number;

  @Column('decimal', { precision: 6, scale: 1, default: 0.0 })
  totalHours: number;

  @Column('decimal', { precision: 6, scale: 1, default: 0.0 })
  overtimeHours: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  baseWage: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  overtimePay: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  bonus: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  deductions: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  netPayable: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'date', nullable: true })
  paymentDate: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
