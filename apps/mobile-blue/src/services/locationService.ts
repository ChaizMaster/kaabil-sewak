import * as Location from 'expo-location';
import { UserLocation } from 'shared/src/types/user.types';

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
}

export interface LocationResult {
  location: UserLocation;
  error?: string;
}

export interface CurrentLocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class LocationService {
  /**
   * Request location permissions from the user
   */
  static async requestLocationPermission(): Promise<LocationPermissionResult> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return {
          granted: false,
          error: 'Location permission denied. Please enable location access in settings to find jobs near you.'
        };
      }

      return { granted: true };
    } catch (error) {
      return {
        granted: false,
        error: 'Failed to request location permission. Please try again.'
      };
    }
  }

  /**
   * Get current location coordinates
   */
  static async getCurrentLocationCoords(): Promise<CurrentLocationCoords | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address information
   */
  static async reverseGeocode(latitude: number, longitude: number): Promise<UserLocation | null> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length === 0) {
        return null;
      }

      const result = results[0];
      
      // Format address based on available data
      const addressParts = [
        result.streetNumber,
        result.street,
        result.subregion,
      ].filter(Boolean);

      const address = addressParts.length > 0 
        ? addressParts.join(', ')
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      return {
        address,
        city: result.city || result.subregion || 'Unknown City',
        state: result.region || 'Unknown State',
        pincode: result.postalCode || '',
        coordinates: {
          latitude,
          longitude,
        },
      };
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
      return null;
    }
  }

  /**
   * Get complete location data (coordinates + address)
   */
  static async getCurrentLocation(): Promise<LocationResult> {
    try {
      // First check/request permissions
      const permissionResult = await this.requestLocationPermission();
      if (!permissionResult.granted) {
        return {
          location: {
            address: '',
            city: '',
            state: '',
            pincode: '',
          },
          error: permissionResult.error,
        };
      }

      // Get current coordinates
      const coords = await this.getCurrentLocationCoords();
      if (!coords) {
        return {
          location: {
            address: '',
            city: '',
            state: '',
            pincode: '',
          },
          error: 'Unable to determine your current location. Please check your GPS settings.',
        };
      }

      // Reverse geocode to get address
      const locationData = await this.reverseGeocode(coords.latitude, coords.longitude);
      if (!locationData) {
        return {
          location: {
            address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
            city: 'Unknown City',
            state: 'Unknown State', 
            pincode: '',
            coordinates: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
          },
          error: 'Could not determine address details, but location coordinates were saved.',
        };
      }

      return {
        location: locationData,
      };
    } catch (error) {
      return {
        location: {
          address: '',
          city: '',
          state: '',
          pincode: '',
        },
        error: 'Failed to get location. Please try again or enter your location manually.',
      };
    }
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  static calculateDistance(
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

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
} 