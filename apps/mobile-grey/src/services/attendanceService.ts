// AttendanceService.ts - Service for managing worker attendance and muster roll functionality

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  date: string; // YYYY-MM-DD format
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
}

class AttendanceService {
  private static instance: AttendanceService;
  private attendanceRecords: AttendanceRecord[] = [];
  private workers: Worker[] = [];
  private readonly baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  private readonly storageKeys = {
    attendance: 'attendance_records',
    workers: 'workers_list',
  };

  static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  private constructor() {
    this.loadFromStorage();
  }

  // Load data from local storage
  private async loadFromStorage(): Promise<void> {
    try {
      const [attendanceData, workersData] = await Promise.all([
        AsyncStorage.getItem(this.storageKeys.attendance),
        AsyncStorage.getItem(this.storageKeys.workers),
      ]);

      if (attendanceData) {
        this.attendanceRecords = JSON.parse(attendanceData);
      }

      if (workersData) {
        this.workers = JSON.parse(workersData);
      } else {
        // Initialize with mock data if no workers exist
        this.initializeMockWorkers();
      }
    } catch (error) {
      console.error('Error loading attendance data from storage:', error);
      this.initializeMockWorkers();
    }
  }

  // Initialize with mock workers for development
  private initializeMockWorkers(): void {
    this.workers = [
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
    this.saveToStorage();
  }

  // Save data to local storage
  private async saveToStorage(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(this.storageKeys.attendance, JSON.stringify(this.attendanceRecords)),
        AsyncStorage.setItem(this.storageKeys.workers, JSON.stringify(this.workers)),
      ]);
    } catch (error) {
      console.error('Error saving attendance data to storage:', error);
    }
  }

  // Mark attendance for a worker
  async markAttendance(
    request: MarkAttendanceRequest,
    contractorId: string,
    jobId: string
  ): Promise<AttendanceRecord> {
    try {
      const worker = this.workers.find(w => w.id === request.workerId);
      if (!worker) {
        throw new Error('Worker not found');
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
          jobId,
          contractorId,
          location: request.location,
          markedBy: contractorId, // TODO: Get from auth context
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

      await this.saveToStorage();

      // Fire analytics event
      console.log('Analytics: AttendanceMarked', {
        workerId: request.workerId,
        workerName: worker.name,
        date: request.date,
        status: request.status,
        jobId,
        contractorId,
        timestamp: Date.now(),
      });

      // Simulate API call to backend
      this.syncAttendanceToServer(attendanceRecord);

      return attendanceRecord;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Get workers for a specific job/contractor
  async getWorkers(contractorId: string, jobId?: string): Promise<Worker[]> {
    let filteredWorkers = this.workers.filter(worker => worker.contractorId === contractorId);
    
    if (jobId) {
      filteredWorkers = filteredWorkers.filter(worker => worker.jobId === jobId);
    }

    return filteredWorkers.filter(worker => worker.status === 'active');
  }

  // Get attendance records for a specific date
  async getAttendanceByDate(
    contractorId: string,
    date: string,
    jobId?: string
  ): Promise<AttendanceRecord[]> {
    let filteredRecords = this.attendanceRecords.filter(
      record => record.contractorId === contractorId && record.date === date
    );

    if (jobId) {
      filteredRecords = filteredRecords.filter(record => record.jobId === jobId);
    }

    return filteredRecords;
  }

  // Get attendance records for a worker over a date range
  async getWorkerAttendance(
    workerId: string,
    startDate: string,
    endDate: string
  ): Promise<AttendanceRecord[]> {
    return this.attendanceRecords.filter(
      record =>
        record.workerId === workerId &&
        record.date >= startDate &&
        record.date <= endDate
    );
  }

  // Get attendance summary for a specific date range
  async getAttendanceSummary(
    contractorId: string,
    startDate: string,
    endDate: string,
    jobId?: string
  ): Promise<AttendanceSummary> {
    const workers = await this.getWorkers(contractorId, jobId);
    const totalWorkers = workers.length;

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
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

  // Generate weekly attendance statistics
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
      const dateStr = date.toISOString().split('T')[0];
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

  // Generate worker-specific attendance statistics
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

  // Helper function to calculate working days between two dates
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

  // Sync attendance data to server (mock implementation)
  private async syncAttendanceToServer(record: AttendanceRecord): Promise<void> {
    try {
      // Simulate API call
      console.log('Syncing attendance to server:', record.id);
      
      // In a real implementation, this would make an HTTP request to the backend
      // const response = await fetch(`${this.baseUrl}/attendance`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(record),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to sync attendance to server');
      // }
    } catch (error) {
      console.error('Error syncing attendance to server:', error);
      // In a real app, you might want to queue failed syncs for retry
    }
  }

  // Generate unique attendance record ID
  private generateAttendanceId(): string {
    return `attendance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all data (for testing purposes)
  clearCache(): void {
    this.attendanceRecords = [];
    this.workers = [];
    AsyncStorage.multiRemove([this.storageKeys.attendance, this.storageKeys.workers]);
  }

  // Bulk mark attendance for multiple workers
  async bulkMarkAttendance(
    requests: MarkAttendanceRequest[],
    contractorId: string,
    jobId: string
  ): Promise<AttendanceRecord[]> {
    const results: AttendanceRecord[] = [];
    
    for (const request of requests) {
      try {
        const record = await this.markAttendance(request, contractorId, jobId);
        results.push(record);
      } catch (error) {
        console.error(`Error marking attendance for worker ${request.workerId}:`, error);
      }
    }

    return results;
  }
}

export default AttendanceService.getInstance(); 