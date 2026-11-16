import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Labour } from '../../labours/entities/labour.entity';
import { Project } from '../../projects/entities/project.entity';

export enum AttendanceStatus {
  PRESENT = 'Present',
  HALF_DAY = 'Half Day',
  ABSENT = 'Absent',
  ON_LEAVE = 'On Leave',
}

@Entity('attendances')
@Unique(['labour', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @ManyToOne(() => Labour, (labour) => labour.attendances, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'labourId' })
  labour: Labour;

  @Column()
  labourId: number;

  @ManyToOne(() => Project, (project) => project.attendances, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ nullable: true })
  projectId: number;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column('decimal', { precision: 4, scale: 1, default: 8.0 })
  hoursWorked: number;

  @Column('decimal', { precision: 4, scale: 1, default: 0.0 })
  overtimeHours: number;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
