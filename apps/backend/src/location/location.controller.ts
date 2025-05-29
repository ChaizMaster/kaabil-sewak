import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { BackgroundCheckService } from './background-check.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly backgroundCheckService: BackgroundCheckService,
  ) {}

  @Post()
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationService.createLocation(createLocationDto);
    
    // Automatically initiate address verification for new locations
    if (location.coordinates || (location.address && location.city && location.state)) {
      await this.backgroundCheckService.initiateAddressVerification(location.userId);
    }

    return {
      success: true,
      data: location,
      message: 'Location created successfully. Background verification initiated.'
    };
  }

  @Get('user/:userId')
  async getUserLocation(@Param('userId') userId: string) {
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

  @Put('user/:userId')
  async updateUserLocation(
    @Param('userId') userId: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    const location = await this.locationService.updateLocation(userId, updateLocationDto);
    
    // Re-initiate address verification if location data changed significantly
    if (updateLocationDto.address || updateLocationDto.coordinates) {
      await this.backgroundCheckService.initiateAddressVerification(userId);
    }

    return {
      success: true,
      data: location,
      message: 'Location updated successfully. Re-verification initiated.'
    };
  }

  @Delete('user/:userId')
  async deleteUserLocation(@Param('userId') userId: string) {
    await this.locationService.deleteLocation(userId);
    
    return {
      success: true,
      data: null,
      message: 'Location deleted successfully'
    };
  }

  @Get('nearby')
  async findNearbyUsers(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 50
  ) {
    const nearbyUsers = await this.locationService.findNearbyUsers(
      latitude,
      longitude,
      radius
    );

    return {
      success: true,
      data: nearbyUsers,
      message: `Found ${nearbyUsers.length} users within ${radius}km`
    };
  }

  @Get('city/:city')
  async findUsersByCity(@Param('city') city: string) {
    const users = await this.locationService.findLocationsByCity(city);
    
    return {
      success: true,
      data: users,
      message: `Found ${users.length} users in ${city}`
    };
  }

  @Get('state/:state')
  async findUsersByState(@Param('state') state: string) {
    const users = await this.locationService.findLocationsByState(state);
    
    return {
      success: true,
      data: users,
      message: `Found ${users.length} users in ${state}`
    };
  }

  @Post('verify/:userId')
  async verifyUserLocation(@Param('userId') userId: string) {
    const location = await this.locationService.verifyLocation(userId);
    
    return {
      success: true,
      data: location,
      message: 'Location verified successfully'
    };
  }

  // Background Check Endpoints

  @Post('background-check/address/:userId')
  async initiateAddressVerification(@Param('userId') userId: string) {
    const backgroundCheck = await this.backgroundCheckService.initiateAddressVerification(userId);
    
    return {
      success: true,
      data: backgroundCheck,
      message: 'Address verification initiated'
    };
  }

  @Post('background-check/identity/:userId')
  async initiateIdentityVerification(@Param('userId') userId: string) {
    const backgroundCheck = await this.backgroundCheckService.initiateIdentityVerification(userId);
    
    return {
      success: true,
      data: backgroundCheck,
      message: 'Identity verification initiated'
    };
  }

  @Get('background-check/user/:userId')
  async getUserBackgroundChecks(@Param('userId') userId: string) {
    const checks = await this.backgroundCheckService.getBackgroundChecksByUserId(userId);
    
    return {
      success: true,
      data: checks,
      message: `Found ${checks.length} background checks for user`
    };
  }

  @Get('background-check/:checkId')
  async getBackgroundCheck(@Param('checkId') checkId: string) {
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

  @Get('risk-assessment/:userId')
  async getUserRiskAssessment(@Param('userId') userId: string) {
    const riskAssessment = await this.backgroundCheckService.getUserRiskAssessment(userId);
    
    return {
      success: true,
      data: riskAssessment,
      message: 'Risk assessment retrieved successfully'
    };
  }
} 