import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { LabourStatus } from '../entities/labour.entity';

export class UpdateLabourDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  trade?: string;

  @IsOptional()
  @IsNumber()
  dailyWage?: number;

  @IsOptional()
  @IsEnum(LabourStatus)
  status?: LabourStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  joiningDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
