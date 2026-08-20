import api from './api';
import { Candidate } from '../types/candidate';

export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    const res = await api.get('/candidates');
    const docs = res.data?.data ?? res.data ?? [];
    return docs.map((d: any): Candidate => ({
      id:              d._id ?? d.id,
      name:            d.name ?? d.user?.name ?? '',
      email:           d.email ?? d.user?.email ?? '',
      role:            d.currentRole ?? d.role ?? 'Candidate',
      experienceYears: d.experienceYears ?? 0,
      skills:          d.skills ?? [],
      matchScore:      d.aiScore ?? d.matchScore ?? 0,
      summary:         d.bio ?? d.summary ?? '',
      resumeUrl:       d.resumeUrl,
    }));
  },

  async getCandidateById(id: string): Promise<Candidate | undefined> {
    const res = await api.get(`/candidates/${id}`);
    const d = res.data?.data ?? res.data;
    if (!d) return undefined;
    return {
      id:              d._id ?? d.id,
      name:            d.name ?? d.user?.name ?? '',
      email:           d.email ?? d.user?.email ?? '',
      role:            d.currentRole ?? d.role ?? 'Candidate',
      experienceYears: d.experienceYears ?? 0,
      skills:          d.skills ?? [],
      matchScore:      d.aiScore ?? d.matchScore ?? 0,
      summary:         d.bio ?? d.summary ?? '',
      resumeUrl:       d.resumeUrl,
    };
  },
};
