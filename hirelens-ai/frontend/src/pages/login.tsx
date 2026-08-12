import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types/user';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('recruiter@hirelens.ai');
  const [role, setRole] = useState<UserRole>('recruiter');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, role);
    navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md glass-panel p-8 rounded-2xl space-y-5 border border-slate-800">
        <h2 className="text-2xl font-bold text-center text-slate-100">Welcome to HireLens AI</h2>
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Select Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2 text-xs font-semibold rounded-lg border ${role === 'recruiter' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2 text-xs font-semibold rounded-lg border ${role === 'candidate' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              Candidate
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
};