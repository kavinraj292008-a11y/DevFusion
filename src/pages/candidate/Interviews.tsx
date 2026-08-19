import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const CandidateInterviews: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Scheduled Interviews</h1>
        <p className="text-xs text-slate-400">View your upcoming interview schedules and AI assessments.</p>
      </div>

      <div className="space-y-3">
        <Card className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-slate-100">Frontend Engineer - Technical Round</p>
            <p className="text-xs text-slate-400">Date: Tomorrow at 2:00 PM (Google Meet)</p>
          </div>
          <Badge variant="indigo">Upcoming</Badge>
        </Card>
      </div>
    </div>
  );
};

export default CandidateInterviews;