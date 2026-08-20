import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Loader2 } from 'lucide-react';

export const RecruiterAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/jobs'),
      api.get('/applications'),
    ]).then(([jobsRes, appsRes]) => {
      const jobs = jobsRes.status === 'fulfilled' ? (jobsRes.value.data?.data ?? []) : [];
      const apps = appsRes.status === 'fulfilled' ? (appsRes.value.data?.data ?? []) : [];

      const byStage = apps.reduce((acc: any, a: any) => {
        const s = a.status ?? 'applied';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});

      setData({
        totalJobs:        jobs.length,
        publishedJobs:    jobs.filter((j: any) => j.status === 'published').length,
        totalApps:        apps.length,
        byStage,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-400 py-8">
      <Loader2 size={16} className="animate-spin"/>Loading analytics…
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hiring Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Overview of your recruitment pipeline.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs',        value: data?.totalJobs ?? 0 },
          { label: 'Published Jobs',    value: data?.publishedJobs ?? 0 },
          { label: 'Total Applications',value: data?.totalApps ?? 0 },
        ].map(t => (
          <Card key={t.label} className="space-y-1">
            <p className="text-xs text-slate-400">{t.label}</p>
            <p className="text-2xl font-bold text-white">{t.value}</p>
          </Card>
        ))}
      </div>

      {data?.totalApps > 0 && (
        <Card className="space-y-3">
          <p className="text-sm font-semibold text-slate-300">Applications by Stage</p>
          {Object.entries(data.byStage).map(([stage, count]: any) => (
            <div key={stage} className="flex justify-between items-center text-sm">
              <span className="capitalize text-slate-400">{stage}</span>
              <span className="font-bold text-white">{count}</span>
            </div>
          ))}
        </Card>
      )}

      {data?.totalApps === 0 && (
        <p className="text-sm text-slate-500">No application data yet. Post a job and wait for candidates to apply.</p>
      )}
    </div>
  );
};
