export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceYears: number;
  skills: string[];
  matchScore: number;
  summary: string;
  resumeUrl?: string;
}