"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_location_entity_1 = require("./entities/user-location.entity");
let LocationService = class LocationService {
    userLocationRepository;
    constructor(userLocationRepository) {
        this.userLocationRepository = userLocationRepository;
    }
    async createLocation(createLocationDto) {
        const location = this.userLocationRepository.create({
            ...createLocationDto,
            latitude: createLocationDto.coordinates?.latitude,
            longitude: createLocationDto.coordinates?.longitude,
        });
        return await this.userLocationRepository.save(location);
    }
    async findLocationByUserId(userId) {
        return await this.userLocationRepository.findOne({
            where: { userId },
            order: { updatedAt: 'DESC' }
        });
    }
    async updateLocation(userId, updateLocationDto) {
        const existingLocation = await this.findLocationByUserId(userId);
        if (!existingLocation) {
            throw new common_1.NotFoundException('User location not found');
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
            throw new common_1.NotFoundException('Failed to retrieve updated location');
        }
        return updatedLocation;
    }
    async findNearbyUsers(latitude, longitude, radiusKm = 50) {
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
    async findLocationsByCity(city) {
        return await this.userLocationRepository.find({
            where: { city },
            order: { updatedAt: 'DESC' }
        });
    }
    async findLocationsByState(state) {
        return await this.userLocationRepository.find({
            where: { state },
            order: { updatedAt: 'DESC' }
        });
    }
    async verifyLocation(userId) {
        const location = await this.findLocationByUserId(userId);
        if (!location) {
            throw new common_1.NotFoundException('User location not found');
        }
        await this.userLocationRepository.update(location.id, { isVerified: true });
        const verifiedLocation = await this.userLocationRepository.findOne({
            where: { id: location.id }
        });
        if (!verifiedLocation) {
            throw new common_1.NotFoundException('Failed to retrieve verified location');
        }
        return verifiedLocation;
    }
    async deleteLocation(userId) {
        const location = await this.findLocationByUserId(userId);
        if (!location) {
            throw new common_1.NotFoundException('User location not found');
        }
        await this.userLocationRepository.delete(location.id);
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_location_entity_1.UserLocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocationService);
//# sourceMappingURL=location.service.js.map