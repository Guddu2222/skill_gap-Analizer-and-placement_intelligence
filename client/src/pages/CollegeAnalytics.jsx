import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart2, TrendingUp, Users, Award, AlertTriangle, BookOpen, Target, Zap } from 'lucide-react';
import api from '../services/api';

const CollegeAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [unplaced, setUnplaced] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, gapRes] = await Promise.allSettled([
          api.get('/college-features/dashboard'),
          api.get('/college-features/skill-gap-report'),
        ]);

        if (dashRes.status === 'fulfilled') {
          const d = dashRes.value.data;
          setStats(d.stats || d);
          setPlaced(d.placedStudents || []);
          setUnplaced(d.unplacedStudents || []);
        }

        if (gapRes.status === 'fulfilled') {
          setSkillGaps(gapRes.value.data?.skillGaps || gapRes.value.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'skill-gaps', label: 'Skill Gap Analysis', icon: Target },
    { id: 'placed', label: 'Placed Students', icon: Award },
    { id: 'unplaced', label: 'Unplaced / At Risk', icon: AlertTriangle },
  ];

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-64 w-[500px] h-[500px] bg-violet-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center gap-3">
          <BarChart2 className="w-5 h-5 text-violet-400" />
          <h1 className="text-base font-semibold text-white">Placement Analytics</h1>
          {loading && (
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin ml-2" />
          )}
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Tab Bar */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/8 w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Users,
                    label: 'Total Students',
                    value: stats?.totalStudents ?? 'N/A',
                    c: 'bg-violet-500',
                  },
                  {
                    icon: Award,
                    label: 'Placed',
                    value: stats?.placedStudents ?? 'N/A',
                    sub: `${stats?.placementRate ?? 0}% rate`,
                    c: 'bg-emerald-500',
                  },
                  {
                    icon: TrendingUp,
                    label: 'Avg Package',
                    value: stats?.avgPackage ? `INR ${stats.avgPackage} L` : 'N/A',
                    c: 'bg-cyan-500',
                  },
                  {
                    icon: BookOpen,
                    label: 'Departments',
                    value: stats?.departments ?? 'N/A',
                    c: 'bg-amber-500',
                  },
                ].map(({ icon: Icon, label, value, sub, c }) => (
                  <div
                    key={label}
                    className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-5"
                  >
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 -translate-y-6 translate-x-6 ${c}`}
                    />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {label}
                    </p>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
                  </div>
                ))}
              </div>

              {/* Placement Rate Bar */}
              <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-white">Overall Placement Progress</span>
                  <span className="text-violet-400 font-bold">{stats?.placementRate ?? 0}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-700"
                    style={{ width: `${stats?.placementRate ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skill Gaps Tab */}
          {activeTab === 'skill-gaps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Curriculum vs Market Skill Gaps</h2>
                  <p className="text-slate-400 text-sm">
                    High-demand skills missing in your student cohort
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  {skillGaps.length} gaps identified
                </span>
              </div>
              {skillGaps.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No major skill gaps detected. Students align well with market demands.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {skillGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-5 flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">
                            {gap.skill || gap.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              (gap.urgency || gap.priority) === 'High'
                                ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}
                          >
                            {gap.urgency || gap.priority || 'Medium'} Urgency
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{gap.recommendation || gap.action || 'Recommended intervention needed'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Market Demand</p>
                        <p className="text-lg font-bold text-cyan-400">{gap.marketDemand ?? 'High'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Placed Students Tab */}
          {activeTab === 'placed' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Placed Students ({placed.length})</h2>
              {placed.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No placed students data yet.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placed.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-emerald-500/20 p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">
                          {[s.firstName || s.first_name, s.lastName || s.last_name].filter(Boolean).join(' ') || 'Student'}
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                          Placed
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{s.department || s.branch} · {s.rollNumber || s.roll_number || 'N/A'}</p>
                      <div className="pt-2 border-t border-white/5 flex justify-between text-xs">
                        <span className="text-slate-400">Company: <span className="text-white font-medium">{s.company || s.placed_company || 'N/A'}</span></span>
                        <span className="text-emerald-400 font-semibold">{s.package ? `INR ${s.package} LPA` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Unplaced / At Risk Tab */}
          {activeTab === 'unplaced' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Unplaced / At-Risk Students ({unplaced.length})</h2>
                  <p className="text-slate-400 text-sm">Students requiring targeted placement interventions</p>
                </div>
              </div>
              {unplaced.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No unplaced students records.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unplaced.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-amber-500/20 p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">
                          {[s.firstName || s.first_name, s.lastName || s.last_name].filter(Boolean).join(' ') || 'Student'}
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">
                          Needs Support
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{s.department || s.branch} · CGPA: {s.cgpa ?? 'N/A'}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollegeAnalytics;