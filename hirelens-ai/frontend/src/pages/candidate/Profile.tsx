import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export const CandidateProfile: React.FC = () => {
  const { user } = useAuth();
  const [switching, setSwitching] = useState(false);
  const [msg, setMsg] = useState('');

  const switchToRecruiter = async () => {
    setSwitching(true);
    setMsg('');
    try {
      const res = await api.put('/auth/me/role', { role: 'recruiter' });
      const { token, user: updatedUser } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser, isAuthenticated: true });
      setMsg('Role switched to Recruiter! Redirecting...');
      setTimeout(() => { window.location.href = '/recruiter/dashboard'; }, 1200);
    } catch (e: any) {
      setMsg(e?.response?.data?.message || 'Failed to switch role');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">My Candidate Profile</h1>
        <p className="text-xs text-slate-400">Manage your contact details, resume, and preferences.</p>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Current Role</label>
          <input
            type="text"
            value={user?.role || ''}
            readOnly
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>
      </Card>

      {/* Role switch card — for accounts that registered as wrong role */}
      <Card className="border border-amber-500/20 bg-amber-500/5">
        <h3 className="text-sm font-semibold text-amber-400 mb-1">Switch Account Role</h3>
        <p className="text-xs text-slate-400 mb-3">
          If you registered as a Candidate but you're actually a Recruiter, you can switch your role here.
        </p>
        {msg && (
          <div className={`mb-3 p-2 rounded text-xs ${msg.includes('switched') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            {msg}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={switchToRecruiter}
          disabled={switching}
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          {switching ? 'Switching...' : '🏢 Switch to Recruiter'}
        </Button>
      </Card>
    </div>
  );
};

export default CandidateProfile;
