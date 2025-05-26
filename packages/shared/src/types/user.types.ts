export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLanguage: Language;
  location: UserLocation;
  skills: string[];
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  BENGALI = 'bn'
}

export interface UserLocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  onboardingComplete: boolean;
  languageSelected: boolean;
}

export interface SignUpData {
  name: string;
  phone: string;
  email?: string;
  preferredLanguage: Language;
} 