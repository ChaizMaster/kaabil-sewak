import { Controller, Get, Query, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job, JobSearchFilters } from '@kaabil/shared';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('nearby')
  async getJobsNearby(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
    @Query('wageMin') wageMin?: string,
    @Query('wageMax') wageMax?: string,
    @Query('distance') distance?: string,
    @Query('skills') skills?: string
  ): Promise<Job[]> {
    const filters: JobSearchFilters = {};
    
    if (wageMin) filters.wageMin = parseInt(wageMin);
    if (wageMax) filters.wageMax = parseInt(wageMax);
    if (distance) filters.distance = parseInt(distance);
    if (skills) filters.skills = skills.split(',').map(s => s.trim());

    return this.jobsService.getJobsNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      filters
    );
  }

  @Get('search')
  async searchJobs(
    @Query('q') query: string,
    @Query('wageMin') wageMin?: string,
    @Query('wageMax') wageMax?: string
  ): Promise<Job[]> {
    const filters: JobSearchFilters = {};
    
    if (wageMin) filters.wageMin = parseInt(wageMin);
    if (wageMax) filters.wageMax = parseInt(wageMax);

    return this.jobsService.searchJobs(query, filters);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string): Promise<Job | null> {
    return this.jobsService.getJobById(id);
  }
} 