import { delay } from './api';
import { Interview } from '../types/interview';

export const interviewService = {
  async getInterviews(): Promise<Interview[]> {
    await delay(300);
    return [
      {
        id: 'int-1',
        applicationId: 'app1',
        candidateName: 'Alex Rivera',
        jobTitle: 'Senior Frontend Engineer',
        scheduledAt: '2026-08-15 14:00',
        interviewer: 'David Chen',
        type: 'Technical',
        status: 'Scheduled',
      },
    ];
  },
};