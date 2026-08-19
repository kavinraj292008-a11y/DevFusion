import { delay } from './api';
import { mockJobs } from '../mocks/data';
import { Job } from '../types/job';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    await delay(300);
    return mockJobs;
  },
  async createJob(job: Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>): Promise<Job> {
    await delay(400);
    const newJob: Job = {
      ...job,
      id: `j${Date.now()}`,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockJobs.push(newJob);
    return newJob;
  },
};