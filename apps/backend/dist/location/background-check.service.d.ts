import { Repository } from 'typeorm';
import { BackgroundCheck, BackgroundCheckStatus, RiskLevel } from './entities/background-check.entity';
import { LocationService } from './location.service';
export interface BackgroundCheckResult {
    id: string;
    status: BackgroundCheckStatus;
    riskLevel?: RiskLevel;
    checkData: any;
    notes?: string;
}
export declare class BackgroundCheckService {
    private readonly backgroundCheckRepository;
    private readonly locationService;
    constructor(backgroundCheckRepository: Repository<BackgroundCheck>, locationService: LocationService);
    initiateAddressVerification(userId: string): Promise<BackgroundCheck>;
    initiateIdentityVerification(userId: string): Promise<BackgroundCheck>;
    getBackgroundChecksByUserId(userId: string): Promise<BackgroundCheck[]>;
    getBackgroundCheckById(id: string): Promise<BackgroundCheck | null>;
    updateBackgroundCheckStatus(id: string, status: BackgroundCheckStatus, checkData?: any, riskLevel?: RiskLevel, notes?: string): Promise<BackgroundCheck>;
    private performAddressVerification;
    private performIdentityVerification;
    private mockAddressVerification;
    private mockIdentityVerification;
    getUserRiskAssessment(userId: string): Promise<{
        overallRisk: RiskLevel;
        completedChecks: number;
        pendingChecks: number;
        failedChecks: number;
    }>;
}
