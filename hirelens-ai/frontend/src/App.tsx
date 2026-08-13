import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  FileText,
  CalendarClock,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RecruiterDashboard } from './pages/recruiter/Dashboard';
import { RecruiterJobs } from './pages/recruiter/Jobs';
import { CreateJob } from './pages/recruiter/CreateJob';
import { RecruiterCandidates } from './pages/recruiter/Candidates';
import { CandidateDetails } from './pages/recruiter/CandidateDetails';
import { RecruiterApplications } from './pages/recruiter/Applications';
import { RecruiterInterviews } from './pages/recruiter/Interviews';
import { RecruiterAnalytics } from './pages/recruiter/Analytics';
import { CandidateDashboard } from './pages/candidate/Dashboard';
import { CandidateJobs } from './pages/candidate/Jobs';
import { CandidateApplications } from './pages/candidate/Applications';
import { CandidateInterviews } from './pages/candidate/Interviews';
import { CandidateProfile } from './pages/candidate/Profile';
import { useAuth } from './hooks/useAuth';

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 border border-transparent'
  }`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/recruiter/create-job', label: 'Create Job', icon: PlusCircle },
    { to: '/recruiter/candidates', label: 'Candidates', icon: Users },
    { to: '/recruiter/applications', label: 'Applications', icon: FileText },
    { to: '/recruiter/interviews', label: 'Interviews', icon: CalendarClock },
    { to: '/recruiter/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/candidate/jobs', label: 'Browse Jobs', icon: Briefcase },
    { to: '/candidate/applications', label: 'Applications', icon: FileText },
    { to: '/candidate/interviews', label: 'Interviews', icon: CalendarClock },
    { to: '/candidate/profile', label: 'My Profile', icon: Users },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between p-4">
        <div className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-slate-950 text-sm">
              H
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-100">
              Hire<span className="text-indigo-400">Lens</span> AI
            </span>
          </div>

          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navItemClasses}>
                <Icon size={17} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300 uppercase">
              {user?.name?.[0] ?? user?.role?.[0] ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {user?.name ?? 'Account'}
              </p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Recruiter Routes with Strict Role Check */}
        <Route path="/recruiter/*" element={
          isAuthenticated ? (
            user?.role === 'recruiter' ? (
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<RecruiterDashboard />} />
                  <Route path="jobs" element={<RecruiterJobs />} />
                  <Route path="create-job" element={<CreateJob />} />
                  <Route path="candidates" element={<RecruiterCandidates />} />
                  <Route path="candidate/:id" element={<CandidateDetails />} />
                  <Route path="applications" element={<RecruiterApplications />} />
                  <Route path="interviews" element={<RecruiterInterviews />} />
                  <Route path="analytics" element={<RecruiterAnalytics />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            ) : <Navigate to="/candidate/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />

        {/* Candidate Routes with Strict Role Check */}
        <Route path="/candidate/*" element={
          isAuthenticated ? (
            user?.role === 'candidate' ? (
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<CandidateDashboard />} />
                  <Route path="jobs" element={<CandidateJobs />} />
                  <Route path="applications" element={<CandidateApplications />} />
                  <Route path="interviews" element={<CandidateInterviews />} />
                  <Route path="profile" element={<CandidateProfile />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            ) : <Navigate to="/recruiter/dashboard" replace />
          ) : <Navigate to="/login" replace />
        } />

        {/* Global Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;