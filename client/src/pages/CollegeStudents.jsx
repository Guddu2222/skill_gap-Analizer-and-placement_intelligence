import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Users, Award, Star, Briefcase, Search, Download,
  ChevronLeft, ChevronRight, X, Github, Linkedin, ExternalLink,
  GraduationCap, Code2,
} from 'lucide-react';
import {
  fetchCollegeDashboard, fetchCollegeStudents, exportCollegeStudents,
} from '../services/api';

const cgpaBadge = (cgpa) => {
  const v = parseFloat(cgpa);
  if (v >= 8) return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  if (v >= 6) return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
  return 'bg-red-500/15 text-red-400 border border-red-500/30';
};

const statusBadge = (s) => {
  switch ((s || '').toLowerCase()) {
    case 'placed':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'applying':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'eligible':
      return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border border-slate-500/30';
  }
};

const initials = (s) =>
  [s?.first_name, s?.last_name].filter(Boolean).map((n) => n[0]).join('').toUpperCase() || 'S';

const LIMIT = 15;

const ProfileDrawer = ({ student, onClose }) => {
  if (!student) return null;
  const skills = student.skills || [];
  const name = [student.first_name, student.last_name].filter(Boolean).join(' ') || 'Student';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col bg-[#17172b]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-white/8 bg-gradient-to-r from-violet-600/10 to-cyan-600/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30">
              {initials(student)}
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">{name}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{student.roll_number || 'N/A'}</p>
              <p className="text-slate-500 text-xs mt-0.5">{student.department}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'CGPA', value: student.cgpa ?? 'N/A' },
              { label: 'Year', value: student.graduation_year ?? 'N/A' },
              { label: 'Status', value: student.placement_status || 'Unplaced' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/8">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="font-bold text-white text-sm">{value}</p>
              </div>
            ))}
          </div>

          {student.is_placed && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Placed At</p>
              <p className="text-white font-semibold">{student.placed_company || 'Company'}</p>
              {student.placement_package && (
                <p className="text-emerald-400 text-sm mt-0.5">INR {student.placement_package} LPA</p>
              )}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" />
                Technical Skills
              </p>
              <div className="space-y-3">
                {skills.slice(0, 8).map((sk, i) => {
                  const n = sk.skill_name || sk;
                  const lv = (sk.proficiency_level || 'intermediate').toLowerCase();
                  const pct = lv === 'expert' ? 95 : lv === 'advanced' ? 80 : lv === 'intermediate' ? 60 : 35;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{n}</span>
                        <span className="text-slate-500 capitalize">{lv}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-violet-500 to-cyan-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {student.linkedin_url && (
              <a
                href={student.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/15 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-600/25 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {student.github_url && (
              <a
                href={student.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {student.resume_url && (
              <a
                href={student.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-violet-500/15 text-violet-300 border border-violet-500/30 rounded-lg text-sm hover:bg-violet-500/25 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Resume
              </a>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const CollegeStudents = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [departments, setDepts] = useState([]);

  useEffect(() => {
    fetchCollegeDashboard()
      .then((d) => {
        setStats(d.statistics);
        if (d.departmentStats) setDepts(Object.keys(d.departmentStats));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: LIMIT, search, department: dept, graduationYear: year, placementStatus: status, sortBy: 'cgpa' };
    fetchCollegeStudents(params)
      .then((d) => {
        setStudents(d.students || []);
        setTotal(d.pagination?.total || 0);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [page, search, dept, year, status]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportCollegeStudents('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const KPI = ({ icon: Icon, label, value, sub, c }) => (
    <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.85)] backdrop-blur-md border border-white/8 p-5 hover:border-white/15 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-20 -translate-y-8 translate-x-8 ${c}`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c} bg-opacity-20`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value ?? 'N/A'}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-64 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-violet-400" />
            <h1 className="text-base font-semibold text-white">Student Management</h1>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-semibold border border-violet-500/20">
              {total} students
            </span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI icon={Users} label="Total Students" value={stats?.totalStudents ?? 'N/A'} sub="Registered this year" c="bg-violet-500" />
            <KPI icon={Award} label="Placed" value={stats?.placedStudents ?? 'N/A'} sub={stats ? `${stats.placementRate}% rate` : ''} c="bg-emerald-500" />
            <KPI icon={Star} label="Placement Rate" value={stats ? `${stats.placementRate}%` : 'N/A'} c="bg-cyan-500" />
            <KPI icon={Briefcase} label="Avg Package" value={stats?.avgPackage ? `INR ${stats.avgPackage} LPA` : 'N/A'} sub="Per annum" c="bg-amber-500" />
          </div>

          <div className="flex flex-wrap items-center gap-3 p-4 bg-[rgba(23,23,43,0.85)] rounded-2xl border border-white/8 backdrop-blur-md">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, roll number, email..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/15 transition-all"
              />
            </div>
            <select
              value={dept}
              onChange={(e) => {
                setDept(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500/60 min-w-[140px]"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none min-w-[110px]"
            >
              <option value="">All Years</option>
              {['2024', '2025', '2026', '2027'].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none min-w-[130px] capitalize"
            >
              <option value="">All Statuses</option>
              {['placed', 'applying', 'eligible', 'unplaced'].map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
            {(search || dept || year || status) && (
              <button
                onClick={() => {
                  setSearch('');
                  setDept('');
                  setYear('');
                  setStatus('');
                  setPage(1);
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          <div className="bg-[rgba(23,23,43,0.85)] rounded-2xl border border-white/8 backdrop-blur-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Student', 'Roll No.', 'Department', 'CGPA', 'Skills', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5 animate-pulse">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-white/5 rounded-lg" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No students found</p>
                      </td>
                    </tr>
                  ) : (
                    students.map((s, i) => (
                      <tr
                        key={s.id || i}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        onClick={() => setSelected(s)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/60 to-cyan-500/60 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {initials(s)}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm group-hover:text-violet-300 transition-colors">
                                {[s.first_name, s.last_name].filter(Boolean).join(' ') || 'N/A'}
                              </p>
                              <p className="text-slate-500 text-xs">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-sm font-mono">{s.roll_number || 'N/A'}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs border border-white/8">
                            {s.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cgpaBadge(s.cgpa)}`}>
                            {s.cgpa ?? 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(s.skills || []).slice(0, 3).map((sk, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 text-[10px] border border-violet-500/20 whitespace-nowrap"
                              >
                                {sk.skill_name || sk}
                              </span>
                            ))}
                            {(s.skills || []).length > 3 && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-500 text-[10px] border border-white/10">
                                +{(s.skills || []).length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(s.placement_status)}`}>
                            {s.placement_status || 'Unplaced'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            className="px-3 py-1.5 text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 transition-colors opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(s);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} of {total} students
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                          page === pg
                            ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ProfileDrawer student={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default CollegeStudents;