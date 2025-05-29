# Location Feature Implementation

## Overview

The location feature in Kaabil Sewak enables users to share their location for better job matching and performs subtle background checks for verification. This feature is designed with privacy and user experience in mind, providing value while maintaining trust.

## Features

### 🎯 Core Functionality
- **Location Collection**: GPS-based and manual location entry
- **Job Proximity Matching**: Find jobs within walking/commuting distance
- **Background Verification**: Subtle address and identity verification
- **Multi-language Support**: Hindi, Bengali, and English
- **Privacy-First Design**: Optional location sharing with clear benefits

### 🔒 Background Checks
- **Address Verification**: Validates user-provided addresses
- **Risk Assessment**: Automated risk scoring for employers
- **Verification Sources**: Government databases, postal services, local authorities
- **Async Processing**: Non-blocking verification process

## Architecture

### Mobile App (React Native + Expo)
```
src/
├── services/
│   └── locationService.ts          # Location permissions & GPS
├── components/
│   └── onboarding/
│       └── LocationCollector.tsx   # Location collection UI
└── screens/
    └── OnboardingScreen.tsx        # Integrated onboarding flow
```

### Backend (NestJS + TypeORM)
```
src/location/
├── entities/
│   ├── user-location.entity.ts     # Location data model
│   └── background-check.entity.ts  # Verification data model
├── dto/
│   └── create-location.dto.ts      # API data transfer objects
├── services/
│   ├── location.service.ts         # Location CRUD operations
│   └── background-check.service.ts # Verification logic
├── location.controller.ts          # REST API endpoints
└── location.module.ts              # Module configuration
```

## API Endpoints

### Location Management
- `POST /location` - Create user location
- `GET /location/user/:userId` - Get user location
- `PUT /location/user/:userId` - Update user location
- `DELETE /location/user/:userId` - Delete user location
- `GET /location/nearby` - Find nearby users
- `GET /location/city/:city` - Find users by city
- `GET /location/state/:state` - Find users by state

### Background Checks
- `POST /location/background-check/address/:userId` - Initiate address verification
- `POST /location/background-check/identity/:userId` - Initiate identity verification
- `GET /location/background-check/user/:userId` - Get user's background checks
- `GET /location/background-check/:checkId` - Get specific background check
- `GET /location/risk-assessment/:userId` - Get user risk assessment

## Database Schema

### UserLocation Entity
```typescript
{
  id: string;              // UUID primary key
  userId: string;          // User identifier
  address: string;         // Full address
  city: string;           // City name
  state: string;          // State/region
  pincode: string;        // Postal code
  latitude: number;       // GPS latitude
  longitude: number;      // GPS longitude
  coordinates: object;    // Coordinate object
  isVerified: boolean;    // Verification status
  source: enum;          // 'gps' | 'manual' | 'geocoded'
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

### BackgroundCheck Entity
```typescript
{
  id: string;                    // UUID primary key
  userId: string;               // User identifier
  userLocationId: string;       // Related location
  checkType: enum;             // Type of verification
  status: enum;                // Verification status
  riskLevel: enum;             // Risk assessment
  checkData: object;           // Verification results
  verificationSources: object; // Data sources used
  notes: string;               // Additional notes
  verifiedBy: string;          // Verifier identifier
  completedAt: Date;           // Completion timestamp
  createdAt: Date;             // Creation timestamp
  updatedAt: Date;             // Last update timestamp
}
```

## User Experience Flow

### 1. Onboarding Integration
```
Language Selection → Sign Up → Location Collection → Complete
```

### 2. Location Collection Options
- **Use Current Location**: GPS-based with permission request
- **Enter Manually**: Form-based address entry
- **Skip for Now**: Optional with clear impact explanation

### 3. Background Verification (Automatic)
1. Address verification initiated on location save
2. Async processing with status updates
3. Risk assessment calculation
4. Employer visibility of verification status

## Privacy & Security

### Data Protection
- **Minimal Data Collection**: Only necessary location data
- **User Consent**: Clear permission requests with benefits
- **Data Encryption**: Secure storage and transmission
- **Retention Policy**: Configurable data retention periods

### Transparency
- **Clear Benefits**: Users understand value proposition
- **Verification Status**: Users can see their verification status
- **Control**: Users can update or delete location data
- **Audit Trail**: Complete verification history

## Implementation Details

### Mobile App Features
- **Permission Handling**: Graceful permission requests
- **Error Handling**: Fallback to manual entry
- **Offline Support**: Cache location data locally
- **Multi-language**: Localized UI and messages

### Backend Features
- **Async Processing**: Non-blocking verification
- **Scalable Architecture**: Modular service design
- **Database Optimization**: Indexed queries for performance
- **API Documentation**: Comprehensive endpoint documentation

## Testing

### Mobile App Tests
```bash
cd apps/mobile-blue
npm test
```

### Backend Tests
```bash
cd apps/backend
npm run test
```

### Test Coverage
- Location service functionality
- Permission handling
- Error scenarios
- Background verification logic
- API endpoint validation

## Configuration

### Mobile App (app.json)
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Find jobs near you"
      }
    },
    "android": {
      "permissions": [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
      ]
    }
  }
}
```

### Backend Environment
```env
DATABASE_URL=sqlite:kaabil-sewak.db
VERIFICATION_API_KEY=your_verification_service_key
GEOCODING_API_KEY=your_geocoding_service_key
```

## Future Enhancements

### Planned Features
- **Real-time Location**: Live location sharing for active jobs
- **Geofencing**: Location-based job notifications
- **Advanced Verification**: Document verification integration
- **Analytics**: Location-based job market insights

### Integration Opportunities
- **Government APIs**: Direct integration with official databases
- **Third-party Services**: Enhanced verification providers
- **Mapping Services**: Advanced location visualization
- **ML/AI**: Intelligent location-based job matching

## Monitoring & Analytics

### Key Metrics
- Location collection success rate
- Verification completion rate
- Job matching accuracy
- User privacy compliance

### Performance Monitoring
- API response times
- Database query performance
- Background job processing
- Error rates and patterns

## Support & Troubleshooting

### Common Issues
1. **Location Permission Denied**: Fallback to manual entry
2. **GPS Accuracy**: Use network-based location as backup
3. **Verification Delays**: Async processing with status updates
4. **Data Inconsistency**: Validation and error handling

### Debug Tools
- Location service logs
- Verification status dashboard
- API endpoint testing
- Database query analysis

## Compliance

### Regulatory Compliance
- **GDPR**: Data protection and user rights
- **Local Laws**: Regional privacy regulations
- **Industry Standards**: Security best practices
- **Accessibility**: WCAG compliance for UI components

This location feature provides a solid foundation for location-based job matching while maintaining user privacy and trust through transparent, beneficial background verification processes. 