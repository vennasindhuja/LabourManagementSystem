import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class GeneratePayrollDto {
  @IsNotEmpty()
  @IsString()
  period: string; // YYYY-MM

  @IsNotEmpty()
  @IsString()
  startDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  endDate: string; // YYYY-MM-DD

  @IsOptional()
  @IsNumber()
  labourId?: number; // Optional: generate for specific labour or all

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsOptional()
  @IsNumber()
  deductions?: number;
}
