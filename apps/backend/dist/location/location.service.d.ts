import { Repository } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
export declare class LocationService {
    private readonly userLocationRepository;
    constructor(userLocationRepository: Repository<UserLocation>);
    createLocation(createLocationDto: CreateLocationDto): Promise<UserLocation>;
    findLocationByUserId(userId: string): Promise<UserLocation | null>;
    updateLocation(userId: string, updateLocationDto: UpdateLocationDto): Promise<UserLocation>;
    findNearbyUsers(latitude: number, longitude: number, radiusKm?: number): Promise<UserLocation[]>;
    findLocationsByCity(city: string): Promise<UserLocation[]>;
    findLocationsByState(state: string): Promise<UserLocation[]>;
    verifyLocation(userId: string): Promise<UserLocation>;
    deleteLocation(userId: string): Promise<void>;
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private toRad;
}
