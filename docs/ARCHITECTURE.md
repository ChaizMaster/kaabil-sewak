# 🏗️ Kaabil Sewak Architecture

## 📐 **System Architecture Overview**

Kaabil Sewak is a **three-tier digital workforce management ecosystem** designed to revolutionize India's traditional employment hierarchy through intelligent technology and seamless data synchronization.

## 🏢 **Three-Tier Workforce Ecosystem**

```
┌─────────────────────────────────────────────────────────────┐
│                    Tier 1: White-collar                    │
│                      Web Portal                            │
│   Enterprise-grade UI/UX for Corporate Managers           │
├─────────────────────────────────────────────────────────────┤
│   • Hire & Manage Grey-collar workers                     │
│   • Complete workforce visibility (Grey + Blue collar)     │
│   • Smart Contract Builder (Premium)                      │
│   • Business Intelligence Dashboard                       │
│   • Real-time hierarchical analytics                      │
└─────────────────┬───────────────────────────────────────────┘
                  │ Hires & Manages
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    Tier 2: Grey-collar                     │
│                     Mobile App                             │
│   Sophisticated UI/UX for Supervisors & Contractors       │
├─────────────────────────────────────────────────────────────┤
│   • Hire & Manage Blue-collar workers                     │
│   • On-site job posting & wage negotiation                │
│   • Access verified blue-collar profiles                  │
│   • Real-time sync with White-collar dashboard            │
│   • Labor mandi digitization                              │
└─────────────────┬───────────────────────────────────────────┘
                  │ Hires & Manages
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    Tier 3: Blue-collar                     │
│                   Ultra-Simple Mobile App                  │
│   Illiterate-friendly UI for Manual Workers               │
├─────────────────────────────────────────────────────────────┤
│   • Job discovery & application                           │
│   • Wage negotiation with Grey-collar                     │
│   • Subtle background verification                        │
│   • SewakCoins rewards & gamification                     │
│   • Voice commands in Hindi/Bengali                       │
└─────────────────────────────────────────────────────────────┘
                  │ Data flows back up
                  ↑ Real-time synchronization
```

## 🏛️ **Application Structure**

### **apps/** - Three-Tier Applications
- **backend/** - Unified NestJS API server handling all three tiers
- **web/** - Next.js web portal for white-collar users + executive dashboard
- **mobile-grey/** - React Native app for grey-collar supervisors/contractors  
- **mobile-blue/** - React Native ultra-simple app for blue-collar workers

### **packages/** - Shared Libraries
- **shared/** - Common utilities, types, constants across all tiers
- **ui/** - Shared React components library with multi-language support

## 👥 **User Segmentation & Platform Access**

### **White-collar Web Portal (Next.js)** 🖥️

#### **Target Users**
- **Corporate HR departments**: Large-scale workforce management
- **Manufacturing companies**: Factory and production workforce
- **Construction companies**: Project-based team management
- **Facility management firms**: Service workforce coordination
- **Enterprise managers**: Strategic workforce planning

#### **Core Features**
- **Grey-collar Hiring Hub**: Advanced search, verification, smart matching
- **Comprehensive Workforce Dashboard**: Complete visibility into Grey + Blue collar workers
- **Smart Contract Builder** (Premium): Legal cost recovery contracts
- **Business Intelligence**: Executive insights, market analytics, competitive intelligence
- **Real-time Workforce Monitoring**: Live updates from all tiers

#### **Technical Requirements**
- **State-of-the-art UI/UX**: Enterprise-grade design for tech-savvy users
- **Advanced Analytics**: Complex data visualization and reporting
- **Multi-project Management**: Handle multiple projects with hierarchical teams
- **Integration APIs**: HRMS, payroll, and enterprise system integration

### **Grey-collar Mobile App (React Native)** 📱

#### **Target Users** 
- **Site supervisors**: Construction site management
- **Contractors**: Project execution and team coordination
- **Team leads**: Department/section management
- **Small business owners**: Local service providers
- **Field managers**: On-ground operations

#### **Core Features**
- **Blue-collar Hiring System**: Quick job posting with labor mandi integration
- **Smart Worker Profiles**: Access to verified blue-collar worker backgrounds
- **Wage Negotiation Engine**: Digital bargaining with real-time agreements
- **Team Management Tools**: Attendance, performance, payment tracking
- **Real-time White-collar Sync**: All decisions instantly visible to enterprise dashboard

#### **Technical Requirements**
- **Good UI/UX**: Professional interface for moderately tech-savvy users
- **Offline Capability**: Work in areas with poor connectivity
- **GPS Integration**: Location-based hiring and job management
- **Quick Actions**: Fast hiring decisions while on-site

### **Blue-collar Mobile App (React Native)** 📲

#### **Target Users**
- **Construction workers**: Building, electrical, plumbing, painting
- **Domestic help**: Housekeeping, cooking, childcare, eldercare
- **Delivery personnel**: Food delivery, courier, logistics
- **Factory workers**: Manufacturing, assembly, packaging
- **Manual laborers**: Agriculture, loading/unloading, general labor
- **Agricultural workers**: Farming, harvesting, seasonal work

#### **Core Features**
- **Ultra-Simple Job Discovery**: Visual job cards with minimal text
- **Voice-Powered Search**: "मुझे काम चाहिए" voice commands
- **Subtle Verification**: Background data collection without appearing intrusive
- **Wage Negotiation**: Simple interface to bargain with grey-collar hirers
- **SewakCoins Wallet**: Gamified rewards for reliability and good behavior

#### **Technical Requirements**
- **₹5,000 Smartphone Compatible**: Must work on budget Android phones
- **Illiterate-friendly Design**: Icons, voice guidance, minimal text
- **Multi-language Support**: Hindi, Bengali, future expansion
- **Offline Functionality**: Core features work without internet

## 🔄 **Real-time Data Synchronization Architecture**

### **Hierarchical Data Flow**
```typescript
interface HierarchicalDataSync {
  // Upward data flow
  blueCollarActions: {
    source: 'blue_collar_app';
    destinations: ['grey_collar_app', 'white_collar_dashboard'];
    events: ['job_application', 'wage_negotiation', 'attendance', 'performance'];
    latency: '<200ms';
  };
  
  greyCollarActions: {
    source: 'grey_collar_app';
    destinations: ['white_collar_dashboard'];
    events: ['blue_collar_hired', 'team_updates', 'project_progress', 'cost_tracking'];
    latency: '<200ms';
  };
  
  // Downward policy flow
  whiteCollarPolicies: {
    source: 'white_collar_dashboard';
    destinations: ['grey_collar_app'];
    events: ['budget_updates', 'hiring_policies', 'project_assignments'];
    latency: '<500ms';
  };
}
```

### **Real-time Event Architecture**
```typescript
// WebSocket-based real-time updates
class HierarchicalEventService {
  // When blue-collar worker is hired
  async onBlueCollarHired(greyCollarId: string, blueCollarId: string, jobData: JobData) {
    // Update grey-collar app
    await this.notifyGreyCollarApp(greyCollarId, {
      type: 'team_member_added',
      worker: blueCollarId,
      job: jobData
    });
    
    // Sync to white-collar dashboard
    await this.notifyWhiteCollarDashboard({
      type: 'workforce_update',
      supervisor: greyCollarId,
      newWorker: blueCollarId,
      hierarchyLevel: 'blue_collar',
      timestamp: new Date()
    });
    
    // Update business intelligence
    await this.updateBusinessIntelligence({
      event: 'hiring_activity',
      tier: 'grey_to_blue',
      costImpact: jobData.wage,
      marketSegment: jobData.industry
    });
  }
}
```

## 🌐 **Multi-language Architecture**

### **Language Support Framework**
```typescript
interface MultiLanguageSupport {
  supportedLanguages: {
    phase1: ['english', 'hindi', 'bengali'];
    phase2: ['tamil', 'telugu', 'marathi', 'gujarati'];
    phase3: ['punjabi', 'kannada', 'malayalam', 'odia'];
  };
  
  implementation: {
    uiLocalization: 'react-i18next';
    voiceCommands: 'speech_recognition_api';
    textToSpeech: 'browser_speech_synthesis';
    rtlSupport: boolean; // For future Arabic/Urdu
  };
  
  userExperience: {
    selectionTiming: 'first_app_launch';
    changeOption: 'settings_menu';
    persistence: 'user_profile_storage';
    fallback: 'english';
  };
}
```

### **Voice Command Architecture**
```typescript
// Voice AI for blue-collar users
class VoiceCommandService {
  async processVoiceCommand(audioBlob: Blob, language: 'hindi' | 'bengali' | 'english') {
    // Convert speech to text
    const transcript = await this.speechToText(audioBlob, language);
    
    // Process natural language intent
    const intent = await this.nlpProcessor.extractIntent(transcript, language);
    
    // Execute appropriate action
    switch (intent.type) {
      case 'job_search':
        return await this.searchJobs(intent.parameters);
      case 'wage_inquiry':
        return await this.getWageInfo(intent.parameters);
      case 'help_request':
        return await this.provideHelp(intent.parameters, language);
    }
  }
}
```

## 🧩 **Backend Architecture (NestJS)**

### **Three-Tier API Structure**
```typescript
src/
├── modules/
│   ├── auth/                    # Authentication for all three tiers
│   ├── users/                   # User management (white/grey/blue collar)
│   ├── white-collar/           # Enterprise features
│   │   ├── grey-collar-hiring/
│   │   ├── workforce-dashboard/
│   │   ├── smart-contracts/
│   │   └── business-intelligence/
│   ├── grey-collar/            # Supervisor features  
│   │   ├── blue-collar-hiring/
│   │   ├── team-management/
│   │   ├── wage-negotiation/
│   │   └── labor-mandi/
│   ├── blue-collar/            # Worker features
│   │   ├── job-discovery/
│   │   ├── application-system/
│   │   ├── wage-negotiation/
│   │   └── sewakcoins/
│   ├── shared/                 # Cross-tier features
│   │   ├── verification/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   └── real-time-sync/
│   └── ai/                     # AI services
│       ├── matching-engine/
│       ├── behavioral-analysis/
│       ├── business-intelligence/
│       └── voice-processing/
```

### **API Design Principles**
1. **Tier-based routing** (/api/v1/white-collar/, /api/v1/grey-collar/, /api/v1/blue-collar/)
2. **Hierarchical permissions** with white-collar having highest access
3. **Real-time sync APIs** for cross-tier data updates
4. **Multi-language support** in all endpoints
5. **Subtle data collection** APIs for blue-collar tier

## 🎯 **Platform Feature Distribution**

### **White-collar Exclusive Features** 🖥️
- **Smart Contract Builder**: Legal cost recovery agreements
- **Executive Dashboard**: Strategic business intelligence
- **Bulk Operations**: Mass hiring and workforce management
- **Advanced Analytics**: Market insights and competitive analysis
- **Integration APIs**: Enterprise system connectivity
- **Multi-project Management**: Complex project hierarchies

### **Grey-collar Specialized Features** 📱
- **Labor Mandi Integration**: Traditional hiring practice digitization
- **On-site Job Posting**: Quick hiring while in the field
- **Blue-collar Profile Access**: Verified worker backgrounds
- **Wage Negotiation Tools**: Digital bargaining interfaces
- **Team Performance Tracking**: Supervisor analytics
- **Real-time Reporting**: Updates to white-collar dashboard

### **Blue-collar Optimized Features** 📲
- **Voice Job Search**: Hindi/Bengali voice commands
- **Ultra-simple UI**: Icon-based navigation
- **Subtle Verification**: Background data collection
- **SewakCoins Gamification**: Reward system for good behavior
- **Offline Capability**: Works without internet connection
- **Visual Confirmation**: Picture-based interactions

### **Cross-tier Shared Features** 🔄
- **Real-time Notifications**: Push notifications across all tiers
- **Multi-language Support**: Consistent language experience
- **Analytics Collection**: Data capture for AI training
- **Security Framework**: Unified authentication and authorization
- **Payment Processing**: SewakCoins and wage transactions

## 📊 **Data Flow & Analytics Architecture**

### **Three-tier Analytics Pipeline**
```typescript
interface TierAnalytics {
  whiteCollar: {
    businessIntelligence: {
      revenueOptimization: RevenueData[];
      marketAnalysis: MarketData[];
      competitiveIntelligence: CompetitorData[];
      workforceROI: ROIData[];
    };
    workforceAnalytics: {
      supervisorPerformance: SupervisorMetrics[];
      teamEfficiency: TeamData[];
      costAnalysis: CostData[];
      retentionAnalysis: RetentionData[];
    };
  };
  
  greyCollar: {
    hiringAnalytics: {
      candidateSelection: SelectionData[];
      negotiationPatterns: NegotiationData[];
      timeToHire: PerformanceData[];
      successRates: SuccessData[];
    };
    teamAnalytics: {
      workerPerformance: PerformanceData[];
      attendancePatterns: AttendanceData[];
      productivityMetrics: ProductivityData[];
      teamDynamics: TeamData[];
    };
  };
  
  blueCollar: {
    behaviorAnalytics: {
      jobSearchPatterns: SearchData[];
      applicationBehavior: ApplicationData[];
      negotiationBehavior: NegotiationData[];
      workPatterns: WorkData[];
    };
    subtleAnalytics: {
      locationPatterns: LocationData[];
      deviceUsage: DeviceData[];
      socialConnections: NetworkData[];
      economicBehavior: EconomicData[];
    };
  };
}
```

## 🔐 **Security & Compliance Architecture**

### **Tier-based Security Model**
- **White-collar**: Enterprise-grade security with SSO integration
- **Grey-collar**: Professional security with multi-factor authentication
- **Blue-collar**: Simplified security with biometric authentication

### **Data Protection Framework**
- **DPDP Act Compliance**: Full compliance with Indian data protection laws
- **Subtle Data Collection**: Transparent but non-intrusive for blue-collar users
- **Hierarchical Data Access**: Strict tier-based data visibility controls
- **Audit Trail**: Complete action history across all tiers

## 🚀 **Scalability & Performance**

### **Horizontal Scaling Strategy**
- **Tier-specific Scaling**: Independent scaling based on tier usage patterns
- **Microservices Architecture**: Service-based scaling for optimal resource utilization
- **Database Partitioning**: Tier-based data partitioning for performance
- **CDN Strategy**: Multi-language content delivery optimization

### **Performance Optimization**
- **Real-time Sync Optimization**: Efficient data synchronization across tiers
- **Mobile App Performance**: Optimized for ₹5,000 smartphones
- **Voice Processing**: Fast speech recognition and synthesis
- **Analytics Processing**: Real-time and batch analytics processing

---

*This architecture enables seamless three-tier workforce management while maintaining optimal user experience and comprehensive data intelligence across all levels of the employment hierarchy.* 