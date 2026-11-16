import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../entities/payroll.entity';

export class UpdatePayrollStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
