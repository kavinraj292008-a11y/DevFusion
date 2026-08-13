import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AIAnalysisProps {
  score: number;
  strengths: string[];
  gaps: string[];
}

export const AIAnalysisCard: React.FC<AIAnalysisProps> = ({ score, strengths, gaps }) => {
  return (
    <div className="glass-card rounded-xl p-5 border border-indigo-500/20 bg-gradient-to-b from-indigo-950/20 to-slate-900/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles size={18} />
          <h4 className="font-semibold text-sm">HireLens AI Match Engine</h4>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300">
          Match Rating: {score}%
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-emerald-400 font-medium flex items-center gap-1 mb-1">
            <CheckCircle2 size={14} /> Key Highlights
          </span>
          <ul className="list-disc list-inside text-slate-300 space-y-0.5">
            {strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <span className="text-amber-400 font-medium flex items-center gap-1 mb-1">
            <AlertCircle size={14} /> Skill Gaps / Considerations
          </span>
          <ul className="list-disc list-inside text-slate-400 space-y-0.5">
            {gaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};