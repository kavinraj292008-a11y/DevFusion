import api from './api';
import { Job } from '../types/job';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const res = await api.get('/jobs');
    const docs = res.data?.data ?? res.data ?? [];
    return docs.map((d: any): Job => ({
      id:             d._id ?? d.id,
      title:          d.title ?? '',
      department:     d.department ?? '',
      location:       d.location ?? '',
      type:           d.employmentType ?? d.type ?? 'Full-time',
      status:         d.status === 'published' ? 'Active' : d.status === 'draft' ? 'Draft' : 'Closed',
      applicantsCount: d.applicantsCount ?? 0,
      description:    d.description ?? '',
      requirements:   d.requirements ?? [],
      createdAt:      d.createdAt ? d.createdAt.slice(0, 10) : '',
    }));
  },

  async createJob(job: Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>): Promise<Job> {
    const res = await api.post('/jobs', {
      title:          job.title,
      department:     job.department,
      location:       job.location,
      employmentType: job.type,
      status:         job.status === 'Active' ? 'published' : 'draft',
      description:    job.description,
      requirements:   job.requirements,
    });
    const d = res.data?.data ?? res.data;
    return {
      id:             d._id ?? d.id,
      title:          d.title,
      department:     d.department,
      location:       d.location,
      type:           d.employmentType ?? d.type ?? 'Full-time',
      status:         d.status === 'published' ? 'Active' : 'Draft',
      applicantsCount: 0,
      description:    d.description,
      requirements:   d.requirements ?? [],
      createdAt:      d.createdAt ? d.createdAt.slice(0, 10) : '',
    };
  },
};
