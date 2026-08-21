// Candidates are fetched via /applications (populated with candidate data)
// There is no standalone GET /candidates route on the backend
// This file is kept for potential future use

import api from './api';

export const candidateService = {
  async getMyProfile() {
    const res = await api.get('/candidates/me');
    return res.data?.data ?? res.data;
  },

  async updateMyProfile(data: { skills?: string[]; experienceYears?: number; bio?: string }) {
    const res = await api.put('/candidates/me', data);
    return res.data?.data ?? res.data;
  },
};
