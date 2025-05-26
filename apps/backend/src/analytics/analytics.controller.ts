import { Controller, Post, Get, Body, Query, ValidationPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAudioInteractionDto } from './dto/create-audio-interaction.dto';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('audio-interaction')
  async trackAudioInteraction(
    @Body(ValidationPipe) createAudioInteractionDto: CreateAudioInteractionDto,
  ) {
    try {
      const result = await this.analyticsService.trackAudioInteraction(createAudioInteractionDto);
      return {
        success: true,
        data: result,
        message: 'Audio interaction tracked successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to track audio interaction',
      };
    }
  }

  @Get('audio-analytics')
  async getAudioAnalytics(@Query('userId') userId?: string) {
    try {
      const analytics = await this.analyticsService.getAudioAnalytics(userId);
      return {
        success: true,
        data: analytics,
        message: 'Audio analytics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve audio analytics',
      };
    }
  }

  @Get('user-audio-history')
  async getUserAudioHistory(@Query('userId') userId: string) {
    if (!userId) {
      return {
        success: false,
        error: 'userId is required',
        message: 'User ID parameter is missing',
      };
    }

    try {
      const history = await this.analyticsService.getUserAudioHistory(userId);
      return {
        success: true,
        data: history,
        message: 'User audio history retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve user audio history',
      };
    }
  }
} 