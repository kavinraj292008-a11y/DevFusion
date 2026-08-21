import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Loader2, Users } from 'lucide-react';

interface CandidateRow {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: string;
  skills: string[];
}

export const RecruiterCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Candidates are visible through applications — no separate /candidates route
    api.get('/applications')
      .then(res => {
        const raw = res.data;
        const docs = Array.isArray(raw) ? raw
                   : Array.isArray(raw?.data) ? raw.data : [];
        const rows: CandidateRow[] = docs.map((a: any) => ({
          id:       a._id,
          name:     a.candidate?.name ?? 'Unknown',
          email:    a.candidate?.email ?? '',
          jobTitle: a.job?.title ?? '',
          status:   a.status ?? 'applied',
          skills:   a.candidate?.skills ?? [],
        }));
        setCandidates(rows);
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load candidates.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="text-xs text-slate-400 mt-1">Candidates who applied to your jobs.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
          <Loader2 size={16} className="animate-spin"/>Loading candidates…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      {!loading && !error && candidates.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <Users size={40} className="opacity-40"/>
          <p className="text-sm">No candidates yet.</p>
          <p className="text-xs text-slate-600">They'll appear here once someone applies to your jobs.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map(c => (
          <Card key={c.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-100">{c.name}</p>
                <p className="text-xs text-slate-400">{c.email}</p>
                <p className="text-xs text-slate-500 mt-0.5">Applied for: {c.jobTitle}</p>
              </div>
              <span className="capitalize text-xs px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {c.status}
              </span>
            </div>
            {c.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {c.skills.slice(0, 5).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-slate-700/50 text-xs text-slate-300">{s}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
