import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class RecordAttendanceDto {
  @IsNotEmpty()
  @IsNumber()
  labourId: number;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsNotEmpty()
  @IsString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsNumber()
  hoursWorked?: number;

  @IsOptional()
  @IsNumber()
  overtimeHours?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
