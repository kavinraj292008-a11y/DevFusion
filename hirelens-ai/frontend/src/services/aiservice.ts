import { delay } from './api';

export const aiService = {
  async analyzeCandidate(candidateId: string, jobId: string) {
    await delay(600);
    return {
      score: 92,
      strengths: [
        'Expert TypeScript and React knowledge aligned with stack requirements.',
        '5 years relevant experience building scalable user interfaces.',
      ],
      gaps: [
        'Limited backend Node.js evidence in provided resume.',
      ],
    };
  },
};