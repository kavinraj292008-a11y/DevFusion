import React, { useState, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Upload, Loader2, CheckCircle } from 'lucide-react';

export const CandidateProfile: React.FC = () => {
  const { user } = useAuth();
  const [switching, setSwitching]     = useState(false);
  const [switchMsg, setSwitchMsg]     = useState('');
  const [switchErr, setSwitchErr]     = useState('');
  const [uploading, setUploading]     = useState(false);
  const [uploadMsg, setUploadMsg]     = useState('');
  const [uploadErr, setUploadErr]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadErr('Only PDF files are accepted.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    setUploadErr('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/candidates/me/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('Resume uploaded successfully! You can now apply to jobs.');
    } catch (err: any) {
      setUploadErr(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const switchToRecruiter = async () => {
    setSwitching(true);
    setSwitchMsg('');
    setSwitchErr('');
    try {
      await api.put('/auth/me/role', { role: 'recruiter' });
      setSwitchMsg('Role switched! Please log out and log back in to access the recruiter dashboard.');
    } catch (err: any) {
      setSwitchErr(err?.response?.data?.message || 'Failed to switch role.');
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

      {/* Basic Info */}
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

      {/* Resume Upload */}
      <Card className="space-y-3">
        <p className="text-sm font-semibold text-slate-200">📄 Resume</p>
        <p className="text-xs text-slate-400">Upload your resume (PDF only) to apply for jobs.</p>

        {uploadErr && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-400">{uploadErr}</div>}
        {uploadMsg && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle size={13}/>{uploadMsg}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {uploading
            ? <><Loader2 size={14} className="animate-spin"/>Uploading…</>
            : <><Upload size={14}/>Upload Resume (PDF)</>
          }
        </button>
      </Card>

      {/* Switch Role */}
      <Card className="space-y-3 border border-amber-500/20 bg-amber-500/5">
        <p className="text-sm font-semibold text-amber-400">Switch Account Role</p>
        <p className="text-xs text-slate-400">If you registered as a Candidate but you're actually a Recruiter, you can switch your role here.</p>

        {switchErr && <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs text-rose-400">{switchErr}</div>}
        {switchMsg && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-400">{switchMsg}</div>}

        <button
          onClick={switchToRecruiter}
          disabled={switching}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {switching ? 'Switching…' : '🏢 Switch to Recruiter'}
        </button>
      </Card>
    </div>
  );
};
