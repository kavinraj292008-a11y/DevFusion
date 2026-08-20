import React, { useEffect, useState } from 'react';
import { interviewService } from '../../services/interviewservice';
import { Interview } from '../../types/interview';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, CalendarX } from 'lucide-react';

export const RecruiterInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    interviewService.getInterviews()
      .then(setInterviews)
      .catch(err => setError(err?.response?.data?.message || 'Failed to load interviews.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Scheduled Interviews</h1>
        <p className="text-xs text-slate-400 mt-1">Upcoming and past interview sessions.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
          <Loader2 size={16} className="animate-spin"/>Loading interviews…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      {!loading && !error && interviews.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <CalendarX size={40} className="opacity-40"/>
          <p className="text-sm">No interviews scheduled yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {interviews.map(i => (
          <Card key={i.id} className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">{i.candidateName}</p>
              <p className="text-xs text-slate-400">{i.jobTitle}</p>
              <p className="text-xs text-slate-500">{new Date(i.scheduledAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="indigo">{i.type}</Badge>
              <Badge variant="emerald">{i.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
