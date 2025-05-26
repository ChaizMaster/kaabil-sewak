import { Injectable } from '@nestjs/common';
import { Job, JobStatus, JobSearchFilters } from '@kaabil/shared';

@Injectable()
export class JobsService {
  private jobs: Job[] = [
    {
      id: 'job-001',
      title: 'Construction Worker',
      wage: 500,
      location: 'Sector 15, Gurgaon',
      distance: 2.5,
      requirements: ['Basic tools', 'Experience in construction'],
      employerId: 'emp-001',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Construction work for residential building project'
    },
    {
      id: 'job-002',
      title: 'Delivery Boy',
      wage: 350,
      location: 'Cyber City, Gurgaon',
      distance: 1.8,
      requirements: ['Own vehicle', 'Mobile phone'],
      employerId: 'emp-002',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Food delivery for nearby restaurants'
    },
    {
      id: 'job-003',
      title: 'Security Guard',
      wage: 450,
      location: 'Golf Course Road, Gurgaon',
      distance: 3.2,
      requirements: ['Security training', 'Night shift available'],
      employerId: 'emp-003',
      status: JobStatus.ACTIVE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'Security services for office complex'
    }
  ];

  async getJobsNearby(
    latitude: number, 
    longitude: number, 
    filters?: JobSearchFilters
  ): Promise<Job[]> {
    let filteredJobs = this.jobs.filter(job => job.status === JobStatus.ACTIVE);

    if (filters) {
      if (filters.wageMin) {
        filteredJobs = filteredJobs.filter(job => job.wage >= filters.wageMin);
      }
      
      if (filters.wageMax) {
        filteredJobs = filteredJobs.filter(job => job.wage <= filters.wageMax);
      }
      
      if (filters.distance) {
        filteredJobs = filteredJobs.filter(job => job.distance <= filters.distance);
      }
      
      if (filters.skills && filters.skills.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.skills.some(skill => 
            job.requirements.some(req => 
              req.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
    }

    // Sort by distance (closest first)
    return filteredJobs.sort((a, b) => a.distance - b.distance);
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobs.find(job => job.id === id) || null;
  }

  async searchJobs(query: string, filters?: JobSearchFilters): Promise<Job[]> {
    const lowercaseQuery = query.toLowerCase();
    let results = this.jobs.filter(job => 
      job.title.toLowerCase().includes(lowercaseQuery) ||
      job.description?.toLowerCase().includes(lowercaseQuery) ||
      job.requirements.some(req => req.toLowerCase().includes(lowercaseQuery))
    );

    if (filters) {
      if (filters.wageMin) {
        results = results.filter(job => job.wage >= filters.wageMin);
      }
      
      if (filters.wageMax) {
        results = results.filter(job => job.wage <= filters.wageMax);
      }
    }

    return results.sort((a, b) => a.distance - b.distance);
  }
} 