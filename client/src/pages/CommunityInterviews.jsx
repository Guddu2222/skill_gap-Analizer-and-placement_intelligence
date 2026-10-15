import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import {
  Sparkles,
  Building2,
  Award,
  Search,
  Plus,
  ThumbsUp,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Layers,
  ChevronRight,
  Filter,
  X,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Share2,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import {
  fetchInterviewExperiences,
  shareInterviewExperience,
  upvoteInterviewExperience,
} from '../services/api';
import { STANDARD_DEPARTMENTS } from '../constants/departments';

const ShareExperienceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: 'Software Development Engineer I',
    studentName: '',
    batch: new Date().getFullYear(),
    department: STANDARD_DEPARTMENTS[0],
    packageOffered: '',
    difficulty: 'Medium',
    outcome: 'Selected',
    tips: '',
  });

  const [rounds, setRounds] = useState([
    {
      roundName: 'Round 1: Online Assessment',
      questions: '',
      description: 'HackerRank / LeetCode test with 2 DSA questions.',
    },
    {
      roundName: 'Round 2: Technical Interview',
      questions: '',
      description: 'Live coding on data structures and algorithms.',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddRound = () => {
    setRounds([
      ...rounds,
      {
        roundName: `Round ${rounds.length + 1}: Technical / Managerial`,
        questions: '',
        description: '',
      },
    ]);
  };

  const handleRemoveRound = (idx) => {
    setRounds(rounds.filter((_, i) => i !== idx));
  };

  const handleRoundChange = (idx, field, value) => {
    const updated = [...rounds];
    updated[idx][field] = value;
    setRounds(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      setError('Please provide company and job role.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const formattedRounds = rounds.map((r) => ({
        ...r,
        questions: typeof r.questions === 'string'
          ? r.questions.split('\n').map((q) => q.trim()).filter(Boolean)
          : r.questions,
      }));

      await shareInterviewExperience({
        ...formData,
        batch: parseInt(formData.batch, 10),
        rounds: formattedRounds,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error sharing experience:', err);
      setError(err.response?.data?.error || 'Failed to submit experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#17172b] border border-white/10 rounded-2xl shadow-2xl p-6 text-white space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar-dark">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Share Interview Experience</h2>
              <p className="text-xs text-slate-400">Help the collegiate cohort conquer tech rounds</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Hiring Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Google, Microsoft, Amazon..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Job Role / Designation *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Software Development Engineer I"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                CTC Package (Optional)
              </label>
              <input
                type="text"
                value={formData.packageOffered}
                onChange={(e) => setFormData({ ...formData, packageOffered: e.target.value })}
                placeholder="e.g. 28.5 LPA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                <option value="Easy" className="bg-[#17172b]">Easy</option>
                <option value="Medium" className="bg-[#17172b]">Medium</option>
                <option value="Hard" className="bg-[#17172b]">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Final Outcome
              </label>
              <select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                <option value="Selected" className="bg-[#17172b]">Selected (Offer)</option>
                <option value="Rejected" className="bg-[#17172b]">Rejected</option>
                <option value="Pending" className="bg-[#17172b]">Pending / In Progress</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Leave blank for Anonymous"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              >
                {STANDARD_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#17172b]">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Rounds Builder */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Interview Rounds Breakdown
              </label>
              <button
                type="button"
                onClick={handleAddRound}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Round</span>
              </button>
            </div>

            <div className="space-y-3">
              {rounds.map((round, idx) => (
                <div key={idx} className="p-3.5 bg-white/5 border border-white/8 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={round.roundName}
                      onChange={(e) => handleRoundChange(idx, 'roundName', e.target.value)}
                      placeholder="e.g. Round 1: OA / Technical"
                      className="px-2.5 py-1 rounded-lg bg-[#0f0f1a] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500 w-2/3"
                    />
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRound(idx)}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={round.questions}
                      onChange={(e) => handleRoundChange(idx, 'questions', e.target.value)}
                      placeholder="Specific questions asked (One question per line)..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Breakthrough Tips & Strategy
            </label>
            <textarea
              rows={3}
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              placeholder="What made the difference? Topics to focus on, edge cases, questions to ask the interviewer..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Publish Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommunityInterviews = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedOutcome, setSelectedOutcome] = useState('All');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [upvotedIds, setUpvotedIds] = useState(new Set());

  const loadExperiences = () => {
    setLoading(true);
    fetchInterviewExperiences({
      company: selectedCompany,
      difficulty: selectedDifficulty,
      outcome: selectedOutcome,
      search,
    })
      .then((data) => {
        setExperiences(data?.experiences || []);
      })
      .catch((err) => {
        console.error('Error fetching experiences:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadExperiences();
  }, [selectedCompany, selectedDifficulty, selectedOutcome]);

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id)) return;
    try {
      const res = await upvoteInterviewExperience(id);
      setUpvotedIds(new Set([...upvotedIds, id]));
      setExperiences((prev) =>
        prev.map((exp) => (exp._id === id ? { ...exp, upvotes: res.upvotes } : exp))
      );
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const companiesList = ['All', 'Google', 'Microsoft', 'Amazon', 'Atlassian', 'TCS', 'Infosys'];

  const stats = useMemo(() => {
    const total = experiences.length;
    const selectedCount = experiences.filter((e) => e.outcome === 'Selected').length;
    const hardCount = experiences.filter((e) => e.difficulty === 'Hard').length;
    return { total, selectedCount, hardCount };
  }, [experiences]);

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar role="student" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/85 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Community Interview Debriefs</h1>
              <p className="text-[11px] text-slate-400">Real rounds, question leaks, and preparation roadmaps</p>
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
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Share Experience</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* KPI Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Shared Experiences
              </span>
              <p className="text-3xl font-extrabold text-white">{stats.total || '2,450+'}</p>
              <p className="text-xs text-slate-500 mt-1">Verified candidate logs</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Verified Offers
              </span>
              <p className="text-3xl font-extrabold text-emerald-400">{stats.selectedCount || '840'}</p>
              <p className="text-xs text-slate-500 mt-1">High conversion debriefs</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Prep Velocity
              </span>
              <p className="text-3xl font-extrabold text-cyan-400">18.4 Days</p>
              <p className="text-xs text-slate-500 mt-1">Average time to crack OA</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/80 backdrop-blur-md border border-white/8 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Hard Rounds Logged
              </span>
              <p className="text-3xl font-extrabold text-amber-400">{stats.hardCount || 42}</p>
              <p className="text-xs text-slate-500 mt-1">Bar raisers & system design</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-[#17172b]/90 backdrop-blur-xl border border-white/8 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadExperiences()}
                  placeholder="Search company, role, or questions..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  value={selectedOutcome}
                  onChange={(e) => setSelectedOutcome(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="All">All Outcomes</option>
                  <option value="Selected">Selected (Offer)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Company Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Company:
              </span>
              {companiesList.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCompany === comp
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Experiences Grid */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#17172b]/50 border border-white/5">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-bold text-base">No Interview Debriefs Found</p>
              <p className="text-slate-400 text-xs mt-1">
                Be the pioneer and click "+ Share Experience" to log your placement rounds!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  className="relative rounded-2xl bg-[#17172b]/85 hover:bg-[#17172b] backdrop-blur-md border border-white/8 hover:border-violet-500/40 p-6 transition-all shadow-xl space-y-4 group"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/20">
                        {exp.company[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                            {exp.company}
                          </h3>
                          <span className="text-slate-400 text-sm">• {exp.role}</span>
                          {exp.packageOffered && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {exp.packageOffered}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Candidate: <span className="text-slate-300 font-medium">{exp.studentName || 'Anonymous Scholar'}</span> ({exp.department}, Batch {exp.batch})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          exp.outcome === 'Selected'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : exp.outcome === 'Rejected'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {exp.outcome === 'Selected' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : exp.outcome === 'Rejected' ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{exp.outcome}</span>
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          exp.difficulty === 'Hard'
                            ? 'bg-red-500/10 text-red-400 border-red-500/25'
                            : exp.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25'
                        }`}
                      >
                        {exp.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Rounds Stepper / Timeline */}
                  {Array.isArray(exp.rounds) && exp.rounds.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        Rounds Progression & Questions Asked
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exp.rounds.map((rnd, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-violet-300">
                              <span>{rnd.roundName}</span>
                              <span className="text-[10px] text-slate-500">Step {idx + 1}</span>
                            </div>
                            {rnd.description && (
                              <p className="text-[11px] text-slate-400">{rnd.description}</p>
                            )}
                            {Array.isArray(rnd.questions) && rnd.questions.length > 0 && (
                              <div className="space-y-1 pt-1">
                                {rnd.questions.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    className="p-2 rounded-lg bg-[#0f0f1a] border border-white/5 text-xs text-slate-200 flex items-start gap-2 font-mono"
                                  >
                                    <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                    <span className="font-sans leading-relaxed">{q}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidate Tips */}
                  {exp.tips && (
                    <div className="p-3.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">Top Breakthrough Strategy:</span>
                        <span>{exp.tips}</span>
                      </div>
                    </div>
                  )}

                  {/* Card Bottom / Upvote Action */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500">
                      Logged {new Date(exp.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleUpvote(exp._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        upvotedIds.has(exp._id)
                          ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{exp.upvotes || 0} Found Helpful</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ShareExperienceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSuccess={() => loadExperiences()}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onUnreadCountChange={(c) => setUnreadCount(c)}
      />
    </div>
  );
};

export default CommunityInterviews;
