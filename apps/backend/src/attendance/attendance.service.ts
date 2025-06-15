import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

// Interfaces for the service
export interface Worker {
  id: string;
  name: string;
  jobId: string;
  contractorId: string;
  phoneNumber?: string;
  photoUri?: string;
  skillset?: string[];
  status: 'active' | 'inactive' | 'terminated';
  joinedDate: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'sick-leave' | 'casual-leave';
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  notes?: string;
  jobId: string;
  contractorId: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  totalWorkers: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
  weeklyStats: {
    date: string;
    present: number;
    absent: number;
    percentage: number;
  }[];
  workerStats: {
    workerId: string;
    workerName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendanceRate: number;
  }[];
}

export interface MarkAttendanceRequest {
  workerId: string;
  date: string;
  status: AttendanceRecord['status'];
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contractorId: string;
  jobId: string;
}

@Injectable()
export class AttendanceService {
  // In-memory storage for demo purposes
  // In production, this would use a database like PostgreSQL
  private attendanceRecords: AttendanceRecord[] = [];
  private workers: Worker[] = [
    {
      id: 'worker_001',
      name: 'Rajesh Kumar',
      jobId: 'job_001',
      contractorId: 'contractor_123',
      phoneNumber: '+919876543210',
      skillset: ['Masonry', 'Painting'],
      status: 'active',
      joinedDate: '2024-01-15',
      verificationStatus: 'verified',
    },
    {
      id: 'worker_002',
      name: 'Priya Sharma',
      jobId: 'job_001',
      contractorId: 'contractor_123',
      phoneNumber: '+919876543211',
      skillset: ['Plumbing', 'Electrical'],
      status: 'active',
      joinedDate: '2024-01-20',
      verificationStatus: 'verified',
    },
    {
      id: 'worker_003',
      name: 'Suresh Patel',
      jobId: 'job_001',
      contractorId: 'contractor_123',
      phoneNumber: '+919876543212',
      skillset: ['Carpentry'],
      status: 'active',
      joinedDate: '2024-02-01',
      verificationStatus: 'pending',
    },
    {
      id: 'worker_004',
      name: 'Anita Devi',
      jobId: 'job_001',
      contractorId: 'contractor_123',
      phoneNumber: '+919876543213',
      skillset: ['Cleaning', 'Helper'],
      status: 'active',
      joinedDate: '2024-02-10',
      verificationStatus: 'verified',
    },
    {
      id: 'worker_005',
      name: 'Vikram Singh',
      jobId: 'job_001',
      contractorId: 'contractor_123',
      phoneNumber: '+919876543214',
      skillset: ['Security', 'General Labor'],
      status: 'active',
      joinedDate: '2024-02-15',
      verificationStatus: 'verified',
    },
  ];

  async markAttendance(request: MarkAttendanceRequest): Promise<AttendanceRecord> {
    const worker = this.workers.find(w => w.id === request.workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const existingRecord = this.attendanceRecords.find(
      record => record.workerId === request.workerId && record.date === request.date
    );

    let attendanceRecord: AttendanceRecord;

    if (existingRecord) {
      // Update existing record
      attendanceRecord = {
        ...existingRecord,
        status: request.status,
        checkInTime: request.checkInTime || existingRecord.checkInTime,
        checkOutTime: request.checkOutTime || existingRecord.checkOutTime,
        notes: request.notes || existingRecord.notes,
        location: request.location || existingRecord.location,
        updatedAt: new Date().toISOString(),
      };

      const index = this.attendanceRecords.findIndex(r => r.id === existingRecord.id);
      this.attendanceRecords[index] = attendanceRecord;
    } else {
      // Create new record
      attendanceRecord = {
        id: this.generateAttendanceId(),
        workerId: request.workerId,
        workerName: worker.name,
        date: request.date,
        status: request.status,
        checkInTime: request.checkInTime,
        checkOutTime: request.checkOutTime,
        notes: request.notes,
        jobId: request.jobId,
        contractorId: request.contractorId,
        location: request.location,
        markedBy: request.contractorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.attendanceRecords.push(attendanceRecord);
    }

    // Calculate hours worked if both check-in and check-out times are provided
    if (attendanceRecord.checkInTime && attendanceRecord.checkOutTime) {
      const checkIn = new Date(`${request.date}T${attendanceRecord.checkInTime}`);
      const checkOut = new Date(`${request.date}T${attendanceRecord.checkOutTime}`);
      attendanceRecord.hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    // Log analytics event
    console.log('Analytics: AttendanceMarked', {
      workerId: request.workerId,
      workerName: worker.name,
      date: request.date,
      status: request.status,
      jobId: request.jobId,
      contractorId: request.contractorId,
      timestamp: Date.now(),
    });

    return attendanceRecord;
  }

  async bulkMarkAttendance(bulkRequest: { attendance: MarkAttendanceRequest[] }): Promise<AttendanceRecord[]> {
    const results: AttendanceRecord[] = [];
    
    for (const request of bulkRequest.attendance) {
      try {
        const record = await this.markAttendance(request);
        results.push(record);
      } catch (error) {
        console.error(`Error marking attendance for worker ${request.workerId}:`, error);
      }
    }

    return results;
  }

  async getAttendanceByDate(contractorId: string, date: string, jobId?: string): Promise<AttendanceRecord[]> {
    let filteredRecords = this.attendanceRecords.filter(
      record => record.contractorId === contractorId && record.date === date
    );

    if (jobId !== undefined) {
      filteredRecords = filteredRecords.filter(record => record.jobId === jobId);
    }

    return filteredRecords;
  }

  async getWorkerAttendance(workerId: string, startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    return this.attendanceRecords.filter(
      record =>
        record.workerId === workerId &&
        record.date >= startDate &&
        record.date <= endDate
    );
  }

  async getAttendanceSummary(
    contractorId: string,
    startDate: string,
    endDate: string,
    jobId?: string
  ): Promise<AttendanceSummary> {
    const workers = await this.getWorkers(contractorId, jobId);
    const totalWorkers = workers.length;

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0] as string;
    const todayAttendance = await this.getAttendanceByDate(contractorId, today, jobId);
    const presentToday = todayAttendance.filter(record => 
      record.status === 'present' || record.status === 'half-day'
    ).length;
    const absentToday = totalWorkers - presentToday;
    const attendancePercentage = totalWorkers > 0 ? (presentToday / totalWorkers) * 100 : 0;

    // Generate weekly stats
    const weeklyStats = await this.generateWeeklyStats(contractorId, startDate, endDate, jobId);

    // Generate worker stats
    const workerStats = await this.generateWorkerStats(contractorId, startDate, endDate, jobId);

    return {
      totalWorkers,
      presentToday,
      absentToday,
      attendancePercentage,
      weeklyStats,
      workerStats,
    };
  }

  async getWorkers(contractorId: string, jobId?: string): Promise<Worker[]> {
    let filteredWorkers = this.workers.filter(worker => worker.contractorId === contractorId);
    
    if (jobId) {
      filteredWorkers = filteredWorkers.filter(worker => worker.jobId === jobId);
    }

    return filteredWorkers.filter(worker => worker.status === 'active');
  }

  async updateAttendance(id: string, updateData: Partial<MarkAttendanceRequest>): Promise<AttendanceRecord> {
    const index = this.attendanceRecords.findIndex(record => record.id === id);
    if (index === -1) {
      throw new NotFoundException('Attendance record not found');
    }

    const existingRecord = this.attendanceRecords[index];
    if (!existingRecord) {
      throw new NotFoundException('Attendance record not found');
    }

    const updatedRecord: AttendanceRecord = {
      ...existingRecord,
      status: updateData.status ?? existingRecord.status,
      checkInTime: updateData.checkInTime ?? existingRecord.checkInTime,
      checkOutTime: updateData.checkOutTime ?? existingRecord.checkOutTime,
      notes: updateData.notes ?? existingRecord.notes,
      location: updateData.location ?? existingRecord.location,
      updatedAt: new Date().toISOString(),
    };

    this.attendanceRecords[index] = updatedRecord;
    return updatedRecord;
  }

  async deleteAttendance(id: string): Promise<void> {
    const index = this.attendanceRecords.findIndex(record => record.id === id);
    if (index === -1) {
      throw new NotFoundException('Attendance record not found');
    }

    this.attendanceRecords.splice(index, 1);
  }

  private async generateWeeklyStats(
    contractorId: string,
    startDate: string,
    endDate: string,
    jobId?: string
  ): Promise<AttendanceSummary['weeklyStats']> {
    const stats: AttendanceSummary['weeklyStats'] = [];
    const workers = await this.getWorkers(contractorId, jobId);
    const totalWorkers = workers.length;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0] as string;
      const dayAttendance = await this.getAttendanceByDate(contractorId, dateStr, jobId);
      
      const present = dayAttendance.filter(record => 
        record.status === 'present' || record.status === 'half-day'
      ).length;
      const absent = totalWorkers - present;
      const percentage = totalWorkers > 0 ? (present / totalWorkers) * 100 : 0;

      stats.push({
        date: dateStr,
        present,
        absent,
        percentage,
      });
    }

    return stats;
  }

  private async generateWorkerStats(
    contractorId: string,
    startDate: string,
    endDate: string,
    jobId?: string
  ): Promise<AttendanceSummary['workerStats']> {
    const workers = await this.getWorkers(contractorId, jobId);
    const stats: AttendanceSummary['workerStats'] = [];

    for (const worker of workers) {
      const workerAttendance = await this.getWorkerAttendance(worker.id, startDate, endDate);
      
      const totalDays = this.getWorkingDaysBetween(startDate, endDate);
      const presentDays = workerAttendance.filter(record => 
        record.status === 'present' || record.status === 'half-day'
      ).length;
      const absentDays = totalDays - presentDays;
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      stats.push({
        workerId: worker.id,
        workerName: worker.name,
        totalDays,
        presentDays,
        absentDays,
        attendanceRate,
      });
    }

    return stats.sort((a, b) => b.attendanceRate - a.attendanceRate);
  }

  private getWorkingDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      // Count Monday to Saturday as working days (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0) {
        count++;
      }
    }

    return count;
  }

  private generateAttendanceId(): string {
    return `attendance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
