import { Job, JobSearchFilters } from '@kaabil/shared';
export declare class JobsService {
    private jobs;
    getJobsNearby(latitude: number, longitude: number, filters?: JobSearchFilters): Promise<Job[]>;
    getJobById(id: string): Promise<Job | null>;
    searchJobs(query: string, filters?: JobSearchFilters): Promise<Job[]>;
}
