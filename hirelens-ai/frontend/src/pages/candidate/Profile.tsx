import React from 'react';
import { Card } from '../../components/ui/Card';

export const CandidateProfile: React.FC = () => {
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
            defaultValue="Alex Johnson" 
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
          <input 
            type="email" 
            defaultValue="alex@example.com" 
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Primary Role</label>
          <input 
            type="text" 
            defaultValue="Full Stack Engineer" 
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </Card>
    </div>
  );
};

export default CandidateProfile;