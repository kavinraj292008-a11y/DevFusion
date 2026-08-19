import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    try {
      const user = await register(name, email, password, role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md glass-panel p-8 rounded-2xl space-y-5 border border-slate-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-slate-950 text-sm">H</div>
            <span className="font-semibold text-base tracking-tight text-slate-100">Hire<span className="text-indigo-400">Lens</span> AI</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join HireLens AI</p>
        </div>

        {(localError || error) && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {localError || error}
          </div>
        )}

        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">I am joining as a...</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                role === 'candidate'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              🎯 Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole('recruiter')}
              className={`py-2.5 text-xs font-semibold rounded-lg border transition-all ${
                role === 'recruiter'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              🏢 Recruiter
            </button>
          </div>
        </div>

        <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : `Create ${role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account`}
        </Button>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};
