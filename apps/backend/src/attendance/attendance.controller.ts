import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';

export interface MarkAttendanceDto {
  workerId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'sick-leave' | 'casual-leave';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface BulkAttendanceDto {
  attendance: MarkAttendanceDto[];
  contractorId: string;
  jobId: string;
}

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto & { contractorId: string; jobId: string }
  ) {
    return this.attendanceService.markAttendance(markAttendanceDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkMarkAttendance(@Body() bulkAttendanceDto: BulkAttendanceDto) {
    const transformedRequest = {
      attendance: bulkAttendanceDto.attendance.map(item => ({
        ...item,
        contractorId: bulkAttendanceDto.contractorId,
        jobId: bulkAttendanceDto.jobId,
      }))
    };
    return this.attendanceService.bulkMarkAttendance(transformedRequest);
  }

  @Get('date/:date')
  async getAttendanceByDate(
    @Param('date') date: string,
    @Query('contractorId') contractorId: string,
    @Query('jobId') jobId?: string
  ) {
    return this.attendanceService.getAttendanceByDate(contractorId, date, jobId);
  }

  @Get('worker/:workerId')
  async getWorkerAttendance(
    @Param('workerId') workerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.attendanceService.getWorkerAttendance(workerId, startDate, endDate);
  }

  @Get('summary')
  async getAttendanceSummary(
    @Query('contractorId') contractorId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('jobId') jobId?: string
  ) {
    return this.attendanceService.getAttendanceSummary(contractorId, startDate, endDate, jobId);
  }

  @Get('workers')
  async getWorkers(
    @Query('contractorId') contractorId: string,
    @Query('jobId') jobId?: string
  ) {
    return this.attendanceService.getWorkers(contractorId, jobId);
  }

  @Put(':id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() updateData: Partial<MarkAttendanceDto>
  ) {
    return this.attendanceService.updateAttendance(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(id);
  }
}
