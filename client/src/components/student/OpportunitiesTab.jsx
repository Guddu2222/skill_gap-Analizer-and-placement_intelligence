import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Target,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Globe,
  Search,
  SlidersHorizontal,
  X,
  Building2,
} from "lucide-react";
import api from "../../services/api"; // Assuming axios instance is configured

// Smart timeline & hiring status helper (SaaS-friendly relative timestamps)
const getHiringTimeline = (job) => {
  const now = new Date();

  // 1. Check if job has a valid future deadline
  if (job.deadline) {
    const deadlineDate = new Date(job.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0 && diffDays <= 7) {
        return {
          label: `Closes in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
          isUrgent: true,
          type: "deadline",
        };
      }
      if (diffDays > 7 && diffDays <= 60) {
        return {
          label: `Closes ${deadlineDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}`,
          isUrgent: false,
          type: "deadline",
        };
      }
    }
  }

  // 2. If deadline is in the past, expired, or missing, use createdAt for relative time
  if (job.createdAt) {
    const createdDate = new Date(job.createdAt);
    if (!isNaN(createdDate.getTime())) {
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return { label: "Posted today", isUrgent: false, type: "posted" };
      }
      if (diffDays === 1) {
        return { label: "Posted yesterday", isUrgent: false, type: "posted" };
      }
      if (diffDays < 14) {
        return { label: `Posted ${diffDays}d ago`, isUrgent: false, type: "posted" };
      }
      if (diffDays < 30) {
        return {
          label: `Posted ${Math.floor(diffDays / 7)}w ago`,
          isUrgent: false,
          type: "posted",
        };
      }
    }
  }

  // 3. Fallback for rolling / active opportunities (prevents showing stale or expired past dates)
  return { label: "Actively Hiring • Rolling", isUrgent: false, type: "rolling" };
};

const OpportunitiesTab = ({ student }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Phase 3: Filters & Search state
  const [sourceFilter, setSourceFilter] = useState("all"); // "all" | "campus" | "external"
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all"); // "all" | "Full Time" | "Internship"
  const [minMatchScore, setMinMatchScore] = useState(0); // 0 | 50 | 80

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/jobs/opportunities");
      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error("Match error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Could not load your opportunities at this time."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [student?.skills]);

  const handleSyncJobs = async () => {
    try {
      setSyncing(true);
      await api.post("/jobs/sync");
      await fetchOpportunities();
    } catch (err) {
      console.error("Job sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const campusCount = useMemo(
    () => opportunities.filter((j) => j.source !== "remotive" && j.source !== "external").length,
    [opportunities]
  );

  const externalCount = useMemo(
    () => opportunities.filter((j) => j.source === "remotive" || j.source === "external").length,
    [opportunities]
  );

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((job) => {
      // Source filter
      if (sourceFilter === "campus" && (job.source === "remotive" || job.source === "external")) {
        return false;
      }
      if (sourceFilter === "external" && job.source !== "remotive" && job.source !== "external") {
        return false;
      }

      // Job type filter
      if (jobTypeFilter !== "all") {
        const type = (job.jobType || "").toLowerCase();
        if (jobTypeFilter === "Internship" && !type.includes("intern")) return false;
        if (jobTypeFilter === "Full Time" && type.includes("intern")) return false;
      }

      // Match score filter
      if (minMatchScore > 0 && (job.matchScore || 0) < minMatchScore) {
        return false;
      }

      // Search query (title, company, location, requirements)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = job.title?.toLowerCase().includes(q);
        const inCompany = job.company?.toLowerCase().includes(q);
        const inLocation = job.location?.toLowerCase().includes(q);
        const inSkills = (job.requirements || []).some((r) => r.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inLocation && !inSkills) {
          return false;
        }
      }

      return true;
    });
  }, [opportunities, sourceFilter, jobTypeFilter, minMatchScore, searchQuery]);

  const isFiltered =
    searchQuery.trim() !== "" ||
    jobTypeFilter !== "all" ||
    minMatchScore > 0 ||
    sourceFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setJobTypeFilter("all");
    setMinMatchScore(0);
    setSourceFilter("all");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">
          AI is matching your skills with open roles...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <p className="font-medium">{error}</p>
      </div>
    );

  if (opportunities.length === 0)
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center">
        <Briefcase className="w-16 h-16 text-slate-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          No Match Found Yet
        </h3>
        <p className="text-slate-500 max-w-md">
          We couldn't find internships or jobs that align closely with your
          current skill profile. Keep upskilling and improving your Readiness
          Score!
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Smart Job Matches
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Live AI Engine
            </span>
          </h2>
          <p className="text-slate-500 text-sm">
            Opportunities dynamically ranked by how well they match your real-time skill profile.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncJobs}
            disabled={syncing || loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
            title="Fetch and sync fresh live openings from tech job networks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-indigo-600" : ""}`} />
            {syncing ? "Syncing Feed..." : "Sync Live Jobs"}
          </button>
          <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-sm border border-indigo-100">
            {filteredOpportunities.length} of {opportunities.length} Matches
          </span>
        </div>
      </div>

      {/* Phase 3: Segmented Source Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSourceFilter("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            sourceFilter === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          All Roles
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              sourceFilter === "all" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {opportunities.length}
          </span>
        </button>

        <button
          onClick={() => setSourceFilter("campus")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            sourceFilter === "campus"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Campus Drives
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              sourceFilter === "campus" ? "bg-purple-800 text-white" : "bg-purple-50 text-purple-700"
            }`}
          >
            {campusCount}
          </span>
        </button>

        <button
          onClick={() => setSourceFilter("external")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            sourceFilter === "external"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Live Web Openings
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              sourceFilter === "external" ? "bg-blue-800 text-white" : "bg-blue-50 text-blue-700"
            }`}
          >
            {externalCount}
          </span>
        </button>
      </div>

      {/* Phase 3: Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, companies, or required skills (e.g. React, Zoho, Remote)..."
            className="w-full pl-10 pr-9 py-2 bg-white rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Job Type Selector */}
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Role Types</option>
            <option value="Full Time">Full Time Only</option>
            <option value="Internship">Internships Only</option>
          </select>

          {/* Match Score Selector */}
          <select
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="0">All Match Scores</option>
            <option value="50">50%+ Match</option>
            <option value="80">80%+ Strong Fit</option>
          </select>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Grid / Empty Filter State */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No matching opportunities found
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mb-4">
            Try adjusting your search keywords, source tab, or match score filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((job) => {
            const timeline = getHiringTimeline(job);
            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div className="flex items-start gap-3">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-100/50 flex items-center justify-center text-indigo-700 font-bold text-base shrink-0">
                        {job.company?.[0]?.toUpperCase() || "J"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-slate-500 font-medium text-sm">{job.company}</p>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/80">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Actively Hiring
                        </span>
                        {job.source === "remotive" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            <Globe className="w-3 h-3 text-blue-500" /> Live Web
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                            <Briefcase className="w-3 h-3 text-purple-500" /> Campus Drive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm shrink-0 ${
                      job.matchScore >= 80
                        ? "bg-emerald-100 text-emerald-700"
                        : job.matchScore >= 50
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    {job.matchScore}% Match
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400" />{" "}
                    {job.location || "Remote"}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 capitalize">
                    <Briefcase className="w-4 h-4 text-slate-400" />{" "}
                    {job.jobType?.replace("_", " ") || "Full Time"}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <DollarSign className="w-4 h-4 text-slate-400" /> {job.salary}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements?.slice(0, 6).map((req, idx) => {
                      const isMissing = job.missingSkills?.includes(req);
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                            isMissing
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1"
                          }`}
                        >
                          {!isMissing && <CheckCircle2 className="w-3 h-3" />}
                          {req}
                        </span>
                      );
                    })}
                    {job.requirements?.length > 6 && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-500">
                        +{job.requirements.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    {timeline.isUrgent ? (
                      <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span
                      className={`text-xs ${
                        timeline.isUrgent
                          ? "text-amber-600 font-semibold"
                          : "text-slate-500 font-medium"
                      }`}
                    >
                      {timeline.label}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const targetUrl =
                        job.applyUrl ||
                        `https://www.google.com/search?q=${encodeURIComponent(
                          `${job.company} ${job.title} careers apply`
                        )}`;
                      window.open(targetUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-indigo-600 transition-colors shadow-sm hover:shadow"
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTab;
