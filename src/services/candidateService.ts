import { delay } from './api';
import { mockCandidates } from '../mocks/data';
import { Candidate } from '../types/candidate';

export const candidateService = {
  async getCandidates(): Promise<Candidate[]> {
    await delay(300);
    return mockCandidates;
  },
  async getCandidateById(id: string): Promise<Candidate | undefined> {
    await delay(200);
    return mockCandidates.find((c) => c.id === id);
  },
};