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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const location_service_1 = require("./location.service");
const background_check_service_1 = require("./background-check.service");
const create_location_dto_1 = require("./dto/create-location.dto");
let LocationController = class LocationController {
    locationService;
    backgroundCheckService;
    constructor(locationService, backgroundCheckService) {
        this.locationService = locationService;
        this.backgroundCheckService = backgroundCheckService;
    }
    async createLocation(createLocationDto) {
        const location = await this.locationService.createLocation(createLocationDto);
        if (location.coordinates || (location.address && location.city && location.state)) {
            await this.backgroundCheckService.initiateAddressVerification(location.userId);
        }
        return {
            success: true,
            data: location,
            message: 'Location created successfully. Background verification initiated.'
        };
    }
    async getUserLocation(userId) {
        const location = await this.locationService.findLocationByUserId(userId);
        if (!location) {
            return {
                success: false,
                data: null,
                message: 'No location found for this user'
            };
        }
        return {
            success: true,
            data: location,
            message: 'Location retrieved successfully'
        };
    }
    async updateUserLocation(userId, updateLocationDto) {
        const location = await this.locationService.updateLocation(userId, updateLocationDto);
        if (updateLocationDto.address || updateLocationDto.coordinates) {
            await this.backgroundCheckService.initiateAddressVerification(userId);
        }
        return {
            success: true,
            data: location,
            message: 'Location updated successfully. Re-verification initiated.'
        };
    }
    async deleteUserLocation(userId) {
        await this.locationService.deleteLocation(userId);
        return {
            success: true,
            data: null,
            message: 'Location deleted successfully'
        };
    }
    async findNearbyUsers(latitude, longitude, radius = 50) {
        const nearbyUsers = await this.locationService.findNearbyUsers(latitude, longitude, radius);
        return {
            success: true,
            data: nearbyUsers,
            message: `Found ${nearbyUsers.length} users within ${radius}km`
        };
    }
    async findUsersByCity(city) {
        const users = await this.locationService.findLocationsByCity(city);
        return {
            success: true,
            data: users,
            message: `Found ${users.length} users in ${city}`
        };
    }
    async findUsersByState(state) {
        const users = await this.locationService.findLocationsByState(state);
        return {
            success: true,
            data: users,
            message: `Found ${users.length} users in ${state}`
        };
    }
    async verifyUserLocation(userId) {
        const location = await this.locationService.verifyLocation(userId);
        return {
            success: true,
            data: location,
            message: 'Location verified successfully'
        };
    }
    async initiateAddressVerification(userId) {
        const backgroundCheck = await this.backgroundCheckService.initiateAddressVerification(userId);
        return {
            success: true,
            data: backgroundCheck,
            message: 'Address verification initiated'
        };
    }
    async initiateIdentityVerification(userId) {
        const backgroundCheck = await this.backgroundCheckService.initiateIdentityVerification(userId);
        return {
            success: true,
            data: backgroundCheck,
            message: 'Identity verification initiated'
        };
    }
    async getUserBackgroundChecks(userId) {
        const checks = await this.backgroundCheckService.getBackgroundChecksByUserId(userId);
        return {
            success: true,
            data: checks,
            message: `Found ${checks.length} background checks for user`
        };
    }
    async getBackgroundCheck(checkId) {
        const check = await this.backgroundCheckService.getBackgroundCheckById(checkId);
        if (!check) {
            return {
                success: false,
                data: null,
                message: 'Background check not found'
            };
        }
        return {
            success: true,
            data: check,
            message: 'Background check retrieved successfully'
        };
    }
    async getUserRiskAssessment(userId) {
        const riskAssessment = await this.backgroundCheckService.getUserRiskAssessment(userId);
        return {
            success: true,
            data: riskAssessment,
            message: 'Risk assessment retrieved successfully'
        };
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getUserLocation", null);
__decorate([
    (0, common_1.Put)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "updateUserLocation", null);
__decorate([
    (0, common_1.Delete)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "deleteUserLocation", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findNearbyUsers", null);
__decorate([
    (0, common_1.Get)('city/:city'),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findUsersByCity", null);
__decorate([
    (0, common_1.Get)('state/:state'),
    __param(0, (0, common_1.Param)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "findUsersByState", null);
__decorate([
    (0, common_1.Post)('verify/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "verifyUserLocation", null);
__decorate([
    (0, common_1.Post)('background-check/address/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "initiateAddressVerification", null);
__decorate([
    (0, common_1.Post)('background-check/identity/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "initiateIdentityVerification", null);
__decorate([
    (0, common_1.Get)('background-check/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getUserBackgroundChecks", null);
__decorate([
    (0, common_1.Get)('background-check/:checkId'),
    __param(0, (0, common_1.Param)('checkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getBackgroundCheck", null);
__decorate([
    (0, common_1.Get)('risk-assessment/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getUserRiskAssessment", null);
exports.LocationController = LocationController = __decorate([
    (0, common_1.Controller)('location'),
    __metadata("design:paramtypes", [location_service_1.LocationService,
        background_check_service_1.BackgroundCheckService])
], LocationController);
//# sourceMappingURL=location.controller.js.map