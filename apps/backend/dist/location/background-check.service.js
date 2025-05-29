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
exports.BackgroundCheckService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const background_check_entity_1 = require("./entities/background-check.entity");
const location_service_1 = require("./location.service");
let BackgroundCheckService = class BackgroundCheckService {
    backgroundCheckRepository;
    locationService;
    constructor(backgroundCheckRepository, locationService) {
        this.backgroundCheckRepository = backgroundCheckRepository;
        this.locationService = locationService;
    }
    async initiateAddressVerification(userId) {
        const userLocation = await this.locationService.findLocationByUserId(userId);
        if (!userLocation) {
            throw new common_1.NotFoundException('User location not found. Cannot initiate address verification.');
        }
        const backgroundCheck = this.backgroundCheckRepository.create({
            userId,
            userLocationId: userLocation.id,
            checkType: background_check_entity_1.BackgroundCheckType.ADDRESS_VERIFICATION,
            status: background_check_entity_1.BackgroundCheckStatus.PENDING,
        });
        const savedCheck = await this.backgroundCheckRepository.save(backgroundCheck);
        this.performAddressVerification(savedCheck.id, userLocation);
        return savedCheck;
    }
    async initiateIdentityVerification(userId) {
        const backgroundCheck = this.backgroundCheckRepository.create({
            userId,
            checkType: background_check_entity_1.BackgroundCheckType.IDENTITY_VERIFICATION,
            status: background_check_entity_1.BackgroundCheckStatus.PENDING,
        });
        const savedCheck = await this.backgroundCheckRepository.save(backgroundCheck);
        this.performIdentityVerification(savedCheck.id);
        return savedCheck;
    }
    async getBackgroundChecksByUserId(userId) {
        return await this.backgroundCheckRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
    async getBackgroundCheckById(id) {
        return await this.backgroundCheckRepository.findOne({
            where: { id }
        });
    }
    async updateBackgroundCheckStatus(id, status, checkData, riskLevel, notes) {
        const check = await this.getBackgroundCheckById(id);
        if (!check) {
            throw new common_1.NotFoundException('Background check not found');
        }
        const updateData = {
            status,
            ...(checkData && { checkData }),
            ...(riskLevel && { riskLevel }),
            ...(notes && { notes }),
            ...(status === background_check_entity_1.BackgroundCheckStatus.COMPLETED && { completedAt: new Date() })
        };
        await this.backgroundCheckRepository.update(id, updateData);
        const updatedCheck = await this.backgroundCheckRepository.findOne({
            where: { id }
        });
        if (!updatedCheck) {
            throw new common_1.NotFoundException('Failed to retrieve updated background check');
        }
        return updatedCheck;
    }
    async performAddressVerification(checkId, userLocation) {
        try {
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.IN_PROGRESS);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const addressVerificationResult = await this.mockAddressVerification(userLocation);
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.COMPLETED, addressVerificationResult.checkData, addressVerificationResult.riskLevel, addressVerificationResult.notes);
            if (addressVerificationResult.checkData.addressMatches) {
                await this.locationService.verifyLocation(userLocation.userId);
            }
        }
        catch (error) {
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.FAILED, { error: error.message }, background_check_entity_1.RiskLevel.HIGH, 'Address verification failed due to system error');
        }
    }
    async performIdentityVerification(checkId) {
        try {
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.IN_PROGRESS);
            await new Promise(resolve => setTimeout(resolve, 8000));
            const identityVerificationResult = await this.mockIdentityVerification();
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.COMPLETED, identityVerificationResult.checkData, identityVerificationResult.riskLevel, identityVerificationResult.notes);
        }
        catch (error) {
            await this.updateBackgroundCheckStatus(checkId, background_check_entity_1.BackgroundCheckStatus.FAILED, { error: error.message }, background_check_entity_1.RiskLevel.HIGH, 'Identity verification failed due to system error');
        }
    }
    async mockAddressVerification(userLocation) {
        const hasCoordinates = userLocation.coordinates && userLocation.latitude && userLocation.longitude;
        const hasCompleteAddress = userLocation.address && userLocation.city && userLocation.state;
        const hasPincode = userLocation.pincode && userLocation.pincode.length === 6;
        let addressMatches = false;
        let riskLevel = background_check_entity_1.RiskLevel.MEDIUM;
        let notes = '';
        if (hasCoordinates && hasCompleteAddress && hasPincode) {
            addressMatches = Math.random() > 0.1;
            riskLevel = addressMatches ? background_check_entity_1.RiskLevel.LOW : background_check_entity_1.RiskLevel.MEDIUM;
            notes = addressMatches
                ? 'Address verified successfully with government records'
                : 'Address partially verified, minor discrepancies found';
        }
        else if (hasCompleteAddress) {
            addressMatches = Math.random() > 0.3;
            riskLevel = addressMatches ? background_check_entity_1.RiskLevel.MEDIUM : background_check_entity_1.RiskLevel.HIGH;
            notes = addressMatches
                ? 'Address verified with limited data sources'
                : 'Address verification inconclusive, requires manual review';
        }
        else {
            addressMatches = false;
            riskLevel = background_check_entity_1.RiskLevel.HIGH;
            notes = 'Insufficient address data for verification';
        }
        return {
            checkData: {
                addressMatches,
                coordinatesVerified: hasCoordinates,
                pincodeVerified: hasPincode,
                governmentRecordsChecked: true,
                additionalNotes: `Verification completed for ${userLocation.city}, ${userLocation.state}`
            },
            riskLevel,
            notes
        };
    }
    async mockIdentityVerification() {
        const identityConfirmed = Math.random() > 0.15;
        const riskLevel = identityConfirmed ? background_check_entity_1.RiskLevel.LOW : background_check_entity_1.RiskLevel.HIGH;
        return {
            checkData: {
                identityConfirmed,
                documentVerified: identityConfirmed,
                biometricMatched: identityConfirmed,
                governmentDatabaseChecked: true,
            },
            riskLevel,
            notes: identityConfirmed
                ? 'Identity verified successfully'
                : 'Identity verification failed, manual review required'
        };
    }
    async getUserRiskAssessment(userId) {
        const checks = await this.getBackgroundChecksByUserId(userId);
        const completedChecks = checks.filter(c => c.status === background_check_entity_1.BackgroundCheckStatus.COMPLETED);
        const pendingChecks = checks.filter(c => c.status === background_check_entity_1.BackgroundCheckStatus.PENDING ||
            c.status === background_check_entity_1.BackgroundCheckStatus.IN_PROGRESS);
        const failedChecks = checks.filter(c => c.status === background_check_entity_1.BackgroundCheckStatus.FAILED);
        let overallRisk = background_check_entity_1.RiskLevel.MEDIUM;
        if (failedChecks.length > 0) {
            overallRisk = background_check_entity_1.RiskLevel.HIGH;
        }
        else if (completedChecks.length > 0) {
            const riskLevels = completedChecks
                .filter(c => c.riskLevel)
                .map(c => c.riskLevel);
            if (riskLevels.includes(background_check_entity_1.RiskLevel.CRITICAL)) {
                overallRisk = background_check_entity_1.RiskLevel.CRITICAL;
            }
            else if (riskLevels.includes(background_check_entity_1.RiskLevel.HIGH)) {
                overallRisk = background_check_entity_1.RiskLevel.HIGH;
            }
            else if (riskLevels.every(r => r === background_check_entity_1.RiskLevel.LOW)) {
                overallRisk = background_check_entity_1.RiskLevel.LOW;
            }
        }
        return {
            overallRisk,
            completedChecks: completedChecks.length,
            pendingChecks: pendingChecks.length,
            failedChecks: failedChecks.length,
        };
    }
};
exports.BackgroundCheckService = BackgroundCheckService;
exports.BackgroundCheckService = BackgroundCheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(background_check_entity_1.BackgroundCheck)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        location_service_1.LocationService])
], BackgroundCheckService);
//# sourceMappingURL=background-check.service.js.map