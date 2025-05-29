import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(UserLocation)
    private readonly userLocationRepository: Repository<UserLocation>,
  ) {}

  async createLocation(createLocationDto: CreateLocationDto): Promise<UserLocation> {
    const location = this.userLocationRepository.create({
      ...createLocationDto,
      latitude: createLocationDto.coordinates?.latitude,
      longitude: createLocationDto.coordinates?.longitude,
    });

    return await this.userLocationRepository.save(location);
  }

  async findLocationByUserId(userId: string): Promise<UserLocation | null> {
    return await this.userLocationRepository.findOne({
      where: { userId },
      order: { updatedAt: 'DESC' }
    });
  }

  async updateLocation(userId: string, updateLocationDto: UpdateLocationDto): Promise<UserLocation> {
    const existingLocation = await this.findLocationByUserId(userId);
    
    if (!existingLocation) {
      throw new NotFoundException('User location not found');
    }

    const updatedData = {
      ...updateLocationDto,
      latitude: updateLocationDto.coordinates?.latitude,
      longitude: updateLocationDto.coordinates?.longitude,
    };

    await this.userLocationRepository.update(existingLocation.id, updatedData);
    
    const updatedLocation = await this.userLocationRepository.findOne({
      where: { id: existingLocation.id }
    });

    if (!updatedLocation) {
      throw new NotFoundException('Failed to retrieve updated location');
    }

    return updatedLocation;
  }

  async findNearbyUsers(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<UserLocation[]> {
    // Using Haversine formula for distance calculation
    const query = `
      SELECT *, (
        6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )
      ) AS distance
      FROM user_locations
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < ?
      ORDER BY distance
    `;

    return await this.userLocationRepository.query(query, [
      latitude,
      longitude,
      latitude,
      radiusKm
    ]);
  }

  async findLocationsByCity(city: string): Promise<UserLocation[]> {
    return await this.userLocationRepository.find({
      where: { city },
      order: { updatedAt: 'DESC' }
    });
  }

  async findLocationsByState(state: string): Promise<UserLocation[]> {
    return await this.userLocationRepository.find({
      where: { state },
      order: { updatedAt: 'DESC' }
    });
  }

  async verifyLocation(userId: string): Promise<UserLocation> {
    const location = await this.findLocationByUserId(userId);
    
    if (!location) {
      throw new NotFoundException('User location not found');
    }

    await this.userLocationRepository.update(location.id, { isVerified: true });
    
    const verifiedLocation = await this.userLocationRepository.findOne({
      where: { id: location.id }
    });

    if (!verifiedLocation) {
      throw new NotFoundException('Failed to retrieve verified location');
    }

    return verifiedLocation;
  }

  async deleteLocation(userId: string): Promise<void> {
    const location = await this.findLocationByUserId(userId);
    
    if (!location) {
      throw new NotFoundException('User location not found');
    }

    await this.userLocationRepository.delete(location.id);
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 