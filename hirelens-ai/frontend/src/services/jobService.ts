import api from './api';
import { Job } from '../types/job';

function mapJob(d: any): Job {
  return {
    id:              d._id ?? d.id,
    title:           d.title ?? '',
    department:      d.department ?? '',
    location:        d.location ?? '',
    type:            d.employmentType ?? d.type ?? 'Full-time',
    status:          d.status === 'published' ? 'Active' : d.status === 'draft' ? 'Draft' : d.status ?? 'Active',
    applicantsCount: d.applicantsCount ?? 0,
    description:     d.description ?? '',
    requirements:    d.skills ?? d.requirements ?? [],
    createdAt:       d.createdAt ? d.createdAt.slice(0, 10) : '',
  };
}

function unwrapJobs(res: any): any[] {
  const raw = res?.data;
  // Backend returns { success, data: { jobs: [...], total, page } }
  if (Array.isArray(raw?.data?.jobs)) return raw.data.jobs;
  if (Array.isArray(raw?.data))       return raw.data;
  if (Array.isArray(raw?.jobs))       return raw.jobs;
  if (Array.isArray(raw))             return raw;
  return [];
}

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const res = await api.get('/jobs');
    return unwrapJobs(res).map(mapJob);
  },

  async createJob(job: Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>): Promise<Job> {
    const res = await api.post('/jobs', {
      title:          job.title,
      department:     job.department,
      location:       job.location,
      employmentType: job.type,
      status:         'published',           // always publish directly
      description:    job.description || job.title,
      skills:         job.requirements,
    });
    const d = res.data?.data ?? res.data;
    return mapJob(d);
  },
};
