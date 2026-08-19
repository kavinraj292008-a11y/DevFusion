import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
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
          <h2 className="text-2xl font-bold text-slate-100">Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">Access your recruitment dashboard</p>
        </div>

        {(localError || error) && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {localError || error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
};
