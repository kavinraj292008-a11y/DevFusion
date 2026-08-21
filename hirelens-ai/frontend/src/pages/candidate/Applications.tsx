import React, { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types/application';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, FileX } from 'lucide-react';

export const CandidateApplications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    applicationService.getMyApplications()
      .then(setApps)
      .catch(err => setError(err?.response?.data?.message || 'Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const stageColor = (stage: string) => {
    const s = stage.toLowerCase();
    if (s === 'interview') return 'emerald';
    if (s === 'offered')   return 'amber';
    if (s === 'rejected')  return 'rose';
    return 'indigo';
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <p className="text-xs text-slate-400 mt-1">Track the status of your submitted job applications.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
          <Loader2 size={16} className="animate-spin"/>Loading applications…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      {!loading && !error && apps.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <FileX size={40} className="opacity-40"/>
          <p className="text-sm">No applications yet.</p>
          <p className="text-xs text-slate-600">Browse Jobs and apply to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {apps.map(a => (
          <Card key={a.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-100">{a.jobTitle}</p>
              <p className="text-xs text-slate-400">Applied: {a.appliedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              {a.matchScore > 0 && (
                <span className="text-xs text-indigo-400 font-medium">Match: {a.matchScore}%</span>
              )}
              <Badge variant={stageColor(a.stage) as any}>{a.stage}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateApplications;
