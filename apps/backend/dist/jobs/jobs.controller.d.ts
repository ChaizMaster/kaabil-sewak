import { JobsService } from './jobs.service';
import { Job } from '@kaabil/shared';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    getJobsNearby(latitude: string, longitude: string, wageMin?: string, wageMax?: string, distance?: string, skills?: string): Promise<Job[]>;
    searchJobs(query: string, wageMin?: string, wageMax?: string): Promise<Job[]>;
    getJobById(id: string): Promise<Job | null>;
}
