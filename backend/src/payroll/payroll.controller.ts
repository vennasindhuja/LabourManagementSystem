import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { UpdatePayrollStatusDto } from './dto/update-payroll-status.dto';

@Controller('api/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  findAll(
    @Query('period') period?: string,
    @Query('status') status?: string,
    @Query('labourId') labourId?: string,
  ) {
    return this.payrollService.findAll(
      period,
      status,
      labourId ? parseInt(labourId, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payrollService.findOne(id);
  }

  @Post('generate')
  generate(@Body() generatePayrollDto: GeneratePayrollDto) {
    return this.payrollService.generatePayroll(generatePayrollDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdatePayrollStatusDto,
  ) {
    return this.payrollService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payrollService.remove(id);
  }
}
