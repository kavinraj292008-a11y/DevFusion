import React, { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types/application';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const CandidateApplications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    applicationService.getApplications().then(setApps);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <p className="text-xs text-slate-400">Track the status of your submitted job applications.</p>
      </div>

      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-100">{a.jobTitle}</p>
              <p className="text-xs text-slate-400">Applied on: {a.appliedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-400 font-medium">Match: {a.matchScore}%</span>
              <Badge variant={a.stage === 'Interview' ? 'emerald' : 'indigo'}>
                {a.stage}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateApplications;