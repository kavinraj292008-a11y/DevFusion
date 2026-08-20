import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { jobService } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const CreateJob: React.FC = () => {
  const [form, setForm] = useState({
    title: '', department: '', location: 'Remote',
    type: 'Full-time' as const, description: '', requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await jobService.createJob({
        title:        form.title,
        department:   form.department,
        location:     form.location,
        type:         form.type,
        status:       'Active',
        description:  form.description,
        requirements: form.requirements.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/recruiter/jobs');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create job.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Create New Job Listing</h1>
        <p className="text-xs text-slate-400 mt-1">Fill in the details and publish to the job board.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      <div className="space-y-4 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <Input label="Job Title *" value={form.title} onChange={e => set('title', e.target.value)} required />
        <Input label="Department *" value={form.department} onChange={e => set('department', e.target.value)} required />
        <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} />

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Employment Type</label>
          <select
            value={form.type}
            onChange={e => set('type', e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Job Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Describe the role, responsibilities, and expectations…"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Requirements (comma-separated)</label>
          <Input
            value={form.requirements}
            onChange={e => set('requirements', e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <button
          onClick={handleSubmit as any}
          disabled={loading || !form.title || !form.department}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {loading ? <><Loader2 size={14} className="animate-spin"/>Publishing…</> : 'Publish Job'}
        </button>
      </div>
    </div>
  );
};
