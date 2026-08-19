import React, { useEffect, useState } from 'react';
import { candidateService } from '../../services/candidateService';
import { Candidate } from '../../types/candidate';
import { Card } from '../../components/ui/Card';
import { Sparkles } from 'lucide-react';

export const RecruiterCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    candidateService.getCandidates().then(setCandidates);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Candidates Pool</h1>
        <p className="text-xs text-slate-400 mt-1">
          AI analysis is available per application — open an application to run the HireLens AI engine.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((c) => (
          <Card key={c.id} className="space-y-3">
            <div>
              <h3 className="font-bold text-slate-100">{c.name}</h3>
              <p className="text-xs text-slate-400">
                {c.role} • {c.experienceYears} Years Exp
              </p>
            </div>
            <div className="rounded-xl p-4 border border-slate-700/50 bg-slate-800/30 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500/60" />
              AI analysis available from the Applications view
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
