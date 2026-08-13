import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Job } from '../../types/job';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PlusCircle } from 'lucide-react';

const statusVariant: Record<string, 'emerald' | 'indigo' | 'rose'> = {
  published: 'emerald',
  draft: 'indigo',
  closed: 'rose',
};

export const RecruiterJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    jobService
      .getJobs()
      .then((data) => setJobs(data.jobs))
      .catch((err) =>
        setError(err?.response?.data?.message || 'Failed to load jobs')
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Job Openings</h1>
        <Link
          to="/recruiter/jobs/create"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
        >
          <PlusCircle size={14} />
          New Job
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-slate-400">Loading jobs…</p>
      )}

      {error && (
        <p className="text-sm text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {!loading && jobs.length === 0 && !error && (
          <p className="text-sm text-slate-400">
            No jobs yet. Create your first job listing.
          </p>
        )}

        {jobs.map((job) => (
          <Card key={job._id} className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-100">{job.title}</h3>
              <p className="text-xs text-slate-400">
                {job.department}
                {job.department && job.location ? ' • ' : ''}
                {job.location}
              </p>
            </div>
            <Badge variant={statusVariant[job.status] ?? 'indigo'}>
              {job.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};
