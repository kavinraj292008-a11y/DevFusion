import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { Job } from '../../types/job';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecruiterJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    jobService.getJobs()
      .then(setJobs)
      .catch(err => setError(err?.response?.data?.message || 'Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Openings</h1>
          <p className="text-xs text-slate-400 mt-1">All jobs you've posted.</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/create-job')}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          + Create Job
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
          <Loader2 size={16} className="animate-spin"/>Loading jobs…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <FileX size={40} className="opacity-40"/>
          <p className="text-sm">No jobs posted yet.</p>
          <button
            onClick={() => navigate('/recruiter/create-job')}
            className="text-xs text-indigo-400 hover:underline"
          >
            Create your first job →
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {jobs.map(job => (
          <Card key={job.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-100">{job.title}</h3>
              <p className="text-xs text-slate-400">{job.department} • {job.location} • {job.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={job.status === 'Active' ? 'emerald' : 'slate'}>{job.status}</Badge>
              <Badge variant="indigo">{job.applicantsCount} Applicants</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
