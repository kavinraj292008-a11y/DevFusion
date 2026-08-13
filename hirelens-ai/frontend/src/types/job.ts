export interface Job {
  _id: string;
  title: string;
  description: string;
  department?: string;
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  openings?: number;
  status: 'draft' | 'published' | 'closed';
  createdBy?: { _id: string; name: string; email: string };
  applicationDeadline?: string;
  createdAt?: string;
}
