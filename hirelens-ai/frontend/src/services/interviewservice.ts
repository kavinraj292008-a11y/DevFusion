import api from './api';
import { Interview } from '../types/interview';

export const interviewService = {
  async getInterviews(): Promise<Interview[]> {
    const res = await api.get('/interviews/my');
    const docs = res.data?.data ?? res.data ?? [];
    return docs.map((d: any): Interview => ({
      id:            d._id ?? d.id,
      applicationId: d.application?._id ?? d.application ?? '',
      candidateName: d.application?.candidate?.name ?? d.candidateName ?? '',
      jobTitle:      d.application?.job?.title ?? d.jobTitle ?? '',
      scheduledAt:   d.scheduledAt ?? '',
      interviewer:   d.interviewer ?? '',
      type:          d.mode === 'video' ? 'Technical' : d.type ?? 'HR',
      status:        d.status ?? 'Scheduled',
    }));
  },
};
