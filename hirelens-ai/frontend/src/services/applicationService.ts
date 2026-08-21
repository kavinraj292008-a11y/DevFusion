import api from './api';
import { Application, ApplicationStage } from '../types/application';

function mapApplication(doc: any): Application {
  return {
    id:             doc._id ?? doc.id,
    jobId:          doc.job?._id ?? doc.job ?? '',
    jobTitle:       doc.job?.title ?? doc.jobTitle ?? '',
    candidateId:    doc.candidate?._id ?? doc.candidate ?? '',
    candidateName:  doc.candidate?.name ?? doc.candidateName ?? '',
    candidateEmail: doc.candidate?.email ?? doc.candidateEmail ?? '',
    matchScore:     doc.aiScore ?? doc.matchScore ?? 0,
    stage:          doc.status ?? 'Applied',
    appliedDate:    doc.createdAt ? doc.createdAt.slice(0, 10) : '',
  };
}

function unwrap(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.applications)) return data.applications;
  return [];
}

export const applicationService = {
  // For RECRUITERS — GET /applications (all applications across their jobs)
  async getApplications(): Promise<Application[]> {
    const res = await api.get('/applications');
    return unwrap(res.data).map(mapApplication);
  },

  // For CANDIDATES — GET /applications/my (their own applications)
  async getMyApplications(): Promise<Application[]> {
    const res = await api.get('/applications/my');
    return unwrap(res.data).map(mapApplication);
  },

  async updateStage(id: string, stage: ApplicationStage): Promise<Application> {
    const res = await api.put(`/applications/${id}/status`, { status: stage.toLowerCase() });
    return mapApplication(res.data?.data ?? res.data);
  },
};
