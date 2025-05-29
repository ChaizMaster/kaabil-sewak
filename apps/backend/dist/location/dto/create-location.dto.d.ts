declare class CoordinatesDto {
    latitude: number;
    longitude: number;
}
export declare class CreateLocationDto {
    userId: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: CoordinatesDto;
    source?: 'gps' | 'manual' | 'geocoded';
}
export declare class UpdateLocationDto {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    coordinates?: CoordinatesDto;
    isVerified?: boolean;
    source?: 'gps' | 'manual' | 'geocoded';
}
export {};
