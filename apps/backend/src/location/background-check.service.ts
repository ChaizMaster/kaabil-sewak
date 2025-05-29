import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackgroundCheck, BackgroundCheckStatus, BackgroundCheckType, RiskLevel } from './entities/background-check.entity';
import { LocationService } from './location.service';

export interface BackgroundCheckResult {
  id: string;
  status: BackgroundCheckStatus;
  riskLevel?: RiskLevel;
  checkData: any;
  notes?: string;
}

@Injectable()
export class BackgroundCheckService {
  constructor(
    @InjectRepository(BackgroundCheck)
    private readonly backgroundCheckRepository: Repository<BackgroundCheck>,
    private readonly locationService: LocationService,
  ) {}

  async initiateAddressVerification(userId: string): Promise<BackgroundCheck> {
    const userLocation = await this.locationService.findLocationByUserId(userId);
    
    if (!userLocation) {
      throw new NotFoundException('User location not found. Cannot initiate address verification.');
    }

    const backgroundCheck = this.backgroundCheckRepository.create({
      userId,
      userLocationId: userLocation.id,
      checkType: BackgroundCheckType.ADDRESS_VERIFICATION,
      status: BackgroundCheckStatus.PENDING,
    });

    const savedCheck = await this.backgroundCheckRepository.save(backgroundCheck);

    // Initiate async background verification process
    this.performAddressVerification(savedCheck.id, userLocation);

    return savedCheck;
  }

  async initiateIdentityVerification(userId: string): Promise<BackgroundCheck> {
    const backgroundCheck = this.backgroundCheckRepository.create({
      userId,
      checkType: BackgroundCheckType.IDENTITY_VERIFICATION,
      status: BackgroundCheckStatus.PENDING,
    });

    const savedCheck = await this.backgroundCheckRepository.save(backgroundCheck);

    // Initiate async identity verification process
    this.performIdentityVerification(savedCheck.id);

    return savedCheck;
  }

  async getBackgroundChecksByUserId(userId: string): Promise<BackgroundCheck[]> {
    return await this.backgroundCheckRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async getBackgroundCheckById(id: string): Promise<BackgroundCheck | null> {
    return await this.backgroundCheckRepository.findOne({
      where: { id }
    });
  }

  async updateBackgroundCheckStatus(
    id: string,
    status: BackgroundCheckStatus,
    checkData?: any,
    riskLevel?: RiskLevel,
    notes?: string
  ): Promise<BackgroundCheck> {
    const check = await this.getBackgroundCheckById(id);
    
    if (!check) {
      throw new NotFoundException('Background check not found');
    }

    const updateData: Partial<BackgroundCheck> = {
      status,
      ...(checkData && { checkData }),
      ...(riskLevel && { riskLevel }),
      ...(notes && { notes }),
      ...(status === BackgroundCheckStatus.COMPLETED && { completedAt: new Date() })
    };

    await this.backgroundCheckRepository.update(id, updateData);
    
    const updatedCheck = await this.backgroundCheckRepository.findOne({
      where: { id }
    });

    if (!updatedCheck) {
      throw new NotFoundException('Failed to retrieve updated background check');
    }

    return updatedCheck;
  }

  /**
   * Perform address verification (async process)
   */
  private async performAddressVerification(checkId: string, userLocation: any): Promise<void> {
    try {
      // Update status to in progress
      await this.updateBackgroundCheckStatus(checkId, BackgroundCheckStatus.IN_PROGRESS);

      // Simulate address verification process
      // In a real implementation, this would integrate with:
      // - Government address databases
      // - Postal service APIs
      // - Local authority records
      // - Third-party verification services

      await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate processing time

      // Mock verification logic
      const addressVerificationResult = await this.mockAddressVerification(userLocation);

      await this.updateBackgroundCheckStatus(
        checkId,
        BackgroundCheckStatus.COMPLETED,
        addressVerificationResult.checkData,
        addressVerificationResult.riskLevel,
        addressVerificationResult.notes
      );

      // If address is verified, also verify the location in the location service
      if (addressVerificationResult.checkData.addressMatches) {
        await this.locationService.verifyLocation(userLocation.userId);
      }

    } catch (error) {
      await this.updateBackgroundCheckStatus(
        checkId,
        BackgroundCheckStatus.FAILED,
        { error: error.message },
        RiskLevel.HIGH,
        'Address verification failed due to system error'
      );
    }
  }

  /**
   * Perform identity verification (async process)
   */
  private async performIdentityVerification(checkId: string): Promise<void> {
    try {
      await this.updateBackgroundCheckStatus(checkId, BackgroundCheckStatus.IN_PROGRESS);

      // Simulate identity verification process
      await new Promise(resolve => setTimeout(resolve, 8000));

      const identityVerificationResult = await this.mockIdentityVerification();

      await this.updateBackgroundCheckStatus(
        checkId,
        BackgroundCheckStatus.COMPLETED,
        identityVerificationResult.checkData,
        identityVerificationResult.riskLevel,
        identityVerificationResult.notes
      );

    } catch (error) {
      await this.updateBackgroundCheckStatus(
        checkId,
        BackgroundCheckStatus.FAILED,
        { error: error.message },
        RiskLevel.HIGH,
        'Identity verification failed due to system error'
      );
    }
  }

  /**
   * Mock address verification logic
   */
  private async mockAddressVerification(userLocation: any): Promise<{
    checkData: any;
    riskLevel: RiskLevel;
    notes: string;
  }> {
    // Mock verification based on location data quality
    const hasCoordinates = userLocation.coordinates && userLocation.latitude && userLocation.longitude;
    const hasCompleteAddress = userLocation.address && userLocation.city && userLocation.state;
    const hasPincode = userLocation.pincode && userLocation.pincode.length === 6;

    let addressMatches = false;
    let riskLevel = RiskLevel.MEDIUM;
    let notes = '';

    if (hasCoordinates && hasCompleteAddress && hasPincode) {
      addressMatches = Math.random() > 0.1; // 90% success rate for complete data
      riskLevel = addressMatches ? RiskLevel.LOW : RiskLevel.MEDIUM;
      notes = addressMatches 
        ? 'Address verified successfully with government records'
        : 'Address partially verified, minor discrepancies found';
    } else if (hasCompleteAddress) {
      addressMatches = Math.random() > 0.3; // 70% success rate for partial data
      riskLevel = addressMatches ? RiskLevel.MEDIUM : RiskLevel.HIGH;
      notes = addressMatches
        ? 'Address verified with limited data sources'
        : 'Address verification inconclusive, requires manual review';
    } else {
      addressMatches = false;
      riskLevel = RiskLevel.HIGH;
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

  /**
   * Mock identity verification logic
   */
  private async mockIdentityVerification(): Promise<{
    checkData: any;
    riskLevel: RiskLevel;
    notes: string;
  }> {
    // Mock identity verification
    const identityConfirmed = Math.random() > 0.15; // 85% success rate
    const riskLevel = identityConfirmed ? RiskLevel.LOW : RiskLevel.HIGH;

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

  /**
   * Get risk assessment for a user based on all background checks
   */
  async getUserRiskAssessment(userId: string): Promise<{
    overallRisk: RiskLevel;
    completedChecks: number;
    pendingChecks: number;
    failedChecks: number;
  }> {
    const checks = await this.getBackgroundChecksByUserId(userId);
    
    const completedChecks = checks.filter(c => c.status === BackgroundCheckStatus.COMPLETED);
    const pendingChecks = checks.filter(c => 
      c.status === BackgroundCheckStatus.PENDING || 
      c.status === BackgroundCheckStatus.IN_PROGRESS
    );
    const failedChecks = checks.filter(c => c.status === BackgroundCheckStatus.FAILED);

    // Calculate overall risk based on completed checks
    let overallRisk = RiskLevel.MEDIUM;
    
    if (failedChecks.length > 0) {
      overallRisk = RiskLevel.HIGH;
    } else if (completedChecks.length > 0) {
      const riskLevels = completedChecks
        .filter(c => c.riskLevel)
        .map(c => c.riskLevel);
      
      if (riskLevels.includes(RiskLevel.CRITICAL)) {
        overallRisk = RiskLevel.CRITICAL;
      } else if (riskLevels.includes(RiskLevel.HIGH)) {
        overallRisk = RiskLevel.HIGH;
      } else if (riskLevels.every(r => r === RiskLevel.LOW)) {
        overallRisk = RiskLevel.LOW;
      }
    }

    return {
      overallRisk,
      completedChecks: completedChecks.length,
      pendingChecks: pendingChecks.length,
      failedChecks: failedChecks.length,
    };
  }
} 