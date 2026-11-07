import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  BarChart2, TrendingUp, Users, Award, AlertTriangle, BookOpen,
  Target, FileText, Download, Printer, GraduationCap,
  Building, DollarSign, CheckCircle2, ChevronDown, Star, BarChart3,
} from 'lucide-react';
import api from '../services/api';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmtPkg = (n) => (n == null || n === '—' || n === 0) ? '—' : `${Number(n).toFixed(2)} LPA`;

function TableTh({ children, cls = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 ${cls}`}>
      {children}
    </th>
  );
}
function TableTd({ children, cls = '' }) {
  return (
    <td className={`px-4 py-3 text-sm text-slate-300 border-b border-white/4 ${cls}`}>
      {children}
    </td>
  );
}

function exportCSV(rows, headers, filename) {
  const csvRows = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ icon: Icon, label, value, sub, color = 'violet' }) {
  const colors = {
    violet:  'from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    sky:     'from-sky-600/20 to-sky-600/5 border-sky-500/20 text-sky-400',
    amber:   'from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    rose:    'from-rose-600/20 to-rose-600/5 border-rose-500/20 text-rose-400',
    cyan:    'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
  };
  const c = colors[color] || colors.violet;
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c} border p-5`}>
      <Icon className={`w-5 h-5 mb-3 ${c.split(' ').pop()}`} />
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-white tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function RateBar({ pct, color = 'violet' }) {
  const colors = { violet: 'bg-violet-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', sky: 'bg-sky-500' };
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${colors[color] || colors.violet} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs font-semibold text-white shrink-0 w-10 text-right">{pct}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const CollegeAnalytics = () => {
  const [stats, setStats]     = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [placed, setPlaced]   = useState([]);
  const [unplaced, setUnplaced] = useState([]);
  const [report, setReport]   = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [activeTab, setActiveTab]   = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if ((activeTab === 'nirf' || activeTab === 'naac') && !report) {
      fetchReport('');
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, gapRes, placedRes, atRiskRes] = await Promise.allSettled([
        api.get('/college-features/dashboard'),
        api.get('/college-features/curriculum-gap'),
        api.get('/college-features/students', { params: { placementStatus: 'placed', limit: 100 } }),
        api.get('/college-features/at-risk'),
      ]);
      if (dashRes.status === 'fulfilled') {
        const d = dashRes.value.data; const s = d.statistics || {};
        setStats({ totalStudents: s.totalStudents ?? 0, placedStudents: s.placedStudents ?? 0, placementRate: s.placementRate ?? 0, avgPackage: s.avgPackage ?? 0, departments: s.departments ?? 0 });
      }
      if (gapRes.status === 'fulfilled') {
        const gd = gapRes.value.data;
        const combined = (gd.criticalGaps?.length > 0 ? gd.criticalGaps : gd.overview) || [];
        setSkillGaps(combined.map(g => ({ skill: g.skill, urgency: g.gap > (g.supplyCount || 1) ? 'High' : 'Medium', recommendation: `Market demand: ${g.demandCount} jobs, student supply: ${g.supplyCount}.`, marketDemand: `${g.demandCount} jobs` })));
      }
      if (placedRes.status === 'fulfilled') setPlaced(placedRes.value.data?.students || []);
      if (atRiskRes.status === 'fulfilled') setUnplaced(atRiskRes.value.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchReport = async (year = '') => {
    setReportLoading(true);
    try {
      const params = year ? { year } : {};
      const res = await api.get('/college-features/placement-report', { params });
      setReport(res.data);
    } catch (err) { console.error('Report error:', err); } finally { setReportLoading(false); }
  };

  const handleYearChange = (y) => { setFilterYear(y); fetchReport(y); };

  const exportNIRF = () => {
    if (!report) return;
    exportCSV(report.departmentBreakdown, ['department', 'totalStudents', 'placedStudents', 'placementRate', 'avgPackage', 'maxPackage'], `NIRF_Placement_${report.filterYear}.csv`);
  };
  const exportStudentList = () => {
    if (!report) return;
    exportCSV(report.placedStudentsList, ['rollNumber', 'name', 'department', 'graduationYear', 'gender', 'cgpa', 'company', 'jobRole', 'package', 'offerType'], `Placed_Students_${report.filterYear}.csv`);
  };

  const tabs = [
    { id: 'overview',   label: 'Overview',          icon: BarChart2 },
    { id: 'skill-gaps', label: 'Skill Gap Analysis', icon: Target },
    { id: 'nirf',       label: 'NIRF Report',        icon: FileText },
    { id: 'naac',       label: 'NAAC Report',        icon: GraduationCap },
    { id: 'placed',     label: 'Placed Students',    icon: Award },
    { id: 'unplaced',   label: 'At-Risk',            icon: AlertTriangle },
  ];

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-64 w-[500px] h-[500px] bg-violet-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>
      <Sidebar role="college" />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center gap-3">
          <BarChart2 className="w-5 h-5 text-violet-400" />
          <h1 className="text-base font-semibold text-white">Placement Analytics &amp; Reports</h1>
          {loading && <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin ml-2" />}
        </header>
        <div className="flex-1 p-8 space-y-6">
          {/* Tab Bar */}
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/8 w-fit flex-wrap">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === id ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users}      label="Total Students" value={stats?.totalStudents ?? '—'} color="violet" />
                <StatCard icon={Award}      label="Placed"         value={stats?.placedStudents ?? '—'} color="emerald" sub={`${stats?.placementRate ?? 0}% placement rate`} />
                <StatCard icon={DollarSign} label="Avg Package"    value={fmtPkg(stats?.avgPackage)} color="cyan" />
                <StatCard icon={BookOpen}   label="Departments"    value={stats?.departments ?? '—'} color="amber" />
              </div>
              <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-white">Overall Placement Progress</span>
                  <span className="text-violet-400 font-bold">{stats?.placementRate ?? 0}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-700" style={{ width: `${stats?.placementRate ?? 0}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-2">{stats?.placedStudents} of {stats?.totalStudents} students successfully placed</p>
              </div>
              <div className="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Generate NIRF / NAAC Reports</p>
                  <p className="text-xs text-slate-400 mt-0.5">Switch to the NIRF or NAAC tabs to generate official exportable placement reports for accreditation submissions.</p>
                </div>
                <button onClick={() => setActiveTab('nirf')} className="ml-auto shrink-0 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all">
                  Generate Report →
                </button>
              </div>
            </div>
          )}

          {/* SKILL GAPS */}
          {activeTab === 'skill-gaps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Curriculum vs Market Skill Gaps</h2>
                  <p className="text-slate-400 text-sm">High-demand skills missing from your student cohort</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 text-xs font-semibold">{skillGaps.length} gaps</span>
              </div>
              {skillGaps.length === 0 ? (
                <div className="text-center py-16 text-slate-500"><Target className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No major skill gaps detected.</p></div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {skillGaps.map((gap, i) => (
                    <div key={i} className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-5 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{gap.skill}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${gap.urgency === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'}`}>{gap.urgency} Urgency</span>
                        </div>
                        <p className="text-xs text-slate-400">{gap.recommendation}</p>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-xs text-slate-500">Market Demand</p>
                        <p className="text-lg font-bold text-cyan-400">{gap.marketDemand}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NIRF */}
          {activeTab === 'nirf' && (
            <NirfReport report={report} loading={reportLoading} filterYear={filterYear} onYearChange={handleYearChange} onPrint={() => window.print()} onExportDept={exportNIRF} onExportStudents={exportStudentList} />
          )}

          {/* NAAC */}
          {activeTab === 'naac' && (
            <NaacReport report={report} loading={reportLoading} filterYear={filterYear} onYearChange={handleYearChange} onPrint={() => window.print()} onExportStudents={exportStudentList} />
          )}

          {/* PLACED */}
          {activeTab === 'placed' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Placed Students ({placed.length})</h2>
              {placed.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No placed students data yet.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {placed.map((s, i) => (
                    <div key={i} className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-emerald-500/20 p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{[s.first_name, s.last_name].filter(Boolean).join(' ') || 'Student'}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">Placed</span>
                      </div>
                      <p className="text-xs text-slate-400">{s.department} · {s.roll_number || 'N/A'}</p>
                      <div className="pt-2 border-t border-white/5 flex justify-between text-xs">
                        <span className="text-slate-400">Company: <span className="text-white font-medium">{s.placed_company || 'N/A'}</span></span>
                        <span className="text-emerald-400 font-semibold">{s.placement_package ? `${s.placement_package} LPA` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AT RISK */}
          {activeTab === 'unplaced' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">At-Risk Students ({unplaced.length})</h2>
                  <p className="text-slate-400 text-sm">Students requiring targeted placement interventions</p>
                </div>
              </div>
              {unplaced.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No at-risk records.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unplaced.map((s, i) => (
                    <div key={i} className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-amber-500/20 p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student'}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.riskLevel === 'Critical' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>{s.riskLevel ? `${s.riskLevel} Risk` : 'Needs Support'}</span>
                      </div>
                      <p className="text-xs text-slate-400">{s.department} · CGPA: {s.cgpa ?? 'N/A'}</p>
                      {s.riskFactors?.length > 0 && <p className="text-xs text-amber-300/80">Factors: {s.riskFactors.join(', ')}</p>}
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

// ─── NIRF REPORT ─────────────────────────────────────────────────────────────
function NirfReport({ report, loading, filterYear, onYearChange, onPrint, onExportDept, onExportStudents }) {
  const maxSalaryBand = report ? Math.max(...(report.salaryBands?.map(b => b.count) || [1]), 1) : 1;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" /> NIRF Placement Report
            <span className="text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold">Table 2.1</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">National Institutional Ranking Framework — Placement data</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select value={filterYear} onChange={e => onYearChange(e.target.value)} className="bg-[#1c1c30] border border-white/10 rounded-xl px-3 py-2 text-sm text-white pr-8 focus:outline-none focus:border-violet-500/50 appearance-none">
              <option value="">All Years</option>
              {(report?.availableYears || []).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button onClick={onExportDept} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-all"><Download className="w-3.5 h-3.5" /> Dept CSV</button>
          <button onClick={onExportStudents} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-semibold hover:bg-sky-600/30 transition-all"><Download className="w-3.5 h-3.5" /> Students CSV</button>
          <button onClick={onPrint} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-600/30 transition-all"><Printer className="w-3.5 h-3.5" /> Print / PDF</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : !report ? (
        <div className="text-center py-16 text-slate-500">Failed to load report.</div>
      ) : (
        <>
          {/* Header banner */}
          <div className="rounded-2xl bg-gradient-to-r from-violet-900/30 to-indigo-900/20 border border-violet-500/20 p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-white text-lg">{report.college.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Batch: {report.filterYear} · Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold">NIRF 2025</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">Table 2.1</span>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard icon={Users}      label="Total"          value={report.summary.totalStudents}           color="violet" />
            <StatCard icon={Award}      label="Placed"         value={report.summary.totalPlaced}             color="emerald" />
            <StatCard icon={AlertTriangle} label="Unplaced"    value={report.summary.totalUnplaced}           color="rose" />
            <StatCard icon={TrendingUp} label="Rate"           value={`${report.summary.placementRate}%`}     color="sky" />
            <StatCard icon={DollarSign} label="Avg Pkg"        value={fmtPkg(report.summary.avgPackage)}      color="amber" />
            <StatCard icon={Star}       label="Highest Pkg"    value={fmtPkg(report.summary.maxPackage)}      color="cyan" />
          </div>

          {/* Dept Table */}
          <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Building className="w-4 h-4 text-violet-400" />
              <span className="font-bold text-white">Department-wise Placement (NIRF Table 2.1)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14142a]">
                  <tr>
                    <TableTh>Department</TableTh><TableTh>Total</TableTh><TableTh>Placed</TableTh>
                    <TableTh>Unplaced</TableTh><TableTh>Rate</TableTh><TableTh>Avg Pkg</TableTh><TableTh>Max Pkg</TableTh>
                  </tr>
                </thead>
                <tbody>
                  {report.departmentBreakdown.map((d, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <TableTd cls="font-semibold text-white">{d.department}</TableTd>
                      <TableTd>{d.totalStudents}</TableTd>
                      <TableTd cls="text-emerald-400 font-semibold">{d.placedStudents}</TableTd>
                      <TableTd cls="text-rose-400">{d.totalStudents - d.placedStudents}</TableTd>
                      <TableTd><RateBar pct={parseFloat(d.placementRate)} color="emerald" /></TableTd>
                      <TableTd>{d.avgPackage > 0 ? `${d.avgPackage} LPA` : '—'}</TableTd>
                      <TableTd cls="text-amber-400">{d.maxPackage > 0 ? `${d.maxPackage} LPA` : '—'}</TableTd>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.departmentBreakdown.length && <div className="text-center py-12 text-slate-500 text-sm">No data.</div>}
            </div>
          </div>

          {/* Salary Bands + Top Recruiters */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-cyan-400" /><span className="font-bold text-white">Salary Distribution</span></div>
              <div className="space-y-3">
                {report.salaryBands.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-24 shrink-0">{b.label}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 transition-all" style={{ width: `${maxSalaryBand > 0 ? (b.count / maxSalaryBand) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-4"><Building className="w-4 h-4 text-emerald-400" /><span className="font-bold text-white">Top Recruiting Companies</span></div>
              <div className="space-y-2.5 overflow-y-auto max-h-64 custom-scrollbar-dark pr-1">
                {!report.topRecruiters.length ? <p className="text-center text-slate-500 text-sm py-4">No data.</p>
                  : report.topRecruiters.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-xs font-bold text-slate-500 w-5 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{r.company}</p>
                        <p className="text-[11px] text-slate-500">Avg: {r.avgPackage > 0 ? `${r.avgPackage} LPA` : '—'}</p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20">{r.count} hired</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Individual Table */}
          <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white">Placed Students — Individual Records</span>
                <span className="text-xs bg-sky-500/20 border border-sky-500/30 text-sky-300 px-2 py-0.5 rounded-full">{report.placedStudentsList.length}</span>
              </div>
              <button onClick={onExportStudents} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-semibold hover:bg-sky-600/30 transition-all"><Download className="w-3.5 h-3.5" /> CSV</button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar-dark">
              <table className="w-full">
                <thead className="bg-[#14142a] sticky top-0 z-10">
                  <tr>
                    <TableTh>#</TableTh><TableTh>Roll No</TableTh><TableTh>Name</TableTh><TableTh>Dept</TableTh>
                    <TableTh>Batch</TableTh><TableTh>CGPA</TableTh><TableTh>Company</TableTh>
                    <TableTh>Role</TableTh><TableTh>Package</TableTh><TableTh>Type</TableTh>
                  </tr>
                </thead>
                <tbody>
                  {report.placedStudentsList.map((s, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <TableTd cls="text-slate-500">{i + 1}</TableTd>
                      <TableTd cls="font-mono text-xs">{s.rollNumber}</TableTd>
                      <TableTd cls="font-semibold text-white">{s.name}</TableTd>
                      <TableTd>{s.department}</TableTd>
                      <TableTd>{s.graduationYear}</TableTd>
                      <TableTd cls="text-amber-400 font-semibold">{s.cgpa !== '—' ? s.cgpa : '—'}</TableTd>
                      <TableTd cls="text-white">{s.company}</TableTd>
                      <TableTd cls="text-slate-400">{s.jobRole !== '—' ? s.jobRole : '—'}</TableTd>
                      <TableTd cls="text-emerald-400 font-semibold">{s.package !== '—' ? `${s.package} LPA` : '—'}</TableTd>
                      <TableTd>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.offerType === 'PPO' ? 'bg-violet-500/20 border-violet-500/30 text-violet-300' : 'bg-slate-500/20 border-slate-500/30 text-slate-400'}`}>{s.offerType}</span>
                      </TableTd>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.placedStudentsList.length && <div className="text-center py-12 text-slate-500 text-sm">No placed students.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── NAAC REPORT ─────────────────────────────────────────────────────────────
function NaacReport({ report, loading, filterYear, onYearChange, onPrint, onExportStudents }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" /> NAAC Placement Report
            <span className="text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-semibold">Criterion 5.2</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">National Assessment and Accreditation Council — Student Progression &amp; Placement</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select value={filterYear} onChange={e => onYearChange(e.target.value)} className="bg-[#1c1c30] border border-white/10 rounded-xl px-3 py-2 text-sm text-white pr-8 focus:outline-none focus:border-violet-500/50 appearance-none">
              <option value="">All Years</option>
              {(report?.availableYears || []).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button onClick={onExportStudents} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-semibold hover:bg-sky-600/30 transition-all"><Download className="w-3.5 h-3.5" /> CSV</button>
          <button onClick={onPrint} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-600/30 transition-all"><Printer className="w-3.5 h-3.5" /> Print / PDF</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : !report ? (
        <div className="text-center py-16 text-slate-500">Failed to load report.</div>
      ) : (
        <>
          <div className="rounded-2xl bg-gradient-to-r from-cyan-900/30 to-sky-900/20 border border-cyan-500/20 p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-white text-lg">{report.college.name}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Batch: {report.filterYear} · Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">NAAC 2025</span>
              <span className="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold">Criterion 5.2.1</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Users}      label="Total Students"  value={report.summary.totalStudents}          color="violet" />
            <StatCard icon={Award}      label="Total Placed"    value={report.summary.totalPlaced}            color="emerald" />
            <StatCard icon={TrendingUp} label="Placement Rate"  value={`${report.summary.placementRate}%`}    color="sky" />
            <StatCard icon={DollarSign} label="Median Package"  value={fmtPkg(report.summary.medianPackage)}  color="amber" />
          </div>

          {/* Gender-wise */}
          <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">5.2.1 — Gender-wise Placement</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14142a]">
                  <tr><TableTh>Gender</TableTh><TableTh>Total</TableTh><TableTh>Placed</TableTh><TableTh>Unplaced</TableTh><TableTh>Rate</TableTh></tr>
                </thead>
                <tbody>
                  {report.genderBreakdown.map((g, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <TableTd cls="font-semibold text-white capitalize">{g.gender}</TableTd>
                      <TableTd>{g.totalStudents}</TableTd>
                      <TableTd cls="text-emerald-400 font-semibold">{g.placedStudents}</TableTd>
                      <TableTd cls="text-rose-400">{g.totalStudents - g.placedStudents}</TableTd>
                      <TableTd><RateBar pct={parseFloat(g.placementRate)} color="sky" /></TableTd>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.genderBreakdown.length && <div className="text-center py-12 text-slate-500 text-sm">No gender data.</div>}
            </div>
          </div>

          {/* Year Trend */}
          <div className="rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span className="font-bold text-white">5.2.2 — Year-on-Year Placement Trend</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#14142a]">
                  <tr><TableTh>Year</TableTh><TableTh>Total</TableTh><TableTh>Placed</TableTh><TableTh>Rate</TableTh><TableTh>Avg Pkg</TableTh></tr>
                </thead>
                <tbody>
                  {report.yearBreakdown.map((y, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <TableTd cls="font-bold text-white">{y.year}</TableTd>
                      <TableTd>{y.totalStudents}</TableTd>
                      <TableTd cls="text-emerald-400 font-semibold">{y.placedStudents}</TableTd>
                      <TableTd><RateBar pct={parseFloat(y.placementRate)} color="violet" /></TableTd>
                      <TableTd cls="text-amber-400">{y.avgPackage > 0 ? `${y.avgPackage} LPA` : '—'}</TableTd>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.yearBreakdown.length && <div className="text-center py-12 text-slate-500 text-sm">No year data.</div>}
            </div>
          </div>

          {/* Criterion Checklist */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-900/20 to-violet-900/20 border border-cyan-500/20 p-5">
            <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="font-bold text-white">NAAC Criterion 5 — Compliance Checklist</span></div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { criterion: '5.1.1', label: 'Student Support System', ok: true, note: 'Skill gap analysis & learning paths active' },
                { criterion: '5.2.1', label: 'Placement Data', ok: report.summary.totalPlaced > 0, note: `${report.summary.totalPlaced} students placed` },
                { criterion: '5.2.2', label: 'Higher Studies', ok: false, note: 'Not tracked (optional)' },
                { criterion: '5.3.1', label: 'Awards / Medals', ok: false, note: 'Not applicable' },
              ].map(c => (
                <div key={c.criterion} className={`flex items-start gap-3 p-3.5 rounded-xl border ${c.ok ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-slate-800/30 border-white/5'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${c.ok ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-400">{c.criterion}</p>
                    <p className={`text-sm font-semibold ${c.ok ? 'text-white' : 'text-slate-500'}`}>{c.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CollegeAnalytics;
