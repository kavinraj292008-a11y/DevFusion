import React from 'react';
import { Card } from '../../components/ui/Card';
import { Briefcase, Users, Calendar, Sparkles } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Recruiter Overview</h1>
        <p className="text-xs text-slate-400">Track candidate pipelines and AI match insights.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><Briefcase size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Active Jobs</p>
            <p className="text-xl font-bold text-white">12</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><Users size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Total Candidates</p>
            <p className="text-xl font-bold text-white">148</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg"><Calendar size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Interviews Today</p>
            <p className="text-xl font-bold text-white">4</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg"><Sparkles size={20}/></div>
          <div>
            <p className="text-xs text-slate-400">Avg AI Match Score</p>
            <p className="text-xl font-bold text-white">88%</p>
          </div>
        </Card>
      </div>
    </div>
  );
};