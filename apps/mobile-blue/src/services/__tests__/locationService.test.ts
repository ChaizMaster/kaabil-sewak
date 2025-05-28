import { LocationService } from '../locationService';
import * as Location from 'expo-location';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: {
    Balanced: 'balanced',
  },
}));

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('should return granted true when permission is granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await LocationService.requestLocationPermission();

      expect(result.granted).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return granted false when permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await LocationService.requestLocationPermission();

      expect(result.granted).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await LocationService.requestLocationPermission();

      expect(result.granted).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getCurrentLocationCoords', () => {
    it('should return coordinates when location is available', async () => {
      const mockLocation = {
        coords: {
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 10,
        },
      };

      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);

      const result = await LocationService.getCurrentLocationCoords();

      expect(result).toEqual({
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 10,
      });
    });

    it('should return null when location fails', async () => {
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
        new Error('Location error')
      );

      const result = await LocationService.getCurrentLocationCoords();

      expect(result).toBeNull();
    });
  });

  describe('reverseGeocode', () => {
    it('should return location data when geocoding succeeds', async () => {
      const mockGeocodeResult = [
        {
          streetNumber: '123',
          street: 'Main Street',
          city: 'New Delhi',
          region: 'Delhi',
          postalCode: '110001',
          subregion: 'Central Delhi',
        },
      ];

      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockGeocodeResult);

      const result = await LocationService.reverseGeocode(28.6139, 77.2090);

      expect(result).toEqual({
        address: '123, Main Street, Central Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090,
        },
      });
    });

    it('should return null when geocoding fails', async () => {
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

      const result = await LocationService.reverseGeocode(28.6139, 77.2090);

      expect(result).toBeNull();
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // Distance between Delhi and Mumbai (approximately 1150 km)
      const distance = LocationService.calculateDistance(
        28.6139, 77.2090, // Delhi
        19.0760, 72.8777  // Mumbai
      );

      expect(distance).toBeGreaterThan(1100);
      expect(distance).toBeLessThan(1200);
    });

    it('should return 0 for same coordinates', () => {
      const distance = LocationService.calculateDistance(
        28.6139, 77.2090,
        28.6139, 77.2090
      );

      expect(distance).toBeCloseTo(0, 1);
    });
  });
}); 