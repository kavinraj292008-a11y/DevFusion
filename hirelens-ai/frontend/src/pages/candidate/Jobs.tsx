import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, FileX, MapPin, Briefcase } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  status: string;
}

export const CandidateJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get('/jobs')
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        setJobs(data.filter((j: Job) => j.status === 'published' || j.status === 'Active'));
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load jobs.'))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await api.post(`/applications/jobs/${jobId}/apply`);
      setApplied(prev => new Set([...prev, jobId]));
      setMsg(prev => ({ ...prev, [jobId]: 'Applied successfully!' }));
    } catch (err: any) {
      setMsg(prev => ({ ...prev, [jobId]: err?.response?.data?.message || 'Failed to apply.' }));
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Jobs</h1>
        <p className="text-xs text-slate-400 mt-1">Find and apply to open positions.</p>
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
          <p className="text-sm">No open jobs yet.</p>
          <p className="text-xs text-slate-600">Check back soon — new positions are posted regularly.</p>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map(job => (
          <Card key={job._id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-100">{job.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Briefcase size={11}/>{job.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={11}/>{job.location}</span>
                </div>
              </div>
              <Badge variant="indigo">{job.employmentType ?? 'Full-time'}</Badge>
            </div>

            {job.description && (
              <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>
            )}

            {job.requirements?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.requirements.slice(0, 5).map(r => (
                  <span key={r} className="px-2 py-0.5 rounded-md bg-slate-700/50 text-xs text-slate-300">{r}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {msg[job._id] && (
                <span className={`text-xs ${applied.has(job._id) ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {msg[job._id]}
                </span>
              )}
              <button
                onClick={() => handleApply(job._id)}
                disabled={!!applying || applied.has(job._id)}
                className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
              >
                {applying === job._id ? <><Loader2 size={11} className="animate-spin"/>Applying…</> : applied.has(job._id) ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
