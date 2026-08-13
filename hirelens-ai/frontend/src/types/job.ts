export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'Active' | 'Draft' | 'Closed';
  applicantsCount: number;
  description: string;
  requirements: string[];
  createdAt: string;
}