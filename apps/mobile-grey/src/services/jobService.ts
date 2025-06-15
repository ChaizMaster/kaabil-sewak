import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Job {
  id: string;
  title: string;
  description: string;
  salary: string;
  openings: string;
  skills: string[];
  postedDate: string;
  contractorId: string;
}

const STORAGE_KEY = '@posted_jobs';

class JobService {
  private jobs: Job[] = [];
  private contractorId = 'contractor_123'; // Mock contractorId

  constructor() {
    this.loadJobs();
  }

  private async loadJobs() {
    try {
      const storedJobs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedJobs) {
        this.jobs = JSON.parse(storedJobs);
      }
    } catch (error) {
      console.error('Failed to load jobs from storage', error);
    }
  }

  private async saveJobs() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.jobs));
    } catch (error) {
      console.error('Failed to save jobs to storage', error);
    }
  }

  async getJobs(): Promise<Job[]> {
    await this.loadJobs();
    return this.jobs.filter(job => job.contractorId === this.contractorId);
  }

  async addJob(jobData: Omit<Job, 'id' | 'postedDate' | 'contractorId'>): Promise<Job> {
    const newJob: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postedDate: new Date().toISOString(),
      contractorId: this.contractorId,
      ...jobData,
      skills: jobData.skills.map(s => s.trim()).filter(s => s),
    };

    this.jobs.unshift(newJob); // Add to the beginning of the array
    await this.saveJobs();
    return newJob;
  }

  async deleteJob(jobId: string): Promise<void> {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter(job => job.id !== jobId);

    if (this.jobs.length < initialLength) {
      await this.saveJobs();
    } else {
      console.warn(`Job with id ${jobId} not found for deletion.`);
    }
  }
}

const jobService = new JobService();
export default jobService; 