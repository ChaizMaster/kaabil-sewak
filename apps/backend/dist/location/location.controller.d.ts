import { LocationService } from './location.service';
import { BackgroundCheckService } from './background-check.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
export declare class LocationController {
    private readonly locationService;
    private readonly backgroundCheckService;
    constructor(locationService: LocationService, backgroundCheckService: BackgroundCheckService);
    createLocation(createLocationDto: CreateLocationDto): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation;
        message: string;
    }>;
    getUserLocation(userId: string): Promise<{
        success: boolean;
        data: null;
        message: string;
    } | {
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation;
        message: string;
    }>;
    updateUserLocation(userId: string, updateLocationDto: UpdateLocationDto): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation;
        message: string;
    }>;
    deleteUserLocation(userId: string): Promise<{
        success: boolean;
        data: null;
        message: string;
    }>;
    findNearbyUsers(latitude: number, longitude: number, radius?: number): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation[];
        message: string;
    }>;
    findUsersByCity(city: string): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation[];
        message: string;
    }>;
    findUsersByState(state: string): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation[];
        message: string;
    }>;
    verifyUserLocation(userId: string): Promise<{
        success: boolean;
        data: import("./entities/user-location.entity").UserLocation;
        message: string;
    }>;
    initiateAddressVerification(userId: string): Promise<{
        success: boolean;
        data: import("./entities/background-check.entity").BackgroundCheck;
        message: string;
    }>;
    initiateIdentityVerification(userId: string): Promise<{
        success: boolean;
        data: import("./entities/background-check.entity").BackgroundCheck;
        message: string;
    }>;
    getUserBackgroundChecks(userId: string): Promise<{
        success: boolean;
        data: import("./entities/background-check.entity").BackgroundCheck[];
        message: string;
    }>;
    getBackgroundCheck(checkId: string): Promise<{
        success: boolean;
        data: null;
        message: string;
    } | {
        success: boolean;
        data: import("./entities/background-check.entity").BackgroundCheck;
        message: string;
    }>;
    getUserRiskAssessment(userId: string): Promise<{
        success: boolean;
        data: {
            overallRisk: import("./entities/background-check.entity").RiskLevel;
            completedChecks: number;
            pendingChecks: number;
            failedChecks: number;
        };
        message: string;
    }>;
}
