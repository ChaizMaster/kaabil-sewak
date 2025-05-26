# 🛠️ Implementation Guidelines

## 🎯 **Implementation Philosophy**

**"Transform principles into production-ready code through disciplined development practices"**

This document provides concrete implementation guidelines, code examples, and development workflows to build state-of-the-art features following our engineering principles.

## 🏗️ **Project Structure**

### **Monorepo Architecture**
```typescript
kaabil-sewak/
├── apps/
│   ├── web/                     # White-collar Web Portal (Next.js)
│   ├── mobile-grey/             # Grey-collar Mobile App (React Native)
│   ├── mobile-blue/             # Blue-collar Mobile App (React Native)
│   └── backend/                 # Unified API Backend (NestJS)
├── packages/
│   ├── shared/                  # Shared types & utilities
│   ├── ui/                      # Shared UI components
│   └── config/                  # Shared configurations
├── docs/                        # Documentation
└── tools/                       # Development tools & scripts
```

### **Application Architecture**
```typescript
// Frontend Apps Structure
apps/[app-name]/
├── src/
│   ├── components/              # React/React Native components
│   │   ├── common/             # Shared components
│   │   ├── [feature]/          # Feature-specific components
│   │   └── __tests__/          # Component tests
│   ├── screens/                # App screens/pages
│   ├── services/               # API services
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript definitions
│   └── __tests__/              # Integration tests
├── docs/                       # App-specific documentation
└── coverage/                   # Test coverage reports

// Backend Structure
apps/backend/
├── src/
│   ├── modules/                # Feature modules
│   │   ├── [feature]/
│   │   │   ├── controllers/    # HTTP controllers
│   │   │   ├── services/       # Business logic (Use Cases)
│   │   │   ├── entities/       # Domain entities
│   │   │   ├── repositories/   # Data access
│   │   │   ├── dto/            # Data transfer objects
│   │   │   └── __tests__/      # Module tests
│   ├── common/                 # Shared utilities
│   ├── config/                 # Configuration
│   └── database/               # Database setup
```

## 🔄 **Test-Driven Development Workflow**

### **TDD Cycle Implementation**

#### **Phase 1: RED - Write Failing Tests**
```typescript
// Example: Blue-collar Job Card Component
// File: apps/mobile-blue/src/components/jobs/__tests__/JobCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react-native';
import { JobCard } from '../JobCard';

describe('JobCard Component', () => {
  const mockJob = {
    id: 'job-123',
    title: 'Construction Worker',
    wage: 500,
    location: 'Sector 15, Gurgaon',
    distance: 2.5,
    requirements: ['Basic tools', 'Experience']
  };

  // RED: Write failing tests first
  it('should display job title prominently', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Construction Worker')).toBeVisible();
  });

  it('should show wage in large, clear format', () => {
    render(<JobCard job={mockJob} />);
    const wageElement = screen.getByText('₹500/day');
    expect(wageElement).toBeVisible();
    expect(wageElement).toHaveStyle({
      fontSize: 24,
      fontWeight: 'bold'
    });
  });

  it('should display location with distance', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Sector 15, Gurgaon (2.5 km)')).toBeVisible();
  });

  it('should have voice command functionality', () => {
    render(<JobCard job={mockJob} />);
    const voiceButton = screen.getByTestId('voice-command-button');
    expect(voiceButton).toBeVisible();
  });

  it('should call onApply when apply button is pressed', () => {
    const onApply = jest.fn();
    render(<JobCard job={mockJob} onApply={onApply} />);
    
    fireEvent.press(screen.getByText('Apply'));
    expect(onApply).toHaveBeenCalledWith('job-123');
  });

  it('should handle voice commands for application', async () => {
    const onVoiceApply = jest.fn();
    render(<JobCard job={mockJob} onVoiceApply={onVoiceApply} />);
    
    const voiceButton = screen.getByTestId('voice-command-button');
    fireEvent.press(voiceButton);
    
    // Simulate voice command
    const voicePrompt = screen.getByText('Say "Apply" to apply for this job');
    expect(voicePrompt).toBeVisible();
  });
});
```

#### **Phase 2: GREEN - Implement to Pass Tests**
```typescript
// File: apps/mobile-blue/src/components/jobs/JobCard.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VoiceCommandButton } from '../voice/VoiceCommandButton';
import { Job } from '@kaabil/shared/types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onVoiceApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onVoiceApply 
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes('apply')) {
      onVoiceApply?.(job.id);
      setIsListening(false);
    }
  };

  return (
    <View style={styles.container} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.wage}>₹{job.wage}/day</Text>
      <Text style={styles.location}>
        {job.location} ({job.distance} km)
      </Text>
      
      <View style={styles.requirements}>
        {job.requirements.map((req, index) => (
          <Text key={index} style={styles.requirement}>
            • {req}
          </Text>
        ))}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => onApply?.(job.id)}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
        
        <VoiceCommandButton
          testID="voice-command-button"
          isListening={isListening}
          onPress={() => setIsListening(true)}
          onVoiceCommand={handleVoiceCommand}
        />
      </View>
      
      {isListening && (
        <Text style={styles.voicePrompt}>
          Say "Apply" to apply for this job
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  wage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  requirements: {
    marginBottom: 16,
  },
  requirement: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  applyText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  voicePrompt: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
```

#### **Phase 3: REFACTOR - Improve Code Quality**
```typescript
// Refactored with better separation of concerns
// File: apps/mobile-blue/src/components/jobs/JobCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { useJobCardStyles } from '../../hooks/useJobCardStyles';
import { VoiceCommandButton } from '../voice/VoiceCommandButton';
import { JobRequirements } from './JobRequirements';
import { JobLocation } from './JobLocation';
import { Job } from '@kaabil/shared/types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const styles = useJobCardStyles();
  const { isListening, startListening, handleVoiceCommand } = useVoiceCommand({
    onCommand: (command) => {
      if (command.includes('apply')) {
        onApply?.(job.id);
      }
    }
  });

  return (
    <View style={styles.container} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.wage}>₹{job.wage}/day</Text>
      
      <JobLocation location={job.location} distance={job.distance} />
      <JobRequirements requirements={job.requirements} />
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => onApply?.(job.id)}
          accessibilityLabel={`Apply for ${job.title}`}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
        
        <VoiceCommandButton
          testID="voice-command-button"
          isListening={isListening}
          onPress={startListening}
          onVoiceCommand={handleVoiceCommand}
          accessibilityLabel="Voice apply for job"
        />
      </View>
      
      {isListening && (
        <Text style={styles.voicePrompt}>
          Say "Apply" to apply for this job
        </Text>
      )}
    </View>
  );
};
```

## 🔧 **Backend Implementation - Clean Architecture**

### **Domain Layer Implementation**
```typescript
// File: apps/backend/src/modules/blue-collar/domain/entities/Job.entity.ts

import { JobId } from '../value-objects/JobId';
import { JobTitle } from '../value-objects/JobTitle';
import { Wage } from '../value-objects/Wage';
import { Location } from '../value-objects/Location';
import { JobRequirements } from '../value-objects/JobRequirements';
import { JobStatus } from '../enums/JobStatus';
import { Worker } from './Worker.entity';
import { JobApplication } from './JobApplication.entity';

export class Job {
  constructor(
    public readonly id: JobId,
    public readonly title: JobTitle,
    public readonly wage: Wage,
    public readonly location: Location,
    public readonly employerId: string,
    public readonly requirements: JobRequirements,
    private _status: JobStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get status(): JobStatus {
    return this._status;
  }

  public canBeAppliedBy(worker: Worker): boolean {
    return this._status === JobStatus.ACTIVE && 
           this.requirements.isMetBy(worker.skills) &&
           !this.hasApplicationFrom(worker);
  }

  public apply(worker: Worker): JobApplication {
    if (!this.canBeAppliedBy(worker)) {
      throw new InvalidJobApplicationError(
        `Worker ${worker.id} cannot apply for job ${this.id}`
      );
    }
    
    return JobApplication.create(this.id, worker.id);
  }

  public close(): void {
    if (this._status !== JobStatus.ACTIVE) {
      throw new InvalidJobStatusTransitionError(
        `Cannot close job with status ${this._status}`
      );
    }
    this._status = JobStatus.CLOSED;
  }

  private hasApplicationFrom(worker: Worker): boolean {
    // This would typically check a repository
    // For now, we'll assume no duplicate applications
    return false;
  }
}
```

### **Application Layer Implementation**
```typescript
// File: apps/backend/src/modules/blue-collar/application/use-cases/ApplyForJob.usecase.ts

import { Injectable } from '@nestjs/common';
import { JobRepository } from '../interfaces/JobRepository';
import { WorkerRepository } from '../interfaces/WorkerRepository';
import { JobApplicationRepository } from '../interfaces/JobApplicationRepository';
import { EventBus } from '../../../shared/events/EventBus';
import { JobApplicationSubmittedEvent } from '../events/JobApplicationSubmitted.event';
import { ApplyForJobCommand } from '../commands/ApplyForJob.command';
import { JobApplicationDto } from '../dto/JobApplication.dto';

@Injectable()
export class ApplyForJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly workerRepository: WorkerRepository,
    private readonly applicationRepository: JobApplicationRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ApplyForJobCommand): Promise<JobApplicationDto> {
    // Validate entities exist
    const job = await this.jobRepository.findById(command.jobId);
    if (!job) {
      throw new JobNotFoundError(`Job ${command.jobId} not found`);
    }

    const worker = await this.workerRepository.findById(command.workerId);
    if (!worker) {
      throw new WorkerNotFoundError(`Worker ${command.workerId} not found`);
    }

    // Domain logic
    const application = job.apply(worker);
    
    // Persistence
    await this.applicationRepository.save(application);
    
    // Domain events
    await this.eventBus.publish(
      new JobApplicationSubmittedEvent({
        applicationId: application.id.value,
        jobId: job.id.value,
        workerId: worker.id.value,
        appliedAt: application.appliedAt
      })
    );

    return this.mapToDto(application);
  }

  private mapToDto(application: JobApplication): JobApplicationDto {
    return {
      id: application.id.value,
      jobId: application.jobId.value,
      workerId: application.workerId.value,
      status: application.status,
      appliedAt: application.appliedAt,
      message: application.message
    };
  }
}
```

### **Infrastructure Layer Implementation**
```typescript
// File: apps/backend/src/modules/blue-collar/infrastructure/controllers/Job.controller.ts

import { 
  Controller, 
  Post, 
  Param, 
  Body, 
  Get, 
  Query,
  UseGuards,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { TierAuthGuard } from '../../../auth/guards/tier-auth.guard';
import { UserTier } from '../../../auth/decorators/user-tier.decorator';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { ApplyForJobUseCase } from '../application/use-cases/ApplyForJob.usecase';
import { GetJobsUseCase } from '../application/use-cases/GetJobs.usecase';
import { ApplyForJobRequest } from './requests/ApplyForJob.request';
import { JobApplicationDto } from '../application/dto/JobApplication.dto';
import { JobDto } from '../application/dto/Job.dto';
import { UserDto } from '../../../auth/dto/User.dto';

@Controller('api/v1/blue-collar/jobs')
@ApiTags('Blue-collar Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TierAuthGuard)
export class JobController {
  constructor(
    private readonly applyForJobUseCase: ApplyForJobUseCase,
    private readonly getJobsUseCase: GetJobsUseCase
  ) {}

  @Get()
  @UserTier(['blue-collar', 'grey-collar', 'white-collar'])
  @ApiOperation({ summary: 'Get available jobs' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Jobs retrieved successfully',
    type: [JobDto] 
  })
  async getJobs(
    @Query('location') location?: string,
    @Query('wage_min') wageMin?: number,
    @Query('wage_max') wageMax?: number,
    @Query('skills') skills?: string[],
    @CurrentUser() user: UserDto
  ): Promise<JobDto[]> {
    return await this.getJobsUseCase.execute({
      location,
      wageMin,
      wageMax,
      skills,
      workerId: user.id
    });
  }

  @Post(':jobId/apply')
  @UserTier(['blue-collar'])
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Application submitted successfully',
    type: JobApplicationDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid application request' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Job not found' 
  })
  async applyForJob(
    @Param('jobId') jobId: string,
    @Body() request: ApplyForJobRequest,
    @CurrentUser() user: UserDto
  ): Promise<JobApplicationDto> {
    return await this.applyForJobUseCase.execute({
      jobId,
      workerId: user.id,
      message: request.message
    });
  }
}
```

## 🧪 **Comprehensive Testing Strategy**

### **Unit Testing Standards**
```typescript
// File: apps/backend/src/modules/blue-collar/domain/entities/__tests__/Job.entity.spec.ts

import { Job } from '../Job.entity';
import { Worker } from '../Worker.entity';
import { JobTestFactory } from '../../__tests__/factories/Job.factory';
import { WorkerTestFactory } from '../../__tests__/factories/Worker.factory';
import { JobStatus } from '../../enums/JobStatus';

describe('Job Entity', () => {
  let job: Job;
  let qualifiedWorker: Worker;
  let unqualifiedWorker: Worker;

  beforeEach(() => {
    job = JobTestFactory.create({
      status: JobStatus.ACTIVE,
      requirements: ['construction', 'basic-tools']
    });
    
    qualifiedWorker = WorkerTestFactory.create({
      skills: ['construction', 'basic-tools', 'safety']
    });
    
    unqualifiedWorker = WorkerTestFactory.create({
      skills: ['cleaning']
    });
  });

  describe('canBeAppliedBy', () => {
    it('should return true when worker meets requirements', () => {
      expect(job.canBeAppliedBy(qualifiedWorker)).toBe(true);
    });

    it('should return false when worker lacks required skills', () => {
      expect(job.canBeAppliedBy(unqualifiedWorker)).toBe(false);
    });

    it('should return false when job is not active', () => {
      const closedJob = JobTestFactory.create({ status: JobStatus.CLOSED });
      expect(closedJob.canBeAppliedBy(qualifiedWorker)).toBe(false);
    });
  });

  describe('apply', () => {
    it('should create job application when worker is qualified', () => {
      const application = job.apply(qualifiedWorker);
      
      expect(application.jobId).toEqual(job.id);
      expect(application.workerId).toEqual(qualifiedWorker.id);
      expect(application.status).toBe('pending');
    });

    it('should throw error when worker is not qualified', () => {
      expect(() => job.apply(unqualifiedWorker))
        .toThrow('Worker cannot apply for job');
    });

    it('should throw error when job is not active', () => {
      job.close();
      expect(() => job.apply(qualifiedWorker))
        .toThrow('Worker cannot apply for job');
    });
  });

  describe('close', () => {
    it('should close active job', () => {
      job.close();
      expect(job.status).toBe(JobStatus.CLOSED);
    });

    it('should throw error when job is already closed', () => {
      job.close();
      expect(() => job.close())
        .toThrow('Cannot close job with status');
    });
  });
});
```

### **Integration Testing**
```typescript
// File: apps/backend/src/modules/blue-collar/__tests__/job-application.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { AuthTestHelper } from '../../../__tests__/helpers/auth.helper';
import { JobTestHelper } from '../__tests__/helpers/job.helper';

describe('Job Application Integration', () => {
  let app: INestApplication;
  let authHelper: AuthTestHelper;
  let jobHelper: JobTestHelper;
  let blueCollarToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authHelper = new AuthTestHelper(app);
    jobHelper = new JobTestHelper(app);
    
    blueCollarToken = await authHelper.getBlueCollarToken();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/blue-collar/jobs/:jobId/apply', () => {
    it('should successfully apply for job', async () => {
      const job = await jobHelper.createActiveJob();

      const response = await request(app.getHttpServer())
        .post(`/api/v1/blue-collar/jobs/${job.id}/apply`)
        .set('Authorization', `Bearer ${blueCollarToken}`)
        .send({
          message: 'I am interested in this position'
        })
        .expect(201);

      expect(response.body).toMatchObject({
        jobId: job.id,
        status: 'pending',
        message: 'I am interested in this position'
      });
    });

    it('should return 404 for non-existent job', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/blue-collar/jobs/non-existent-id/apply')
        .set('Authorization', `Bearer ${blueCollarToken}`)
        .send({ message: 'Test' })
        .expect(404);
    });

    it('should return 400 for duplicate application', async () => {
      const job = await jobHelper.createActiveJob();
      
      // First application
      await request(app.getHttpServer())
        .post(`/api/v1/blue-collar/jobs/${job.id}/apply`)
        .set('Authorization', `Bearer ${blueCollarToken}`)
        .send({ message: 'First application' })
        .expect(201);

      // Duplicate application
      await request(app.getHttpServer())
        .post(`/api/v1/blue-collar/jobs/${job.id}/apply`)
        .set('Authorization', `Bearer ${blueCollarToken}`)
        .send({ message: 'Duplicate application' })
        .expect(400);
    });
  });
});
```

### **End-to-End Testing**
```typescript
// File: apps/mobile-blue/__tests__/job-application.e2e.test.ts

import { by, device, element, expect } from 'detox';

describe('Job Application Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('login-button')).tap();
    // Login flow...
  });

  it('should complete job application flow successfully', async () => {
    // Navigate to job list
    await element(by.id('jobs-tab')).tap();
    await expect(element(by.id('job-list'))).toBeVisible();

    // Select first job
    await element(by.id('job-card-0')).tap();
    await expect(element(by.id('job-details'))).toBeVisible();

    // Apply for job
    await element(by.id('apply-button')).tap();
    await expect(element(by.text('Application Submitted'))).toBeVisible();

    // Verify in applications list
    await element(by.id('profile-tab')).tap();
    await element(by.id('my-applications')).tap();
    await expect(element(by.id('application-item-0'))).toBeVisible();
  });

  it('should handle voice application flow', async () => {
    await element(by.id('jobs-tab')).tap();
    await element(by.id('job-card-0')).tap();
    
    // Start voice command
    await element(by.id('voice-command-button')).tap();
    await expect(element(by.text('Say "Apply" to apply'))).toBeVisible();
    
    // Simulate voice input (in real test, would use device capability)
    await device.sendUserNotification({
      trigger: { type: 'voice', command: 'apply' }
    });
    
    await expect(element(by.text('Application Submitted'))).toBeVisible();
  });
});
```

## 📊 **Code Quality Standards**

### **ESLint Configuration**
```json
// .eslintrc.js
module.exports = {
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'max-lines': ['error', { max: 300 }],
    'max-lines-per-function': ['error', { max: 50 }],
    'complexity': ['error', { max: 10 }],
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': 'warn'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off'
      }
    }
  ]
};
```

### **Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests"
    ]
  }
}
```

---

**These implementation guidelines ensure every feature is built with state-of-the-art practices, comprehensive testing, and maintainable code that scales with our three-tier workforce ecosystem.**

*Guidelines → Code → Excellence* 