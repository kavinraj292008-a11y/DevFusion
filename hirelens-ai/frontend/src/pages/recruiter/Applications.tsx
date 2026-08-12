import React, { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types/application';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const RecruiterApplications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    applicationService.getApplications().then(setApps);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Application Pipeline</h1>
        <p className="text-xs text-slate-400">Review candidate applications and hiring stages.</p>
      </div>

      <div className="space-y-2">
        {apps.map((a) => (
          <Card key={a.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-200">{a.candidateName}</p>
              <p className="text-xs text-slate-400">{a.jobTitle}</p>
            </div>
            <Badge variant="emerald">{a.stage}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterApplications;