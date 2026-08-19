import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { Job } from '../../types/job';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const RecruiterJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobService.getJobs().then(setJobs);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Job Openings</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-100">{job.title}</h3>
              <p className="text-xs text-slate-400">{job.department} • {job.location}</p>
            </div>
            <Badge variant="indigo">{job.applicantsCount} Applicants</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};