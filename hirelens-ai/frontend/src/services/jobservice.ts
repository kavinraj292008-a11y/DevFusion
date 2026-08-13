import api from './api';
import { Job } from '../types/job';

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobService = {
  async getJobs(params?: Record<string, string>): Promise<JobsResponse> {
    const response = await api.get('/jobs', { params });
    return response.data.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data;
  },

  async createJob(
    job: Partial<Omit<Job, '_id' | 'createdBy' | 'createdAt'>>
  ): Promise<Job> {
    const response = await api.post('/jobs', job);
    return response.data.data;
  },

  async updateJob(
    id: string,
    job: Partial<Omit<Job, '_id' | 'createdBy' | 'createdAt'>>
  ): Promise<Job> {
    const response = await api.put(`/jobs/${id}`, job);
    return response.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
