import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum BackgroundCheckStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REQUIRES_MANUAL_REVIEW = 'requires_manual_review'
}

export enum BackgroundCheckType {
  ADDRESS_VERIFICATION = 'address_verification',
  IDENTITY_VERIFICATION = 'identity_verification',
  CRIMINAL_RECORD_CHECK = 'criminal_record_check',
  EMPLOYMENT_HISTORY = 'employment_history',
  REFERENCE_CHECK = 'reference_check'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('background_checks')
@Index(['userId'])
@Index(['status'])
@Index(['checkType'])
@Index(['riskLevel'])
export class BackgroundCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userLocationId: string;

  @Column({
    type: 'enum',
    enum: BackgroundCheckType,
    default: BackgroundCheckType.ADDRESS_VERIFICATION
  })
  checkType: BackgroundCheckType;

  @Column({
    type: 'enum',
    enum: BackgroundCheckStatus,
    default: BackgroundCheckStatus.PENDING
  })
  status: BackgroundCheckStatus;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true
  })
  riskLevel: RiskLevel;

  @Column({ type: 'json', nullable: true })
  checkData: {
    addressMatches?: boolean;
    identityConfirmed?: boolean;
    criminalRecordFound?: boolean;
    employmentVerified?: boolean;
    referencesVerified?: boolean;
    additionalNotes?: string;
  };

  @Column({ type: 'json', nullable: true })
  verificationSources: {
    governmentDatabase?: boolean;
    localAuthorities?: boolean;
    employerVerification?: boolean;
    referenceContacts?: boolean;
    thirdPartyServices?: string[];
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 