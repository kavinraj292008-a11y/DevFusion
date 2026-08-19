export interface Interview {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  scheduledAt: string;
  interviewer: string;
  type: 'Technical' | 'HR' | 'System Design';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}