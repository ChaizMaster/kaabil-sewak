"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jobs_service_1 = require("./jobs.service");
let JobsController = class JobsController {
    jobsService;
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async getJobsNearby(latitude, longitude, wageMin, wageMax, distance, skills) {
        const filters = {};
        if (wageMin)
            filters.wageMin = parseInt(wageMin);
        if (wageMax)
            filters.wageMax = parseInt(wageMax);
        if (distance)
            filters.distance = parseInt(distance);
        if (skills)
            filters.skills = skills.split(',').map(s => s.trim());
        return this.jobsService.getJobsNearby(parseFloat(latitude), parseFloat(longitude), filters);
    }
    async searchJobs(query, wageMin, wageMax) {
        const filters = {};
        if (wageMin)
            filters.wageMin = parseInt(wageMin);
        if (wageMax)
            filters.wageMax = parseInt(wageMax);
        return this.jobsService.searchJobs(query, filters);
    }
    async getJobById(id) {
        return this.jobsService.getJobById(id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('wageMin')),
    __param(3, (0, common_1.Query)('wageMax')),
    __param(4, (0, common_1.Query)('distance')),
    __param(5, (0, common_1.Query)('skills')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobsNearby", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('wageMin')),
    __param(2, (0, common_1.Query)('wageMax')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "searchJobs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobById", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map