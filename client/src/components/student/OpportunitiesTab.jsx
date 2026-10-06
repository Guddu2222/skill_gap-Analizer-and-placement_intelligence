import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Target,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  BadgeCheck,
  Send,
  Clock,
  Building2,
  X,
  FileCheck,
  Check,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import api from "../../services/api";

const COMPANY_PORTALS = {
  meesho: "https://www.meesho.io/jobs",
  zoho: "https://www.zoho.com/careers/",
  infosys: "https://career.infosys.com",
  tcs: "https://www.tcs.com/careers",
  "tcs digital": "https://www.tcs.com/careers",
  flipkart: "https://www.flipkartcareers.com",
  razorpay: "https://razorpay.com/jobs/",
  swiggy: "https://careers.swiggy.com",
  wipro: "https://careers.wipro.com/careers-home/",
  zomato: "https://www.zomato.com/careers",
  paytm: "https://paytm.com/careers",
  cred: "https://careers.cred.club",
  phonepe: "https://www.phonepe.com/careers/",
  ola: "https://www.olacabs.com/careers",
  "hdfc bank": "https://www.hdfcbank.com/personal/about-us/careers",
  "hdfc bank tech": "https://www.hdfcbank.com/personal/about-us/careers",
  "hcl technologies": "https://www.hcltech.com/careers",
  sharechat: "https://sharechat.com/careers",
  bloomberg: "https://www.bloomberg.com/careers",
  gojek: "https://www.gojek.io/careers",
  startuphub: "https://www.startupindia.gov.in",
  "startup india – buildfast": "https://www.startupindia.gov.in",
};

const getCompanyPortalUrl = (job) => {
  const key = (job?.company || "").toLowerCase().trim();
  if (COMPANY_PORTALS[key]) return COMPANY_PORTALS[key];
  for (const [name, url] of Object.entries(COMPANY_PORTALS)) {
    if (key.includes(name) || name.includes(key)) return url;
  }
  if (
    job?.applyUrl &&
    !job.applyUrl.includes("careers.company.com") &&
    !job.applyUrl.includes("example.com") &&
    !job.applyUrl.endsWith("/careers")
  ) {
    return job.applyUrl;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(
    (job?.company || "") + " official careers jobs"
  )}`;
};

const OpportunitiesTab = ({ student }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("matches"); // "matches" | "my-applications"
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, [student?.skills]);

  useEffect(() => {
    if (activeTab === "my-applications") {
      fetchMyApplications();
    }
  }, [activeTab]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/opportunities");
      setOpportunities(res.data.opportunities || []);
    } catch (err) {
      console.error("Opportunities fetch error:", err);
      if (err.response?.status !== 404) {
        setError("Could not load your opportunities at this time.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await api.get("/jobs/my-applications");
      setMyApplications(res.data.applications || []);
    } catch (err) {
      console.error("Applications fetch error:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleApply = async (job) => {
    try {
      setApplyingId(job._id);
      setActionFeedback(null);

      const res = await api.post(`/jobs/${job._id}/apply`);

      // Update in-memory job state so card reflects "Applied" immediately
      setOpportunities((prev) =>
        prev.map((j) =>
          j._id === job._id
            ? {
                ...j,
                isApplied: true,
                applicationStatus: "applied",
                appliedAt: new Date(),
              }
            : j
        )
      );

      setActionFeedback({
        type: "success",
        message:
          res.data.message ||
          `🎉 Application submitted successfully for ${job.title} at ${job.company}!`,
      });

      // Refresh applications count in background
      fetchMyApplications();
    } catch (err) {
      console.error("Error applying to job:", err);
      setActionFeedback({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to submit application. Please verify your profile and try again.",
      });
    } finally {
      setApplyingId(null);
    }
  };

  const appliedCount =
    myApplications.length > 0
      ? myApplications.length
      : opportunities.filter((j) => j.isApplied).length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all animate-fadeIn ${
            actionFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {actionFeedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <p className="text-sm font-semibold">{actionFeedback.message}</p>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Career Opportunities & Application Tracker
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Discover matched roles, 1-click apply, visit company portals, and track application milestones.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab("matches")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "matches"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Matched Roles ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("my-applications")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "my-applications"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            My Applications ({appliedCount})
          </button>
        </div>
      </div>

      {/* VIEW 1: MATCHED ROLES */}
      {activeTab === "matches" && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">
                AI is matching your skills with open roles...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm text-red-400 mt-1">
                  Add more skills to your profile to get matched with active jobs.
                </p>
              </div>
            </div>
          ) : opportunities.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {opportunities.map((job) => {
                const portalUrl = getCompanyPortalUrl(job);

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {job.company}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Source Badge */}
                        {job.source === "recruiter" ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold">
                            <BadgeCheck className="w-3.5 h-3.5" /> Recruiter
                          </span>
                        ) : job.source === "ai_generated" ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" /> AI Match
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-semibold">
                            <ExternalLink className="w-3.5 h-3.5" /> Live Feed
                          </span>
                        )}

                        {/* Match Score Badge */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${
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
                    </div>

                    {/* Metadata Tags */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-5">
                      <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 capitalize">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {job.jobType?.replace("_", " ") || "Full Time"}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-medium text-emerald-700">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />{" "}
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Required Skills */}
                    <div className="flex-1 mb-5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
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
                          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-500">
                            +{job.requirements.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {job.deadline
                          ? `Closes ${new Date(job.deadline).toLocaleDateString()}`
                          : "Open immediately"}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Company Portal Link */}
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                          title={`Open ${job.company} Career Portal`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Company Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>

                        {/* 1-Click In-App Apply or Applied Status */}
                        {job.isApplied ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(job)}
                            disabled={applyingId === job._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50"
                          >
                            {applyingId === job._id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Apply Now
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: MY SUBMITTED APPLICATIONS WITH TIMELINE TRACKER */}
      {activeTab === "my-applications" && (
        <div>
          {loadingApps ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">
                Loading your applications and tracking status...
              </p>
            </div>
          ) : myApplications.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[350px] flex flex-col items-center justify-center">
              <FileCheck className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                No Applications Submitted Yet
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                Switch over to "Matched Roles" to discover positions recommended
                for your skillset and apply in 1 click!
              </p>
              <button
                onClick={() => setActiveTab("matches")}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Browse Matched Roles
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between text-indigo-900 text-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>
                    <strong>SkillBridge Career Verification:</strong> All applications below are submitted directly with your verified student profile, GPA, and skill credentials. You can also visit each employer's official recruitment portal below.
                  </span>
                </div>
              </div>

              {myApplications.map((app) => {
                const job = app.job || {};
                const portalUrl = getCompanyPortalUrl(job);
                const status = (app.status || "applied").toLowerCase();

                // 4-Stage Tracker Logic
                const stages = [
                  { id: "applied", label: "Application Submitted" },
                  { id: "screening", label: "Profile Screening" },
                  { id: "interview", label: "Interview / Assessment" },
                  { id: "decision", label: "Offer Decision" },
                ];

                let currentStageIndex = 0;
                if (status === "applied") currentStageIndex = 1; // Stage 1 completed, in stage 2
                else if (status === "shortlisted") currentStageIndex = 2;
                else if (status === "interviewed") currentStageIndex = 3;
                else if (status === "offered" || status === "rejected") currentStageIndex = 4;

                const statusColor =
                  status === "offered"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : status === "interviewed"
                      ? "bg-purple-100 text-purple-800 border-purple-300"
                      : status === "shortlisted"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : status === "rejected"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "bg-amber-100 text-amber-800 border-amber-300";

                return (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-all space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
                          {job.company?.[0] || "J"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-slate-800">
                              {job.title || "Job Application"}
                            </h4>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 font-mono rounded">
                              #APP-{app._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            <strong>{job.company || "Company"}</strong> •{" "}
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {job.location || "Remote"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Applied on{" "}
                              {new Date(
                                app.appliedAt || app.createdAt
                              ).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            {job.salary && (
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <DollarSign className="w-3.5 h-3.5" />
                                {job.salary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <span
                          className={`px-3.5 py-1 rounded-full text-xs font-bold border capitalize self-start sm:self-auto ${statusColor}`}
                        >
                          Status: {status}
                        </span>

                        {/* Direct Company Career Portal Button */}
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                          title={`Track and verify on ${job.company} official career portal`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          Track on {job.company} Portal
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Progress Milestone Tracker */}
                    <div className="py-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Application Progression Pipeline
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stages.map((stg, sIdx) => {
                          const isCompleted = sIdx < currentStageIndex;
                          const isCurrent = sIdx === currentStageIndex - 1;

                          return (
                            <div
                              key={stg.id}
                              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                                isCurrent
                                  ? "bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-500/20"
                                  : isCompleted
                                    ? "bg-emerald-50/60 border-emerald-100"
                                    : "bg-slate-50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-slate-400">
                                  STAGE {sIdx + 1}
                                </span>
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : isCurrent ? (
                                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                                    <Clock className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-300 flex items-center justify-center text-[10px]">
                                    {sIdx + 1}
                                  </div>
                                )}
                              </div>
                              <p
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? "text-indigo-900"
                                    : isCompleted
                                      ? "text-emerald-900"
                                      : "text-slate-400"
                                }`}
                              >
                                {stg.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTab;
