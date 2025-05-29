import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getBasicAnalytics(): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
