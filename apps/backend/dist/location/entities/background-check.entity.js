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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundCheck = exports.RiskLevel = exports.BackgroundCheckType = exports.BackgroundCheckStatus = void 0;
const typeorm_1 = require("typeorm");
var BackgroundCheckStatus;
(function (BackgroundCheckStatus) {
    BackgroundCheckStatus["PENDING"] = "pending";
    BackgroundCheckStatus["IN_PROGRESS"] = "in_progress";
    BackgroundCheckStatus["COMPLETED"] = "completed";
    BackgroundCheckStatus["FAILED"] = "failed";
    BackgroundCheckStatus["REQUIRES_MANUAL_REVIEW"] = "requires_manual_review";
})(BackgroundCheckStatus || (exports.BackgroundCheckStatus = BackgroundCheckStatus = {}));
var BackgroundCheckType;
(function (BackgroundCheckType) {
    BackgroundCheckType["ADDRESS_VERIFICATION"] = "address_verification";
    BackgroundCheckType["IDENTITY_VERIFICATION"] = "identity_verification";
    BackgroundCheckType["CRIMINAL_RECORD_CHECK"] = "criminal_record_check";
    BackgroundCheckType["EMPLOYMENT_HISTORY"] = "employment_history";
    BackgroundCheckType["REFERENCE_CHECK"] = "reference_check";
})(BackgroundCheckType || (exports.BackgroundCheckType = BackgroundCheckType = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
let BackgroundCheck = class BackgroundCheck {
    id;
    userId;
    userLocationId;
    checkType;
    status;
    riskLevel;
    checkData;
    verificationSources;
    notes;
    verifiedBy;
    completedAt;
    createdAt;
    updatedAt;
};
exports.BackgroundCheck = BackgroundCheck;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "userLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BackgroundCheckType,
        default: BackgroundCheckType.ADDRESS_VERIFICATION
    }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "checkType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BackgroundCheckStatus,
        default: BackgroundCheckStatus.PENDING
    }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RiskLevel,
        nullable: true
    }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "riskLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BackgroundCheck.prototype, "checkData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], BackgroundCheck.prototype, "verificationSources", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], BackgroundCheck.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], BackgroundCheck.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BackgroundCheck.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BackgroundCheck.prototype, "updatedAt", void 0);
exports.BackgroundCheck = BackgroundCheck = __decorate([
    (0, typeorm_1.Entity)('background_checks'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['checkType']),
    (0, typeorm_1.Index)(['riskLevel'])
], BackgroundCheck);
//# sourceMappingURL=background-check.entity.js.map