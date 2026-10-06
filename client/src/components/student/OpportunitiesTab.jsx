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
} from "lucide-react";
import api from "../../services/api";

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

  const appliedCount = opportunities.filter((j) => j.isApplied).length;

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
            Career Opportunities & Applications
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Discover matched roles, 1-click apply, and track all submitted applications.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
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
            <FileCheck className="w-3.5 h-3.5" />
            My Applications ({appliedCount || myApplications.length})
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
              {opportunities.map((job) => (
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
                      {/* Optional external research link */}
                      {job.applyUrl && (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                          title="View company career page"
                        >
                          Company Post <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

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
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: MY SUBMITTED APPLICATIONS */}
      {activeTab === "my-applications" && (
        <div>
          {loadingApps ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">
                Loading your applications...
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
            <div className="space-y-4">
              {myApplications.map((app) => {
                const job = app.job || {};
                const statusColor =
                  app.status === "offered"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : app.status === "interviewed"
                      ? "bg-purple-100 text-purple-800 border-purple-300"
                      : app.status === "shortlisted"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : "bg-amber-100 text-amber-800 border-amber-300";

                return (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {job.company?.[0] || "J"}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800">
                          {job.title || "Job Application"}
                        </h4>
                        <p className="text-slate-500 text-sm flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.company || "Company"} • {job.location || "Remote"}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          Applied on{" "}
                          {new Date(app.appliedAt || app.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${statusColor}`}
                      >
                        {app.status || "Applied"}
                      </span>
                      {job.applyUrl && (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Open external company portal"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
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
