export interface Job {
  id: string;
  title: string;
  wage: number;
  location: string;
  distance: number;
  requirements: string[];
  employerId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export enum JobStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  FILLED = 'filled',
  CANCELLED = 'cancelled'
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: JobApplicationStatus;
  appliedAt: string;
  message?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export enum JobApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface JobSearchFilters {
  location?: string;
  wageMin?: number;
  wageMax?: number;
  skills?: string[];
  distance?: number;
} 