import React, { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { aiService, AIAnalysisResult } from '../../services/aiservice';
import { Application } from '../../types/application';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AIAnalysisCard } from '../../components/AIAnalysisCard';
import { Sparkles, Loader2, FileX } from 'lucide-react';

interface AIState {
  loading: boolean;
  result: AIAnalysisResult | null;
  error: string | null;
}

export const RecruiterApplications: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [aiStates, setAiStates] = useState<Record<string, AIState>>({});

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    applicationService
      .getApplications()
      .then(setApps)
      .catch((err) => {
        console.error('[Applications] fetch error:', err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load applications.';
        setFetchError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyze = async (appId: string) => {
    setAiStates((prev) => ({
      ...prev,
      [appId]: { loading: true, result: null, error: null },
    }));
    try {
      const result = await aiService.analyzeApplication(appId);
      setAiStates((prev) => ({
        ...prev,
        [appId]: { loading: false, result, error: null },
      }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'AI analysis failed. Please try again.';
      setAiStates((prev) => ({
        ...prev,
        [appId]: { loading: false, result: null, error: msg },
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Application Pipeline</h1>
        <p className="text-xs text-slate-400">
          Review candidate applications and run HireLens AI analysis.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading applications…</span>
        </div>
      )}

      {/* Fetch error */}
      {!loading && fetchError && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
          {fetchError}
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetchError && apps.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <FileX size={40} className="opacity-40" />
          <p className="text-sm">No applications found.</p>
          <p className="text-xs text-slate-600">
            Applications will appear here once candidates apply to your jobs.
          </p>
        </div>
      )}

      {/* Application cards */}
      {!loading && !fetchError && apps.length > 0 && (
        <div className="space-y-3">
          {apps.map((a) => {
            const ai = aiStates[a.id];
            return (
              <Card key={a.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-200">{a.candidateName}</p>
                    <p className="text-xs text-slate-400">{a.jobTitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="emerald">{a.stage}</Badge>
                    {!ai?.result && (
                      <button
                        onClick={() => handleAnalyze(a.id)}
                        disabled={ai?.loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {ai?.loading ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Analyzing…
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            Analyze
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {ai?.error && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2">
                    {ai.error}
                  </p>
                )}

                {ai?.result && (
                  <AIAnalysisCard
                    score={ai.result.score}
                    strengths={ai.result.strengths}
                    gaps={ai.result.gaps}
                  />
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
