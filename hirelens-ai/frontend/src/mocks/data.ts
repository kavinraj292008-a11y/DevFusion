import { Application } from '../types/application';

export const mockJobs = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    employmentType: 'full-time',
    status: 'published',
    applicantsCount: 24,
    description: 'Looking for a React/TypeScript expert.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS'],
    createdAt: '2026-08-01',
  },
];

export const mockCandidates = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    experienceYears: 5,
    skills: ['React', 'TypeScript'],
    matchScore: 92,
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app1',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    candidateId: 'c1',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@example.com',
    matchScore: 92,
    stage: 'Interview',
    appliedDate: '2026-08-02',
  },
];
