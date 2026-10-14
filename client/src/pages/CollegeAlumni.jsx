import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import {
  GraduationCap,
  Users,
  Building2,
  Briefcase,
  Search,
  Plus,
  Linkedin,
  Mail,
  Award,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter,
  X,
  Calendar,
  Layers,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { fetchAlumniList, addAlumniMentor } from '../services/api';
import { STANDARD_DEPARTMENTS } from '../constants/departments';

const AddAlumniModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    batch: new Date().getFullYear() - 2,
    department: STANDARD_DEPARTMENTS[0],
    linkedInProfile: '',
    skills: '',
    isMentor: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.role) {
      setError('Please fill in candidate name, company, and current role.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addAlumniMentor({
        ...formData,
        batch: parseInt(formData.batch, 10),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding alumni mentor:', err);
      setError(err.response?.data?.error || 'Failed to add alumni mentor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#17172b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 text-white space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Add Notable Alumni Mentor</h2>
              <p className="text-xs text-slate-400">Enrich the collegiate industry mentorship ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work / Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="priya.sharma@microsoft.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google, Microsoft, Adobe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Graduation Batch
              </label>
              <input
                type="number"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                min="1990"
                max={new Date().getFullYear()}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                {STANDARD_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#17172b]">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedInProfile}
              onChange={(e) => setFormData({ ...formData, linkedInProfile: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Expertise & Domains (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="Distributed Systems, Cloud Architecture, Python, Mentorship, System Design"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/8 transition-colors">
            <input
              type="checkbox"
              checked={formData.isMentor}
              onChange={(e) => setFormData({ ...formData, isMentor: e.target.checked })}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 focus:ring-offset-0 bg-[#0f0f1a] border-white/20"
            />
            <div>
              <p className="text-xs font-semibold text-white">Active Student Mentor</p>
              <p className="text-[11px] text-slate-400">Available to guide students through career roadmaps and mock interviews</p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? 'Saving...' : 'Add Alumni Mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CollegeAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [filterMentorOnly, setFilterMentorOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const loadAlumni = () => {
    setLoading(true);
    fetchAlumniList()
      .then((data) => {
        setAlumni(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error fetching alumni:', err);
        setAlumni([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAlumni();
  }, []);

  const stats = useMemo(() => {
    const total = alumni.length;
    const mentors = alumni.filter((a) => a.isMentor).length;
    const companies = new Set(alumni.map((a) => a.company).filter(Boolean)).size;
    const batches = alumni.map((a) => a.batch).filter(Boolean);
    const minBatch = batches.length > 0 ? Math.min(...batches) : 2018;
    return { total, mentors, companies, minBatch };
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        a.name?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        a.role?.toLowerCase().includes(q) ||
        (Array.isArray(a.skills) && a.skills.some((sk) => sk.toLowerCase().includes(q)));

      const matchDept = selectedDept === 'All' || a.department === selectedDept;
      const matchMentor = !filterMentorOnly || a.isMentor;

      return matchSearch && matchDept && matchMentor;
    });
  }, [alumni, search, selectedDept, filterMentorOnly]);

  const initials = (name) => {
    return (name || 'Alumni')
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/85 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Alumni & Mentor Network</h1>
              <p className="text-[11px] text-slate-400">Industry leadership and student mentorship bridge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notable Alumni</span>
            </button>
          </div>
        </header>

        {/* Success Toast */}
        {toastMsg && (
          <div className="mx-8 mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Alumni</span>
                <Users className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{stats.total}</p>
              <p className="text-xs text-slate-500 mt-1">Spanning batches {stats.minBatch} - 2024</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Mentors</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">{stats.mentors}</p>
              <p className="text-xs text-slate-500 mt-1">Available for 1:1 guidance & mock interviews</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hiring Companies</span>
                <Building2 className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-extrabold text-cyan-400">{stats.companies}</p>
              <p className="text-xs text-slate-500 mt-1">MNCs, Unicorns & Global Tech</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Influence</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">92%</p>
              <p className="text-xs text-slate-500 mt-1">Direct referral & mentorship impact</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-[#17172b]/90 backdrop-blur-xl border border-white/8 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, role, or skill..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Dept:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="All" className="bg-[#17172b]">All Departments</option>
                  {STANDARD_DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-[#17172b]">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mentor Toggle */}
              <button
                onClick={() => setFilterMentorOnly(!filterMentorOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  filterMentorOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mentors Only</span>
              </button>
            </div>
          </div>

          {/* Alumni Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#17172b]/50 border border-white/5">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-bold text-base">No Alumni Profiles Found</p>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                {search || selectedDept !== 'All' || filterMentorOnly
                  ? 'Try clearing your active search filters.'
                  : 'Get started by clicking "+ Add Notable Alumni" to showcase career leaders.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAlumni.map((alum) => (
                <div
                  key={alum._id || alum.id || alum.email}
                  className="group relative rounded-2xl bg-[#17172b]/80 hover:bg-[#17172b] backdrop-blur-md border border-white/8 hover:border-violet-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                          {initials(alum.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight group-hover:text-violet-300 transition-colors">
                            {alum.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{alum.role}</p>
                          <p className="text-[11px] text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {alum.company}
                          </p>
                        </div>
                      </div>

                      {alum.isMentor && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Mentor
                        </span>
                      )}
                    </div>

                    {/* Metadata badges */}
                    <div className="flex items-center gap-2 mb-4 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                        Class of {alum.batch || '2023'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 truncate max-w-[160px]">
                        {alum.department || 'Computer Science & Engineering'}
                      </span>
                    </div>

                    {/* Skills / Expertise */}
                    {Array.isArray(alum.skills) && alum.skills.length > 0 && (
                      <div className="mb-5">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Domain Focus
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {alum.skills.slice(0, 4).map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 text-[10px] font-medium border border-violet-500/20"
                            >
                              {sk}
                            </span>
                          ))}
                          {alum.skills.length > 4 && (
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-500 text-[10px]">
                              +{alum.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {alum.email ? (
                      <a
                        href={`mailto:${alum.email}`}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600">No email</span>
                    )}

                    {alum.linkedInProfile && (
                      <a
                        href={alum.linkedInProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all hover:scale-105"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>Connect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AddAlumniModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadAlumni();
          setToastMsg('Notable alumni mentor added successfully!');
          setTimeout(() => setToastMsg(null), 4000);
        }}
      />
    </div>
  );
};

export default CollegeAlumni;
