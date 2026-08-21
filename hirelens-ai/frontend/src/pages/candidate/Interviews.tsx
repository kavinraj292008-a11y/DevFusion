import React, { useEffect, useState } from 'react';
import { interviewService } from '../../services/interviewservice';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader2, CalendarX } from 'lucide-react';

export const CandidateInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
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
        <h1 className="text-2xl font-bold text-white">My Interviews</h1>
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
          <p className="text-xs text-slate-600">Interviews appear here once a recruiter schedules one with you.</p>
        </div>
      )}

      <div className="space-y-3">
        {interviews.map(i => (
          <Card key={i.id} className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">{i.jobTitle}</p>
              <p className="text-xs text-slate-400">{new Date(i.scheduledAt).toLocaleString()}</p>
              {i.interviewer && <p className="text-xs text-slate-500">Interviewer: {i.interviewer}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="indigo">{i.type}</Badge>
              <Badge variant={i.status === 'Scheduled' ? 'emerald' : 'slate'}>{i.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateInterviews;
