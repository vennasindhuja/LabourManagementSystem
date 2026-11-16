import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('projectId') projectId?: string,
    @Query('labourId') labourId?: string,
  ) {
    return this.attendanceService.findAll(
      date,
      projectId ? parseInt(projectId, 10) : undefined,
      labourId ? parseInt(labourId, 10) : undefined,
    );
  }

  @Post()
  record(@Body() recordAttendanceDto: RecordAttendanceDto) {
    return this.attendanceService.record(recordAttendanceDto);
  }

  @Post('bulk')
  bulkRecord(@Body() bulkAttendanceDto: BulkAttendanceDto) {
    return this.attendanceService.bulkRecord(bulkAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
