import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Award,
  Download,
  Filter,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  Bell,
  Code2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { fetchRecruiterAnalytics } from '../services/api';

const RecruiterAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    setLoading(true);
    fetchRecruiterAnalytics()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Error fetching recruiter analytics:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || {
    totalCandidates: 1250,
    shortlistedCount: 340,
    interviewCount: 185,
    hiredCount: 68,
    conversionRate: 14,
    avgCgpa: 8.12,
    activeDrivesCount: 6,
    partnerCollegesCount: 12,
  };

  const topSkills = data?.topSkills || [
    { name: 'React.js', count: 180 },
    { name: 'Node.js', count: 165 },
    { name: 'Python', count: 150 },
    { name: 'Java', count: 140 },
    { name: 'AWS Cloud', count: 95 },
    { name: 'Docker', count: 85 },
  ];

  const colleges = data?.colleges || [
    { name: 'Indian Institute of Technology, Bombay', tier: 'tier1', totalStudents: 450, placedStudents: 380 },
    { name: 'National Institute of Technology, Trichy', tier: 'tier1', totalStudents: 380, placedStudents: 310 },
    { name: 'Delhi Technological University', tier: 'tier2', totalStudents: 320, placedStudents: 240 },
  ];

  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recruiter-intelligence-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/85 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Recruitment Intelligence & Funnel</h1>
              <p className="text-[11px] text-slate-400">Campus hiring velocity, talent skill indices, and cohort conversions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Open Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all"
            >
              <Download className="w-4 h-4 text-violet-400" />
              <span>Export Intel Report</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Pool</span>
                <Users className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{metrics.totalCandidates}</p>
              <p className="text-xs text-slate-500 mt-1">Across {metrics.partnerCollegesCount} accredited colleges</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hiring Conversion</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">{metrics.conversionRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{metrics.hiredCount} total verified placements</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Avg CGPA</span>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-extrabold text-cyan-400">{metrics.avgCgpa}</p>
              <p className="text-xs text-slate-500 mt-1">High-distinction academic benchmark</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Campus Drives</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">{metrics.activeDrivesCount}</p>
              <p className="text-xs text-slate-500 mt-1">Live recruitment windows</p>
            </div>
          </div>

          {/* Hiring Pipeline Funnel */}
          <div className="rounded-2xl bg-[#17172b]/85 backdrop-blur-md border border-white/8 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Full Hiring Pipeline Funnel</h3>
                <p className="text-xs text-slate-400">Progression from sourced applicants to finalized offer acceptance</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                Live Conversion Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {[
                { stage: '1. Sourced Pool', count: metrics.totalCandidates, pct: '100%', color: 'from-violet-600 to-indigo-600' },
                { stage: '2. Shortlisted for Drives', count: metrics.shortlistedCount, pct: `${Math.round((metrics.shortlistedCount / (metrics.totalCandidates || 1)) * 100)}%`, color: 'from-cyan-600 to-blue-600' },
                { stage: '3. Technical & OA', count: metrics.interviewCount, pct: `${Math.round((metrics.interviewCount / (metrics.totalCandidates || 1)) * 100)}%`, color: 'from-amber-600 to-orange-600' },
                { stage: '4. Final Hires', count: metrics.hiredCount, pct: `${metrics.conversionRate}%`, color: 'from-emerald-600 to-teal-600' },
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`} />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{step.stage}</span>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                      {step.pct}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">{step.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Columns: Top Skills in Pool & Partner Colleges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Skills Distribution */}
            <div className="rounded-2xl bg-[#17172b]/85 backdrop-blur-md border border-white/8 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-5 h-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">Talent Pool Skill Density</h3>
                </div>
                <span className="text-xs text-slate-400">Based on verified candidate tests</span>
              </div>

              <div className="space-y-4">
                {topSkills.map((sk, idx) => {
                  const maxCount = Math.max(...topSkills.map((s) => s.count), 1);
                  const percentage = Math.round((sk.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{sk.name}</span>
                        <span className="text-slate-400">{sk.count} candidates ({percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Partner Colleges Talent Hub */}
            <div className="rounded-2xl bg-[#17172b]/85 backdrop-blur-md border border-white/8 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Institutional Quality Matrix</h3>
                </div>
                <span className="text-xs text-slate-400">Partner Campuses</span>
              </div>

              <div className="space-y-3.5">
                {colleges.map((col, idx) => {
                  const rate = col.totalStudents > 0
                    ? Math.round((col.placedStudents / col.totalStudents) * 100)
                    : 85;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 flex items-center justify-center font-bold text-sm text-violet-300">
                          {col.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs leading-snug">{col.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Tier: <span className="uppercase font-semibold text-cyan-400">{col.tier || 'Tier 1'}</span> • {col.totalStudents || 300}+ Candidates
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400">{rate}% Placement</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Verified Accreditation</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onUnreadCountChange={(c) => setUnreadCount(c)}
      />
    </div>
  );
};

export default RecruiterAnalytics;
