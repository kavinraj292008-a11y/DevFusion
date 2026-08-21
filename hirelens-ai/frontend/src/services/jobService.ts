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

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const res = await api.get('/jobs');
    const raw = res.data;
    // Handle { success, data: [...] } OR plain array
    const docs = Array.isArray(raw) ? raw
                : Array.isArray(raw?.data) ? raw.data
                : Array.isArray(raw?.jobs) ? raw.jobs
                : [];
    return docs.map(mapJob);
  },

  async createJob(job: Omit<Job, 'id' | 'applicantsCount' | 'createdAt'>): Promise<Job> {
    const res = await api.post('/jobs', {
      title:           job.title,
      department:      job.department,
      location:        job.location,
      employmentType:  job.type,
      status:          job.status === 'Active' ? 'published' : 'draft',
      description:     job.description || job.title, // fallback so backend doesn't reject
      skills:          job.requirements,
    });
    const d = res.data?.data ?? res.data;
    return mapJob(d);
  },
};
