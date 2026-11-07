import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import {
  Sparkles,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  Briefcase,
  Building2,
  GraduationCap,
  Star,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  Plus,
  X,
  ChevronDown,
  SlidersHorizontal,
  Video,
  Award,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import {
  runSmartShortlist,
  scheduleSmartInterviews,
  saveCandidate,
} from "../services/api";

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const SmartShortlist = () => {
  // Master state
  const [jobs, setJobs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [targetSkills, setTargetSkills] = useState([
    "React",
    "Node.js",
    "MongoDB",
    "Python",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [unplacedOnly, setUnplacedOnly] = useState(true);

  // Search results
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(new Set());
  const [savedCandidateIds, setSavedCandidateIds] = useState(new Set());

  // Logistics & Schedule state
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const [interviewDate, setInterviewDate] = useState(tomorrow);
  const [interviewStartTime, setInterviewStartTime] = useState("10:00");
  const [slotDuration, setSlotDuration] = useState("45");
  const [panels, setPanels] = useState(["Panel Alpha (Tech)", "Panel Beta (Tech)"]);
  const [newPanelInput, setNewPanelInput] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState(null);
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState("");

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [jobsRes, collegesRes] = await Promise.all([
        apiCall("get", "/jobs").catch((err) => {
          console.error("Error loading jobs in SmartShortlist:", err);
          return { data: [] };
        }),
        apiCall("get", "/colleges").catch((err) => {
          console.error("Error loading colleges in SmartShortlist:", err);
          return { data: [] };
        }),
      ]);
      setJobs(jobsRes.data || []);
      const collegesList = Array.isArray(collegesRes.data)
        ? collegesRes.data
        : collegesRes.data?.colleges || [];
      setColleges(collegesList);

      // Run initial shortlist with default targetSkills
      await executeShortlist({
        targetSkills: ["React", "Node.js", "MongoDB", "Python"],
        minCgpa: 7.0,
        unplacedOnly: true,
      });
    } catch (err) {
      console.error("Error loading initial shortlist data:", err);
    } finally {
      setLoading(false);
    }
  };

  const executeShortlist = async (overrideParams = {}) => {
    setLoading(true);
    try {
      const payload = {
        jobId: selectedJobId || undefined,
        targetSkills: overrideParams.targetSkills || targetSkills,
        minCgpa: overrideParams.minCgpa !== undefined ? overrideParams.minCgpa : minCgpa,
        collegeId: selectedCollegeId || undefined,
        placementStatusFilter: (overrideParams.unplacedOnly !== undefined ? overrideParams.unplacedOnly : unplacedOnly) ? "unplaced" : "all",
        limit: 30,
      };

      const res = await runSmartShortlist(payload);
      if (res && res.candidates) {
        setCandidates(res.candidates);
        // Pre-select top 3 by default
        const topIds = new Set(res.candidates.slice(0, 3).map((c) => c.id));
        setSelectedCandidateIds(topIds);
      }
    } catch (err) {
      console.error("Smart Shortlist execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Job selection changes skills automatically
  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    if (!jobId) return;

    const job = jobs.find((j) => j._id === jobId);
    if (job && Array.isArray(job.requirements) && job.requirements.length > 0) {
      const cleanReqs = job.requirements.map((r) => r.trim()).filter(Boolean);
      setTargetSkills(cleanReqs);
      executeShortlist({ targetSkills: cleanReqs });
    }
  };

  // Skills tag management
  const addSkill = () => {
    const s = newSkillInput.trim();
    if (s && !targetSkills.includes(s)) {
      const updated = [...targetSkills, s];
      setTargetSkills(updated);
      setNewSkillInput("");
      executeShortlist({ targetSkills: updated });
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = targetSkills.filter((s) => s !== skillToRemove);
    setTargetSkills(updated);
    executeShortlist({ targetSkills: updated });
  };

  // Candidate selection for interview
  const toggleSelectCandidate = (id) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCandidateIds.size === candidates.length) {
      setSelectedCandidateIds(new Set());
    } else {
      setSelectedCandidateIds(new Set(candidates.map((c) => c.id)));
    }
  };

  // Save Candidate
  const handleSaveCandidate = async (candidate) => {
    try {
      await saveCandidate(candidate.id, "Smart Shortlist", `Match score: ${candidate.overallScore}%`);
      setSavedCandidateIds((prev) => new Set([...prev, candidate.id]));
    } catch (err) {
      console.error("Error saving candidate:", err);
    }
  };

  // Panel Management
  const addPanel = () => {
    if (newPanelInput.trim() && !panels.includes(newPanelInput.trim())) {
      setPanels([...panels, newPanelInput.trim()]);
      setNewPanelInput("");
    }
  };

  const removePanel = (panelName) => {
    if (panels.length <= 1) return;
    setPanels(panels.filter((p) => p !== panelName));
  };

  // Schedule Generation
  const handleAutoSchedule = async () => {
    const selectedList = candidates.filter((c) => selectedCandidateIds.has(c.id));
    if (selectedList.length === 0) {
      alert("Please select at least one candidate to schedule interviews.");
      return;
    }

    setSchedulingLoading(true);
    setScheduleSuccessMsg("");
    try {
      const res = await scheduleSmartInterviews({
        candidates: selectedList.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
        })),
        date: interviewDate,
        startTime: interviewStartTime,
        slotDurationMinutes: parseInt(slotDuration),
        panels,
        driveTitle: jobs.find((j) => j._id === selectedJobId)?.title || "Campus Placement Interview",
      });

      if (res && res.schedule) {
        setSchedule(res.schedule);
        setScheduleSuccessMsg(`Successfully scheduled ${res.count} candidates & dispatched student notifications!`);
      }
    } catch (err) {
      console.error("Error auto-scheduling interviews:", err);
      alert("Failed to auto-schedule interviews. Please verify settings.");
    } finally {
      setSchedulingLoading(false);
    }
  };

  const copyMeetLink = (link, idx) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkIndex(idx);
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  // Metrics summary
  const topMatchCount = candidates.filter((c) => c.overallScore >= 80).length;
  const avgJoiningProb =
    candidates.length > 0
      ? Math.round(candidates.reduce((a, b) => a + (b.joiningProbability || 0), 0) / candidates.length)
      : 75;

  return (
    <div className="flex bg-[#0c0c1d] min-h-screen font-sans text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-cyan-600/8 rounded-full blur-[140px]" />
      </div>

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Smart Shortlisting & AI Logistics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                AI Match Engine
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Evaluate real candidate competencies against job criteria, predict joining probability, and auto-schedule interview panels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => executeShortlist()}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Evaluating..." : "Run AI Shortlist"}
            </button>
          </div>
        </header>

        {/* Filter & Matching Hub */}
        <div className="bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-2xl p-5 mb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Match Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Target Job Role
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">Custom Criteria / All Roles</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            </div>

            {/* Institution Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> College Campus
              </label>
              <select
                value={selectedCollegeId}
                onChange={(e) => {
                  setSelectedCollegeId(e.target.value);
                  executeShortlist();
                }}
                className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">All Partner Institutions</option>
                {colleges.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} {c.tier ? `(${c.tier})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum CGPA */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Min CGPA Cutoff
                </label>
                <span className="text-xs font-bold text-amber-400">{minCgpa}</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.5"
                step="0.1"
                value={minCgpa}
                onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                onMouseUp={() => executeShortlist()}
                className="w-full accent-violet-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
            </div>

            {/* Unplaced only toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-sm hover:border-white/20 transition-colors select-none">
                <input
                  type="checkbox"
                  checked={unplacedOnly}
                  onChange={(e) => {
                    setUnplacedOnly(e.target.checked);
                    executeShortlist({ unplacedOnly: e.target.checked });
                  }}
                  className="rounded accent-violet-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-300 text-xs font-medium">Unplaced Candidates Only</span>
              </label>
            </div>
          </div>

          {/* Target Skills Pill Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Required Competencies (Weighted Match)
              </label>
              <span className="text-[11px] text-slate-500">
                Skills dynamically match against candidate proficiency levels
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 bg-[#121226] border border-white/10 rounded-xl p-2.5">
              {targetSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/15 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium"
                >
                  {sk}
                  <button
                    onClick={() => removeSkill(sk)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1 ml-auto">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Docker, Redis)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className="bg-transparent text-xs text-white placeholder-slate-500 px-2 py-1 focus:outline-none border-b border-transparent focus:border-violet-500 w-44"
                />
                <button
                  onClick={addSkill}
                  className="p-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/60 text-violet-300 hover:text-white transition-all text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[rgba(20,20,38,0.5)] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{candidates.length}</p>
              <p className="text-xs text-slate-400">Evaluated Candidates</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.5)] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">{topMatchCount}</p>
              <p className="text-xs text-slate-400">Top Matches (&gt;=80%)</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.5)] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-cyan-400">{avgJoiningProb}%</p>
              <p className="text-xs text-slate-400">Avg Joining Probability</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.5)] border border-white/6 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-indigo-400">
                {selectedCandidateIds.size}
              </p>
              <p className="text-xs text-slate-400">Selected for Schedule</p>
            </div>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Candidates Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-[rgba(20,20,38,0.6)] border border-white/8 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    candidates.length > 0 &&
                    selectedCandidateIds.size === candidates.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded accent-violet-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Select All ({candidates.length})
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {selectedCandidateIds.size} queued for interview
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-[rgba(20,20,38,0.4)] border border-white/5 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-[rgba(20,20,38,0.4)] border border-white/8 rounded-2xl p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  No matching candidates found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try lowering the CGPA cutoff or relaxing required skills in the filter bar above.
                </p>
              </div>
            ) : (
              candidates.map((candidate) => {
                const isSelected = selectedCandidateIds.has(candidate.id);
                const isSaved = savedCandidateIds.has(candidate.id);

                return (
                  <div
                    key={candidate.id}
                    className={`bg-[rgba(20,20,38,0.6)] backdrop-blur-md border rounded-2xl p-5 transition-all duration-200 hover:border-violet-500/40 ${
                      isSelected
                        ? "border-violet-500/60 shadow-lg shadow-violet-500/10 bg-[rgba(27,24,55,0.7)]"
                        : "border-white/8"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCandidate(candidate.id)}
                        className="mt-1 rounded accent-violet-500 w-4 h-4 cursor-pointer"
                      />

                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-violet-600/20 flex-shrink-0">
                        {candidate.name.charAt(0)}
                      </div>

                      {/* Middle Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold text-white tracking-tight truncate">
                            {candidate.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                              candidate.overallScore >= 80
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                : candidate.overallScore >= 65
                                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                            }`}
                          >
                            {candidate.matchBadge} ({candidate.overallScore}%)
                          </span>

                          <span className="text-xs text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                            CGPA {candidate.cgpa}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 flex-wrap">
                          <span>{candidate.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {candidate.college?.name || "Partner Institute"}
                          </span>
                        </div>

                        {/* Matched vs Missing Skills */}
                        <div className="space-y-1.5 mb-3">
                          {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                Matches:
                              </span>
                              {candidate.matchedSkills.slice(0, 5).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px]"
                                >
                                  ✓ {sk}
                                </span>
                              ))}
                            </div>
                          )}

                          {candidate.missingSkills && candidate.missingSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Missing:
                              </span>
                              {candidate.missingSkills.slice(0, 3).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[11px]"
                                >
                                  ✕ {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Risk Factors / Probability Indicator */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Joining Probability:</span>
                            <span
                              className={`font-bold ${
                                candidate.joiningProbability >= 75
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {candidate.joiningProbability}%
                            </span>
                            {candidate.riskFactors && candidate.riskFactors.length > 0 && (
                              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {candidate.riskFactors[0]}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveCandidate(candidate)}
                              disabled={isSaved}
                              className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 cursor-pointer ${
                                isSaved
                                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              <Bookmark className="w-3 h-3" />
                              {isSaved ? "Saved" : "Save"}
                            </button>

                            {candidate.resumeUrl && (
                              <a
                                href={candidate.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1"
                              >
                                Resume <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Scheduling Logistics Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-6">
            <div className="bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/8">
                <Clock className="w-5 h-5 text-violet-400" />
                <div>
                  <h2 className="text-base font-bold text-white">
                    Auto-Schedule Logistics
                  </h2>
                  <p className="text-xs text-slate-400">
                    Automate panel slots and dispatch instant student interview alerts.
                  </p>
                </div>
              </div>

              {/* Schedule Form */}
              <div className="space-y-4 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Interview Date
                    </label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={interviewStartTime}
                      onChange={(e) => setInterviewStartTime(e.target.value)}
                      className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Slot Duration per Candidate
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="30">30 Minutes (Quick Screen)</option>
                    <option value="45">45 Minutes (Standard Technical)</option>
                    <option value="60">60 Minutes (In-depth Coding)</option>
                  </select>
                </div>

                {/* Interview Panels */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Interview Panels (Load Balanced)
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {panels.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 rounded-lg text-xs"
                      >
                        {p}
                        {panels.length > 1 && (
                          <button
                            onClick={() => removePanel(p)}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add panel name..."
                      value={newPanelInput}
                      onChange={(e) => setNewPanelInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPanel()}
                      className="flex-1 bg-[#121226] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <button
                      onClick={addPanel}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-slate-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAutoSchedule}
                disabled={schedulingLoading || selectedCandidateIds.size === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                {schedulingLoading
                  ? "Generating Logistics..."
                  : `Schedule ${selectedCandidateIds.size} Candidates & Notify`}
              </button>

              {scheduleSuccessMsg && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{scheduleSuccessMsg}</span>
                </div>
              )}

              {/* Schedule Results Timeline */}
              <div className="mt-6 pt-5 border-t border-white/8">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Generated Schedule Timeline</span>
                  {schedule.length > 0 && (
                    <span className="text-[11px] text-violet-400 normal-case font-normal">
                      {schedule.length} slots booked
                    </span>
                  )}
                </h3>

                {schedule.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No interviews generated yet.
                    <br />
                    Select candidates on the left and click Schedule.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar-dark">
                    {schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#121226] border border-white/8 rounded-xl p-3.5 space-y-2 hover:border-violet-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">
                            {item.candidateName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 text-xs font-semibold">
                            {item.time}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{item.panel}</span>
                          <span className="text-slate-500">{item.date}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <a
                            href={item.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium truncate max-w-[200px]"
                          >
                            <Video className="w-3.5 h-3.5 flex-shrink-0" />
                            Join Video Room
                          </a>

                          <button
                            onClick={() => copyMeetLink(item.meetLink, idx)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                          >
                            {copiedLinkIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartShortlist;
