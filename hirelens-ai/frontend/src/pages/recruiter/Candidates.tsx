import React, { useEffect, useState } from 'react';
import { candidateService } from '../../services/candidateService';
import { Candidate } from '../../types/candidate';
import { Card } from '../../components/ui/Card';
import { AIAnalysisCard } from '../../components/AIAnalysisCard';

export const RecruiterCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    candidateService.getCandidates().then(setCandidates);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Candidates Pool</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((c) => (
          <Card key={c.id} className="space-y-3">
            <div>
              <h3 className="font-bold text-slate-100">{c.name}</h3>
              <p className="text-xs text-slate-400">{c.role} • {c.experienceYears} Years Exp</p>
            </div>
            <AIAnalysisCard score={c.matchScore} strengths={['High skill overlap']} gaps={['Minor experience shortfall']} />
          </Card>
        ))}
      </div>
    </div>
  );
};