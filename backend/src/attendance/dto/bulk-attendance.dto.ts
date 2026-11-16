import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordAttendanceDto } from './record-attendance.dto';

export class BulkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordAttendanceDto)
  records: RecordAttendanceDto[];
}
