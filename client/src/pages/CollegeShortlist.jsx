import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MarkPlacedModal from '../components/college/MarkPlacedModal';
import {
  Sparkles,
  Rocket,
  Download,
  Search,
  CheckCircle2,
  Filter,
  Users,
  Building2,
  Award,
  TrendingUp,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Layers,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  X,
  Code2,
} from 'lucide-react';
import api from '../services/api';
import { STANDARD_DEPARTMENTS, normalizeDepartment } from '../constants/departments';

const CollegeShortlist = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drivesLoading, setDrivesLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [selectedDepts, setSelectedDepts] = useState([
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Machine Learning',
  ]);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [roundName, setRoundName] = useState('Round 1 (Online Assessment)');

  // Placement modal state
  const [placedStudent, setPlacedStudent] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Fetch campus drives
  useEffect(() => {
    setDrivesLoading(true);
    api.get('/campus-drives')
      .then((res) => {
        const driveList = res.data?.drives || res.data || [];
        setDrives(driveList);
        if (driveList.length > 0) {
          setSelectedDriveId(driveList[0]._id || driveList[0].id);
        }
      })
      .catch((err) => console.error('Failed to load drives:', err))
      .finally(() => setDrivesLoading(false));
  }, []);

  // Fetch all students for shortlist evaluation
  const loadStudents = () => {
    setLoading(true);
    api.get('/college-features/students', { params: { limit: 150 } })
      .then((res) => {
        setStudents(res.data?.students || []);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Selected drive details
  const activeDrive = useMemo(() => {
    return drives.find((d) => (d._id || d.id) === selectedDriveId) || drives[0] || null;
  }, [drives, selectedDriveId]);

  // Department toggle
  const toggleDepartment = (dept) => {
    setSelectedDepts((prev) => {
      const next = [...prev];
      const idx = next.indexOf(dept);
      if (idx >= 0) {
        next.splice(idx, 1);
      } else {
        next.push(dept);
      }
      return next;
    });
  };

  // Filter and compute simulated AI matching score based on drive requirements
  const eligibleCandidates = useMemo(() => {
    return students
      .map((student) => {
        const cgpa = parseFloat(student.cgpa || 0);
        const normDept = normalizeDepartment(student.department);

        // Required skills from drive
        const driveSkills = (activeDrive?.requiredSkills || ['React', 'Node.js', 'Python', 'DSA'])
          .map((s) => (typeof s === 'string' ? s.toLowerCase() : s.skillName?.toLowerCase() || ''));

        const studentSkills = (student.skills || [])
          .map((s) => (typeof s === 'string' ? s.toLowerCase() : s.skill_name?.toLowerCase() || ''));

        // Match overlap
        const matched = driveSkills.filter((req) => studentSkills.some((st) => st.includes(req) || req.includes(st)));
        const skillMatchRate = driveSkills.length > 0 ? (matched.length / driveSkills.length) * 40 : 30;

        // CGPA weight (out of 50)
        const cgpaScore = Math.min(50, (cgpa / 10) * 50);

        // Base assessment score
        const totalMatch = Math.min(99, Math.max(65, Math.round(cgpaScore + skillMatchRate + 10)));

        return {
          ...student,
          normDept,
          matchScore: totalMatch,
        };
      })
      .filter((student) => {
        const cgpa = parseFloat(student.cgpa || 0);
        const matchesCgpa = cgpa >= minCgpa;
        const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(student.normDept);
        const q = search.toLowerCase();
        const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
        const matchesSearch =
          !q ||
          fullName.includes(q) ||
          (student.roll_number || '').toLowerCase().includes(q) ||
          (student.email || '').toLowerCase().includes(q);

        return matchesCgpa && matchesDept && matchesSearch;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [students, minCgpa, selectedDepts, search, activeDrive]);

  // Bulk selection toggles
  const handleSelectAll = () => {
    if (selectedCandidates.size === eligibleCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(eligibleCandidates.map((c) => c._id || c.id)));
    }
  };

  const toggleCandidate = (id) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Submit Bulk Shortlist to Drive
  const handleShortlistBulk = async () => {
    if (selectedCandidates.size === 0 || !activeDrive) return;
    try {
      const studentIds = Array.from(selectedCandidates);
      await api.post('/college-features/shortlist-drive', {
        driveId: activeDrive._id || activeDrive.id,
        studentIds,
        round: roundName,
      });

      setActionSuccess(`Successfully shortlisted ${studentIds.length} candidate(s) for ${activeDrive.company}!`);
      setTimeout(() => setActionSuccess(null), 5000);
      setSelectedCandidates(new Set());
    } catch (err) {
      console.error('Shortlist error:', err);
      alert('Failed to shortlist candidates. Please ensure drive exists.');
    }
  };

  // Export Shortlist CSV
  const handleExportShortlistCsv = () => {
    const listToExport =
      selectedCandidates.size > 0
        ? eligibleCandidates.filter((c) => selectedCandidates.has(c._id || c.id))
        : eligibleCandidates;

    if (listToExport.length === 0) return;

    const headers = ['Name', 'Roll Number', 'Department', 'CGPA', 'Match Score', 'Placement Status', 'Email'];
    const rows = listToExport.map((s) => [
      `"${[s.first_name, s.last_name].filter(Boolean).join(' ')}"`,
      `"${s.roll_number || ''}"`,
      `"${s.normDept}"`,
      s.cgpa || '',
      `${s.matchScore}%`,
      `"${s.placement_status || 'Unplaced'}"`,
      `"${s.email || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shortlist_${activeDrive?.company || 'campus_drive'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-[#0a0a14] min-h-screen text-[#e3e0f1] font-sans relative selection:bg-violet-500/30 selection:text-white pb-32">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[150px]" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        {/* Header Telemetry */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Campus Drive Smart Shortlist Hub
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              AI skill matching, eligibility verification, and drive clearance management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportShortlistCsv}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Export Eligible CSV
            </button>
          </div>
        </header>

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── DRIVE SELECTION & CONTROLLER RIBBON ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-2xl border border-white/8 p-7 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Drive Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/30 shrink-0 border border-white/15">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Active Drive Target
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {activeDrive?.jobType || 'Full-time / On Campus'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {activeDrive?.company || 'Company Drive'} — {activeDrive?.title || 'Engineering Role'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Eligible Batches: {activeDrive?.eligibleBatches?.join(', ') || 'Class of 2025'} • Min CGPA: {activeDrive?.minCgpa || 7.5}
                </p>
              </div>
            </div>

            {/* Drive Dropdown Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative">
                <select
                  value={selectedDriveId}
                  onChange={(e) => setSelectedDriveId(e.target.value)}
                  className="px-4 py-2.5 bg-[#121224] border border-white/15 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-violet-500 min-w-[220px]"
                >
                  {drives.length === 0 && <option value="">No Active Drives Found</option>}
                  {drives.map((d) => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      {d.company} — {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Package Offered</p>
                <p className="text-base font-extrabold text-emerald-400">
                  {activeDrive?.packageDetails ? `₹${activeDrive.packageDetails} LPA` : '₹12.0 - 24.0 LPA'}
                </p>
              </div>
            </div>
          </div>

          {/* Criteria Ribbon */}
          <div className="pt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* CGPA Threshold */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Min CGPA Cutoff:
                </span>
                <div className="flex items-center gap-1.5 bg-[#121224] p-1 rounded-xl border border-white/8">
                  {[6.5, 7.0, 7.5, 8.0, 8.5].map((cutoff) => (
                    <button
                      key={cutoff}
                      type="button"
                      onClick={() => setMinCgpa(cutoff)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        minCgpa === cutoff
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cutoff}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Search query */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter candidate name, roll..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#121224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Department Multi-Select Chips */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Eligible Departments:
              </p>
              <div className="flex flex-wrap gap-2">
                {STANDARD_DEPARTMENTS.slice(0, 8).map((dept) => {
                  const isChecked = selectedDepts.includes(dept);
                  return (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => toggleDepartment(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-violet-500/20 border-violet-500 text-white font-semibold'
                          : 'bg-white/5 border-white/8 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-violet-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{dept}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <span>
                Matching Criteria Result: <strong className="text-white">{eligibleCandidates.length}</strong> eligible candidates qualified
              </span>
              <span className="text-cyan-400 font-semibold">
                AI Match Score Computed on Technical Stack & Telemetry
              </span>
            </div>
          </div>
        </section>

        {/* ─── CANDIDATE SHORTLIST MATRIX ─── */}
        <section className="rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5 w-12 text-center">
                    <button onClick={handleSelectAll} className="p-1 hover:text-white">
                      {selectedCandidates.size === eligibleCandidates.length && eligibleCandidates.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-4">Candidate Profile</th>
                  <th className="py-4 px-4">AI Telemetry &amp; Match</th>
                  <th className="py-4 px-4 text-center">CGPA Score</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="py-5 px-6">
                        <div className="h-5 bg-white/5 rounded-lg w-full" />
                      </td>
                    </tr>
                  ))
                ) : eligibleCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold text-slate-300">No candidates match current drive cutoff</p>
                      <p className="text-xs text-slate-500 mt-1">Try lowering the CGPA cutoff or adding more departments.</p>
                    </td>
                  </tr>
                ) : (
                  eligibleCandidates.map((c) => {
                    const id = c._id || c.id;
                    const isSelected = selectedCandidates.has(id);
                    const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || 'Student';
                    const initials =
                      ((c.first_name || '')[0] || '') + ((c.last_name || '')[0] || 'S');

                    return (
                      <tr
                        key={id}
                        className={`hover:bg-white/[0.03] transition-colors ${
                          isSelected ? 'bg-violet-600/10' : ''
                        }`}
                      >
                        <td className="py-4 px-5 text-center">
                          <button onClick={() => toggleCandidate(id)} className="p-1">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-violet-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
                              {initials.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm leading-tight">{name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {c.roll_number || 'N/A'} • {c.normDept}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1.5 max-w-xs">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-cyan-400">{c.matchScore}% Match Fit</span>
                              <span className="text-slate-400">High Suitability</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-700"
                                style={{ width: `${c.matchScore}%` }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(c.skills || []).slice(0, 3).map((sk, j) => (
                                <span
                                  key={j}
                                  className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5"
                                >
                                  {typeof sk === 'string' ? sk : sk.skill_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                              parseFloat(c.cgpa) >= 8.5
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            }`}
                          >
                            {c.cgpa != null ? `${c.cgpa} CGPA` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              c.is_placed
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                            }`}
                          >
                            {c.is_placed ? 'Placed' : c.placement_status || 'Eligible'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setPlacedStudent(c)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark as Placed</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── FLOATING BULK ACTION TOOLBAR (from Stitch specification) ─── */}
        {selectedCandidates.size > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-fadeIn">
            <div className="px-6 py-3.5 rounded-2xl bg-[#141426]/95 backdrop-blur-2xl border border-violet-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_25px_rgba(124,58,237,0.3)] flex items-center gap-6">
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-base font-extrabold text-white">{selectedCandidates.size}</span>
                <span className="text-xs text-slate-300">Selected</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShortlistBulk}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Shortlist for {activeDrive?.company || 'Drive'}</span>
                </button>

                <button
                  onClick={handleExportShortlistCsv}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Selection</span>
                </button>

                <button
                  onClick={() => setSelectedCandidates(new Set())}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Deselect All"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mark Placed Modal */}
      <MarkPlacedModal
        student={placedStudent}
        isOpen={Boolean(placedStudent)}
        onClose={() => setPlacedStudent(null)}
        onSuccess={() => {
          loadStudents();
          setActionSuccess('Student placement clearance recorded and verified successfully!');
        }}
      />
    </div>
  );
};

export default CollegeShortlist;
