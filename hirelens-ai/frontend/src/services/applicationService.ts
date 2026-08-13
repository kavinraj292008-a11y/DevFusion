import api from './api';
import { Application, ApplicationStage } from '../types/application';

// Maps MongoDB document fields → frontend Application shape
function mapApplication(doc: any): Application {
  return {
    id: doc._id,
    jobId: doc.job?._id ?? doc.job,
    jobTitle: doc.job?.title ?? '',
    candidateId: doc.candidate?._id ?? doc.candidate,
    candidateName: doc.candidate?.name ?? '',
    candidateEmail: doc.candidate?.email ?? '',
    matchScore: doc.aiScore ?? doc.matchScore ?? 0,
    stage: doc.status ?? 'Applied',
    appliedDate: doc.createdAt ? doc.createdAt.slice(0, 10) : '',
  };
}

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    const res = await api.get('/applications');
    const docs = res.data?.data ?? res.data ?? [];
    console.log('[applicationService] raw response:', res.data);
    console.log('[applicationService] mapped docs count:', docs.length);
    return docs.map(mapApplication);
  },

  async updateStage(id: string, stage: ApplicationStage): Promise<Application> {
    const res = await api.put(`/applications/${id}/status`, { status: stage.toLowerCase() });
    return mapApplication(res.data?.data ?? res.data);
  },
};
