import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  constructor() {}

  // Placeholder for future analytics functionality
  async getBasicAnalytics(): Promise<any> {
    return {
      message: 'Analytics service ready for future implementation',
      timestamp: new Date().toISOString(),
    };
  }
} 