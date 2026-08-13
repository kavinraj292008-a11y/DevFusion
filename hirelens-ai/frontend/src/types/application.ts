export type ApplicationStage = 'Applied' | 'Screened' | 'Interview' | 'Offered' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  matchScore: number;
  stage: ApplicationStage;
  appliedDate: string;
}