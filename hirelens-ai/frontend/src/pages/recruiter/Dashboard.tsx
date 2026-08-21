import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Briefcase, Users, Calendar, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api';

function unwrap(res: any): any[] {
  const raw = res?.data;
  if (Array.isArray(raw?.data?.jobs))          return raw.data.jobs;
  if (Array.isArray(raw?.data?.applications))  return raw.data.applications;
  if (Array.isArray(raw?.data))                return raw.data;
  if (Array.isArray(raw?.jobs))                return raw.jobs;
  if (Array.isArray(raw?.applications))        return raw.applications;
  if (Array.isArray(raw))                      return raw;
  return [];
}

export const RecruiterDashboard: React.FC = () => {
  const [stats, setStats] = useState({ activeJobs: 0, totalCandidates: 0, interviewsToday: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/jobs'),
      api.get('/applications'),
      api.get('/interviews/my'),
    ]).then(([jobsRes, appsRes, intRes]) => {
      const jobs  = jobsRes.status  === 'fulfilled' ? unwrap(jobsRes.value)  : [];
      const apps  = appsRes.status  === 'fulfilled' ? unwrap(appsRes.value)  : [];
      const ints  = intRes.status   === 'fulfilled' ? unwrap(intRes.value)   : [];

      const today = new Date().toISOString().slice(0, 10);
      const activeJobs     = jobs.filter((j: any) => j.status === 'published' || j.status === 'Active').length;
      const interviewsToday = ints.filter((i: any) => (i.scheduledAt ?? '').slice(0, 10) === today).length;

      const scored = apps.filter((a: any) => a.aiScore > 0);
      const avgScore = scored.length
        ? Math.round(scored.reduce((s: number, a: any) => s + a.aiScore, 0) / scored.length)
        : 0;

      setStats({ activeJobs, totalCandidates: apps.length, interviewsToday, avgScore });
    }).finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: 'Active Jobs',        value: stats.activeJobs,       icon: <Briefcase size={20}/>, color: 'indigo'  },
    { label: 'Total Applicants',   value: stats.totalCandidates,  icon: <Users size={20}/>,     color: 'emerald' },
    { label: 'Interviews Today',   value: stats.interviewsToday,  icon: <Calendar size={20}/>,  color: 'amber'   },
    { label: 'Avg AI Match Score', value: stats.avgScore ? `${stats.avgScore}%` : '—', icon: <Sparkles size={20}/>, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    indigo:  'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber:   'bg-amber-500/10 text-amber-400',
    purple:  'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiter Overview</h1>
        <p className="text-xs text-slate-400">Track candidate pipelines and AI match insights.</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={16} className="animate-spin"/>Loading stats…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map(t => (
            <Card key={t.label} className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${colorMap[t.color]}`}>{t.icon}</div>
              <div>
                <p className="text-xs text-slate-400">{t.label}</p>
                <p className="text-xl font-bold text-white">{t.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
