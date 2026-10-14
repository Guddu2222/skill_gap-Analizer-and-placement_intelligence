import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, Search, Briefcase, Mail, Phone, Github, Linkedin, ExternalLink, Star } from 'lucide-react';
import api from '../services/api';

const RecruiterCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minCGPA, setMinCGPA] = useState('');
  const [dept, setDept] = useState('');
  const [skill, setSkill] = useState('');
  const [shortlistFilter, setShortlistFilter] = useState(false);
  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    api.get('/recruiter-features/candidates', { params: { search, minCGPA, department: dept, skill } })
      .then(r => setCandidates(r.data?.candidates || r.data || []))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, [search, minCGPA, dept, skill]);

  const displayed = candidates.filter(c => !shortlistFilter || saved.has(c._id || c.id));

  const toggleSave = (id) => setSaved(prev => {
    const n = new Set(prev);
    if (n.has(id)) {
      n.delete(id);
    } else {
      n.add(id);
    }
    return n;
  });

  const initials = (c) => [(c.firstName || c.first_name || ''), (c.lastName || c.last_name || '')]
    .filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'C';

  const cgpaColor = (v) => {
    const n = parseFloat(v);
    if (n >= 8) return 'text-emerald-400';
    if (n >= 6) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-64 w-96 h-96 bg-violet-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-violet-400" />
            <h1 className="text-base font-semibold text-white">Candidate Pool</h1>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-semibold border border-violet-500/20">
              {candidates.length} candidates
            </span>
          </div>
          <button
            onClick={() => setShortlistFilter(f => !f)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
              shortlistFilter
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className="w-4 h-4" />
            {shortlistFilter ? 'Show All' : 'My Shortlist'}
            {shortlistFilter && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">
                {saved.size}
              </span>
            )}
          </button>
        </header>

        <div className="flex-1 p-8 space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[rgba(23,23,43,0.7)] backdrop-blur-xl border border-white/8 p-4 rounded-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, roll..."
                className="w-full pl-9 pr-3 py-2 bg-white/5 rounded-xl border border-white/8 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="px-3 py-2 bg-[#17172b] rounded-xl border border-white/8 text-sm text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
            <input
              value={minCGPA}
              onChange={e => setMinCGPA(e.target.value)}
              placeholder="Min CGPA (e.g. 7.5)"
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="px-3 py-2 bg-white/5 rounded-xl border border-white/8 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <input
              value={skill}
              onChange={e => setSkill(e.target.value)}
              placeholder="Filter by skill (e.g. React)..."
              className="px-3 py-2 bg-white/5 rounded-xl border border-white/8 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Candidates Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20 text-slate-500 space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-base font-medium">No candidates match your filters</p>
              <p className="text-xs text-slate-600">Try adjusting your filters or clearing search criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayed.map(c => {
                const id = c._id || c.id;
                const isSaved = saved.has(id);
                const name = [c.firstName || c.first_name, c.lastName || c.last_name].filter(Boolean).join(' ') || 'Candidate';
                return (
                  <div
                    key={id}
                    className="group relative rounded-2xl bg-[rgba(23,23,43,0.85)] border border-white/8 hover:border-violet-500/40 transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                            {initials(c)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white leading-tight">{name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{c.department || 'Student'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSave(id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSaved
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3 bg-white/3 rounded-xl p-2.5 border border-white/5 text-center">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">CGPA</p>
                          <p className={`font-bold text-sm ${cgpaColor(c.cgpa)}`}>{c.cgpa ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Grad Year</p>
                          <p className="font-bold text-sm text-white">{c.graduationYear || c.graduation_year || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      {c.skills && c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {c.skills.slice(0, 5).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-xs border border-white/8"
                            >
                              {typeof s === 'string' ? s : s.name}
                            </span>
                          ))}
                          {c.skills.length > 5 && (
                            <span className="text-xs text-slate-500 self-center">+{c.skills.length - 5}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Contact */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        {c.email && (
                          <a href={`mailto:${c.email}`} title={c.email} className="hover:text-violet-400 transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {c.github && (
                          <a href={c.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {c.linkedin && (
                          <a href={c.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{c.collegeName || c.college || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecruiterCandidates;