export type UserRole = 'recruiter' | 'candidate' | 'hiring_manager' | 'interviewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
