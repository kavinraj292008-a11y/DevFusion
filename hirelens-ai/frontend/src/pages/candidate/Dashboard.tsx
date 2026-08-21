import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { FileText, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

function unwrap(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: 0, interviews: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/applications/my'),
      api.get('/interviews/my'),
      api.get('/jobs'),
    ]).then(([appsRes, intsRes, jobsRes]) => {
      const apps = appsRes.status === 'fulfilled' ? unwrap(appsRes.value.data) : [];
      const ints = intsRes.status === 'fulfilled' ? unwrap(intsRes.value.data) : [];
      const jobs = jobsRes.status === 'fulfilled' ? unwrap(jobsRes.value.data) : [];
      setStats({
        applications: apps.length,
        interviews:   ints.filter((i: any) => i.status === 'Scheduled').length,
        jobs:         jobs.filter((j: any) => j.status === 'published' || j.status === 'Active').length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: 'My Applications',   value: stats.applications, icon: <FileText size={20}/>,  color: 'indigo'  },
    { label: 'Upcoming Interviews',value: stats.interviews,  icon: <Calendar size={20}/>,  color: 'emerald' },
    { label: 'Open Jobs',          value: stats.jobs,        icon: <Briefcase size={20}/>, color: 'amber'   },
  ];

  const colorMap: Record<string, string> = {
    indigo:  'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber:   'bg-amber-500/10 text-amber-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 
        </h1>
        <p className="text-xs text-slate-400 mt-1">Here's your job search overview.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={16} className="animate-spin"/>Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tiles.map(t => (
            <Card key={t.label} className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${colorMap[t.color]}`}>{t.icon}</div>
              <div>
                <p className="text-xs text-slate-400">{t.label}</p>
                <p className="text-2xl font-bold text-white">{t.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
