export declare class UserLocation {
    id: string;
    userId: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    isVerified: boolean;
    source: 'gps' | 'manual' | 'geocoded';
    createdAt: Date;
    updatedAt: Date;
}
