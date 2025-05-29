export declare enum BackgroundCheckStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    REQUIRES_MANUAL_REVIEW = "requires_manual_review"
}
export declare enum BackgroundCheckType {
    ADDRESS_VERIFICATION = "address_verification",
    IDENTITY_VERIFICATION = "identity_verification",
    CRIMINAL_RECORD_CHECK = "criminal_record_check",
    EMPLOYMENT_HISTORY = "employment_history",
    REFERENCE_CHECK = "reference_check"
}
export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class BackgroundCheck {
    id: string;
    userId: string;
    userLocationId: string;
    checkType: BackgroundCheckType;
    status: BackgroundCheckStatus;
    riskLevel: RiskLevel;
    checkData: {
        addressMatches?: boolean;
        identityConfirmed?: boolean;
        criminalRecordFound?: boolean;
        employmentVerified?: boolean;
        referencesVerified?: boolean;
        additionalNotes?: string;
    };
    verificationSources: {
        governmentDatabase?: boolean;
        localAuthorities?: boolean;
        employerVerification?: boolean;
        referenceContacts?: boolean;
        thirdPartyServices?: string[];
    };
    notes: string;
    verifiedBy: string;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
