import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export const CandidateProfile: React.FC = () => {
  const { user } = useAuth();
  const [switching, setSwitching] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const switchToRecruiter = async () => {
    setSwitching(true);
    setMsg('');
    setError('');
    try {
      await api.put('/auth/me/role', { role: 'recruiter' });
      setMsg('Role switched! Please log out and log back in to access the recruiter dashboard.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to switch role.');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Candidate Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your contact details, resume, and preferences.</p>
      </div>

      <Card className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Full Name</label>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200">{user?.name ?? '—'}</div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Email Address</label>
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200">{user?.email ?? '—'}</div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Current Role</label>
          <div className="bg-slate-700/40 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 capitalize">{user?.role ?? 'candidate'}</div>
        </div>
      </Card>

      <Card className="space-y-3 border border-amber-500/20 bg-amber-500/5">
        <p className="text-sm font-semibold text-amber-400">Switch Account Role</p>
        <p className="text-xs text-slate-400">If you registered as a Candidate but you're actually a Recruiter, you can switch your role here.</p>

        {error && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-400">{error}</div>}
        {msg   && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-400">{msg}</div>}

        <Button onClick={switchToRecruiter} disabled={switching}>
          {switching ? 'Switching…' : '🏢 Switch to Recruiter'}
        </Button>
      </Card>
    </div>
  );
};
