import { CapturedPhoto } from '../components/verification/WorkerVerificationCamera';
import { IDDocumentPhoto } from '../components/verification/IDDocumentCamera';
import { VerificationFormData } from '../components/verification/VerificationForm';

export interface VerificationRecord {
  id: string;
  workerName: string;
  photos: CapturedPhoto[];
  documents: IDDocumentPhoto[];
  formData: VerificationFormData;
  status: 'pending' | 'uploading' | 'uploaded' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  jobId?: string;
  contractorId: string;
  uploadProgress?: number;
  rejectionReason?: string;
  approvedBy?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface UploadProgress {
  total: number;
  uploaded: number;
  current: string;
  percentage: number;
}

export interface VerificationUploadRequest {
  workerName: string;
  photos: CapturedPhoto[];
  documents: IDDocumentPhoto[];
  formData: VerificationFormData;
  jobId?: string;
  contractorId: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

class VerificationService {
  private static instance: VerificationService;
  private verificationRecords: VerificationRecord[] = [];
  private readonly baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  /**
   * Submit a new verification record
   */
  async submitVerification(
    request: VerificationUploadRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<VerificationRecord> {
    try {
      const verificationId = this.generateVerificationId();
      
      // Create verification record
      const record: VerificationRecord = {
        id: verificationId,
        workerName: request.workerName,
        photos: request.photos,
        documents: request.documents,
        formData: request.formData,
        status: 'uploading',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        jobId: request.jobId,
        contractorId: request.contractorId,
        location: request.location,
        uploadProgress: 0,
      };

      // Store locally first
      this.verificationRecords.push(record);

      // Simulate upload process with progress
      const totalFiles = request.photos.length + request.documents.length;
      let uploadedFiles = 0;

      // Upload photos
      for (const photo of request.photos) {
        onProgress?.({
          total: totalFiles,
          uploaded: uploadedFiles,
          current: `Uploading photo ${photo.angle}`,
          percentage: Math.round((uploadedFiles / totalFiles) * 100),
        });

        await this.uploadFile(photo.uri, `verification/${verificationId}/photos/${photo.angle}.jpg`);
        uploadedFiles++;
      }

      // Upload documents
      for (const document of request.documents) {
        onProgress?.({
          total: totalFiles,
          uploaded: uploadedFiles,
          current: `Uploading ID ${document.documentType}`,
          percentage: Math.round((uploadedFiles / totalFiles) * 100),
        });

        await this.uploadFile(document.uri, `verification/${verificationId}/documents/${document.documentType}.jpg`);
        uploadedFiles++;
      }

      // Upload form data
      onProgress?.({
        total: totalFiles,
        uploaded: uploadedFiles,
        current: 'Uploading verification details',
        percentage: 100,
      });

      await this.uploadVerificationData(verificationId, record);

      // Update status
      record.status = 'uploaded';
      record.updatedAt = new Date().toISOString();
      record.uploadProgress = 100;

      return record;
    } catch (error) {
      console.error('Verification upload failed:', error);
      throw new Error('Failed to upload verification. Please try again.');
    }
  }

  /**
   * Get verification record by ID
   */
  async getVerification(id: string): Promise<VerificationRecord | null> {
    const localRecord = this.verificationRecords.find(record => record.id === id);
    if (localRecord) {
      return localRecord;
    }

    try {
      const response = await fetch(`${this.baseUrl}/verifications/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch verification:', error);
    }

    return null;
  }

  /**
   * Get all verification records for a contractor
   */
  async getVerifications(contractorId: string): Promise<VerificationRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/verifications?contractorId=${contractorId}`);
      if (response.ok) {
        const serverRecords = await response.json();
        
        // Merge with local records
        const allRecords = [...this.verificationRecords, ...serverRecords];
        const uniqueRecords = allRecords.filter((record, index, self) => 
          index === self.findIndex(r => r.id === record.id)
        );
        
        return uniqueRecords.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    }

    // Return local records if server fails
    return this.verificationRecords
      .filter(record => record.contractorId === contractorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats(contractorId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisWeek: number;
  }> {
    const verifications = await this.getVerifications(contractorId);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: verifications.length,
      pending: verifications.filter(v => ['pending', 'uploading', 'uploaded'].includes(v.status)).length,
      approved: verifications.filter(v => v.status === 'approved').length,
      rejected: verifications.filter(v => v.status === 'rejected').length,
      thisWeek: verifications.filter(v => new Date(v.createdAt) > weekAgo).length,
    };
  }

  /**
   * Retry failed verification upload
   */
  async retryVerification(id: string): Promise<VerificationRecord> {
    const record = await this.getVerification(id);
    if (!record) {
      throw new Error('Verification record not found');
    }

    if (record.status !== 'pending') {
      throw new Error('Only pending verifications can be retried');
    }

    // Retry upload
    return this.submitVerification({
      workerName: record.workerName,
      photos: record.photos,
      documents: record.documents,
      formData: record.formData,
      jobId: record.jobId,
      contractorId: record.contractorId,
      location: record.location,
    });
  }

  /**
   * Delete verification record
   */
  async deleteVerification(id: string): Promise<boolean> {
    try {
      // Remove from local storage
      this.verificationRecords = this.verificationRecords.filter(record => record.id !== id);

      // Try to delete from server
      const response = await fetch(`${this.baseUrl}/verifications/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete verification:', error);
      return false;
    }
  }

  /**
   * Check verification status updates
   */
  async checkStatusUpdates(contractorId: string): Promise<VerificationRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/verifications/updates?contractorId=${contractorId}`);
      if (response.ok) {
        const updates = await response.json();
        
        // Update local records with server status
        updates.forEach((update: VerificationRecord) => {
          const localIndex = this.verificationRecords.findIndex(record => record.id === update.id);
          if (localIndex >= 0) {
            this.verificationRecords[localIndex] = { ...this.verificationRecords[localIndex], ...update };
          }
        });

        return updates;
      }
    } catch (error) {
      console.error('Failed to check status updates:', error);
    }

    return [];
  }

  /**
   * Clear local verification cache
   */
  clearCache(): void {
    this.verificationRecords = [];
  }

  // Private methods

  private generateVerificationId(): string {
    return `vrfy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async uploadFile(fileUri: string, remotePath: string): Promise<void> {
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: remotePath.split('/').pop() || 'upload.jpg',
      } as any);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      // For demo purposes, we'll continue even if upload fails
      console.warn('File upload simulation:', remotePath);
    }
  }

  private async uploadVerificationData(id: string, record: VerificationRecord): Promise<void> {
    // Simulate data upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const response = await fetch(`${this.baseUrl}/verifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: record.id,
          workerName: record.workerName,
          formData: record.formData,
          jobId: record.jobId,
          contractorId: record.contractorId,
          location: record.location,
          createdAt: record.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Data upload failed: ${response.statusText}`);
      }
    } catch (error) {
      // For demo purposes, we'll continue even if upload fails
      console.warn('Verification data upload simulation for:', id);
    }
  }
}

export default VerificationService.getInstance(); 