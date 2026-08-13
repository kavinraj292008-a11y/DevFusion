import { Job } from '../types/job';
import { Candidate } from '../types/candidate';
import { Application } from '../types/application';

export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 24,
    description: 'Looking for a React/TypeScript expert to drive AI dashboard architecture.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', 'State Management'],
    createdAt: '2026-08-01',
  },
  {
    id: 'j2',
    title: 'AI/ML Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Active',
    applicantsCount: 12,
    description: 'Scale LLM-driven ATS candidate matching algorithms.',
    requirements: ['Product Strategy', 'LLMs', 'Agile', 'Data Analytics'],
    createdAt: '2026-08-05',
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Frontend Developer',
    experienceYears: 5,
    skills: ['React', 'TypeScript', 'Tailwind', 'Zustand', 'Next.js'],
    matchScore: 92,
    summary: 'Strong experience with modern frontend tech stacks and building complex web applications.',
  },
  {
    id: 'c2',
    name: 'Jordan Lee',
    email: 'jordan.l@example.com',
    role: 'Full Stack Engineer',
    experienceYears: 3,
    skills: ['Vue', 'Node.js', 'PostgreSQL', 'TypeScript'],
    matchScore: 74,
    summary: 'Versatile web developer with strong backend fundamentals.',
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
  {
    id: 'app2',
    jobId: 'j1',
    jobTitle: 'Senior Frontend Engineer',
    candidateId: 'c2',
    candidateName: 'Jordan Lee',
    candidateEmail: 'jordan.l@example.com',
    matchScore: 74,
    stage: 'Screened',
    appliedDate: '2026-08-03',
  },
];