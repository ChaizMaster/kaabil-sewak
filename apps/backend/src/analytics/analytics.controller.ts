import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getBasicAnalytics() {
    const analytics = await this.analyticsService.getBasicAnalytics();
    
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    };
  }
} 