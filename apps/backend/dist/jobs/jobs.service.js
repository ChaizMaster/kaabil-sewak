"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@kaabil/shared");
let JobsService = class JobsService {
    jobs = [
        {
            id: 'job-001',
            title: 'Construction Worker',
            wage: 500,
            location: 'Sector 15, Gurgaon',
            distance: 2.5,
            requirements: ['Basic tools', 'Experience in construction'],
            employerId: 'emp-001',
            status: shared_1.JobStatus.ACTIVE,
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
            status: shared_1.JobStatus.ACTIVE,
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
            status: shared_1.JobStatus.ACTIVE,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            description: 'Security services for office complex'
        }
    ];
    async getJobsNearby(latitude, longitude, filters) {
        let filteredJobs = this.jobs.filter(job => job.status === shared_1.JobStatus.ACTIVE);
        if (filters) {
            if (filters.wageMin !== undefined) {
                filteredJobs = filteredJobs.filter(job => job.wage >= filters.wageMin);
            }
            if (filters.wageMax !== undefined) {
                filteredJobs = filteredJobs.filter(job => job.wage <= filters.wageMax);
            }
            if (filters.distance !== undefined) {
                filteredJobs = filteredJobs.filter(job => job.distance <= filters.distance);
            }
            if (filters.skills && filters.skills.length > 0) {
                filteredJobs = filteredJobs.filter(job => filters.skills.some(skill => job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))));
            }
        }
        return filteredJobs.sort((a, b) => a.distance - b.distance);
    }
    async getJobById(id) {
        return this.jobs.find(job => job.id === id) || null;
    }
    async searchJobs(query, filters) {
        const lowercaseQuery = query.toLowerCase();
        let results = this.jobs.filter(job => job.title.toLowerCase().includes(lowercaseQuery) ||
            job.description?.toLowerCase().includes(lowercaseQuery) ||
            job.requirements.some(req => req.toLowerCase().includes(lowercaseQuery)));
        if (filters) {
            if (filters.wageMin !== undefined) {
                results = results.filter(job => job.wage >= filters.wageMin);
            }
            if (filters.wageMax !== undefined) {
                results = results.filter(job => job.wage <= filters.wageMax);
            }
        }
        return results.sort((a, b) => a.distance - b.distance);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)()
], JobsService);
//# sourceMappingURL=jobs.service.js.map