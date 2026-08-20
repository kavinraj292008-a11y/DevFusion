import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Briefcase, Users, Calendar, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface Stats {
  activeJobs: number;
  totalCandidates: number;
  interviewsToday: number;
  avgMatchScore: number;
}

export const RecruiterDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, candidatesRes, interviewsRes] = await Promise.allSettled([
          api.get('/jobs'),
          api.get('/candidates'),
          api.get('/interviews/my'),
        ]);

        const jobs = jobsRes.status === 'fulfilled'
          ? (jobsRes.value.data?.data ?? jobsRes.value.data ?? []) : [];
        const candidates = candidatesRes.status === 'fulfilled'
          ? (candidatesRes.value.data?.data ?? candidatesRes.value.data ?? []) : [];
        const interviews = interviewsRes.status === 'fulfilled'
          ? (interviewsRes.value.data?.data ?? interviewsRes.value.data ?? []) : [];

        const today = new Date().toISOString().slice(0, 10);
        const todayInterviews = interviews.filter((i: any) =>
          i.scheduledAt?.slice(0, 10) === today
        );

        const activeJobs = jobs.filter((j: any) =>
          j.status === 'published' || j.status === 'Active'
        ).length;

        setStats({
          activeJobs,
          totalCandidates: candidates.length,
          interviewsToday: todayInterviews.length,
          avgMatchScore: 0,
        });
      } catch {
        setStats({ activeJobs: 0, totalCandidates: 0, interviewsToday: 0, avgMatchScore: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tiles = [
    { label: 'Active Jobs',       value: stats?.activeJobs ?? 0,        icon: <Briefcase size={20}/>, color: 'indigo' },
    { label: 'Total Candidates',  value: stats?.totalCandidates ?? 0,   icon: <Users size={20}/>,     color: 'emerald' },
    { label: 'Interviews Today',  value: stats?.interviewsToday ?? 0,   icon: <Calendar size={20}/>,  color: 'amber' },
    { label: 'Avg AI Match Score',value: stats?.avgMatchScore ? `${stats.avgMatchScore}%` : '—', icon: <Sparkles size={20}/>, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiter Overview</h1>
        <p className="text-xs text-slate-400">Track candidate pipelines and AI match insights.</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400"><Loader2 size={16} className="animate-spin"/>Loading stats…</div>
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
