import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-200 selection:text-indigo-900">
      {/* Navigation Header */}
      <header className="border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20">
              H
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
              HireLens AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <span>✨ Next-Gen ATS Powered by AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Hire Top Talent <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">10x Faster</span> with AI Matching
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Automate candidate screening, analyze skill gaps instantly, and make data-driven hiring decisions effortlessly.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Start Hiring Now
            </Link>
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl transition-all shadow-sm"
            >
              Apply as Candidate
            </Link>
          </div>
        </div>

        {/* Feature Grid Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">🎯</div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Smart Resume Scoring</h3>
            <p className="text-sm text-slate-600">Match candidates to job descriptions based on semantic skill alignment, not just keyword matching.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">⚡</div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Automated Pipelines</h3>
            <p className="text-sm text-slate-600">Track applicants across stages seamlessly with built-in status management and quick updates.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">📊</div>
            <h3 className="font-semibold text-lg text-slate-900 mb-2">Recruiter Analytics</h3>
            <p className="text-sm text-slate-600">Gain actionable insights into your hiring funnel with candidate statistics and metric visualizers.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © 2026 HireLens AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;