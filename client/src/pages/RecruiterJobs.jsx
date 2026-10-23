import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  MapPin,
  Building,
  Briefcase,
  Search,
  Send,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Filter,
  X,
  Building2,
} from "lucide-react";
import axios from "axios";
import { fetchRecruiterDriveRequests } from "../services/api";

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const RecruiterJobs = () => {
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "invites"
  const [jobs, setJobs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [inviteStatusFilter, setInviteStatusFilter] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const [newJobData, setNewJobData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    description: "",
    requirements: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [jobsRes, collegesRes, reqsData] = await Promise.all([
        apiCall("get", "/jobs/me"),
        apiCall("get", "/colleges"),
        fetchRecruiterDriveRequests().catch(() => []),
      ]);
      setJobs(jobsRes.data || []);
      setColleges(collegesRes.data || []);
      setRequests(reqsData || []);
    } catch (err) {
      console.error("Error loading recruiter jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  const reloadRequests = async () => {
    try {
      setRequestsLoading(true);
      const reqsData = await fetchRecruiterDriveRequests();
      setRequests(reqsData || []);
    } catch (err) {
      console.error("Error reloading drive requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJobData,
        requirements: newJobData.requirements.split(",").map((s) => s.trim()),
      };
      const res = await apiCall("post", "/jobs", payload);
      setJobs([res.data, ...jobs]);
      setShowCreateModal(false);
      setNewJobData({
        title: "",
        company: "",
        location: "",
        jobType: "Full Time",
        salary: "",
        description: "",
        requirements: "",
      });
    } catch (err) {
      console.error("Error creating job:", err);
      alert("Failed to create job.");
    }
  };

  const handleInviteCollege = async (collegeId) => {
    if (!selectedJob) return;
    setInviteLoading(true);
    try {
      await apiCall("post", "/recruiter-features/drive-requests", {
        jobId: selectedJob._id,
        collegeId: collegeId,
      });
      alert("Drive request sent successfully to college placement office!");
      setShowInviteModal(false);
      reloadRequests();
    } catch (err) {
      console.error("Error sending invite:", err);
      alert(err.response?.data?.error || "Failed to send invite.");
    } finally {
      setInviteLoading(false);
    }
  };

  // Metrics
  const totalJobs = jobs.length;
  const totalInvites = requests.length;
  const acceptedInvites = requests.filter((r) => r.status === "accepted").length;
  const pendingInvites = requests.filter((r) => r.status === "pending").length;

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedRequests = requests.filter((r) => {
    if (inviteStatusFilter === "all") return true;
    return r.status === inviteStatusFilter;
  });

  return (
    <div className="flex min-h-screen bg-[#0c0c1d] font-sans text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-cyan-600/8 rounded-full blur-[140px]" />
      </div>

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto custom-scrollbar-dark relative z-10">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Jobs & Campus Outreach
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                Recruiter Hub
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Manage company job openings and track campus drive requests sent to partner colleges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>
        </header>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[rgba(20,20,38,0.6)] backdrop-blur-md border border-white/8 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalJobs}</p>
              <p className="text-xs text-slate-400">Active Roles</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.6)] backdrop-blur-md border border-white/8 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">{totalInvites}</p>
              <p className="text-xs text-slate-400">Campus Invites Sent</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.6)] backdrop-blur-md border border-white/8 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{acceptedInvites}</p>
              <p className="text-xs text-slate-400">Drives Accepted</p>
            </div>
          </div>

          <div className="bg-[rgba(20,20,38,0.6)] backdrop-blur-md border border-white/8 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{pendingInvites}</p>
              <p className="text-xs text-slate-400">Awaiting TPO Approval</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/8 pb-4">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "jobs"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Postings</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("invites");
              reloadRequests();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "invites"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25"
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Drive Outreach</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
              {requests.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Job Postings */}
        {activeTab === "jobs" && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-[rgba(20,20,38,0.5)] rounded-3xl border border-white/8 p-8">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No jobs posted yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
                  Create a job posting to unlock automated candidate matching and invite campus placement officers.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
                >
                  + Create your first job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                          {job.title}
                        </h3>
                        <span className="bg-violet-500/15 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30">
                          {job.jobType || "Full Time"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-300 mb-5">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{job.location}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-5 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                          Required Competencies
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requirements?.slice(0, 5).map((req, idx) => (
                            <span
                              key={idx}
                              className="bg-white/5 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-white/8"
                            >
                              {req}
                            </span>
                          ))}
                          {job.requirements?.length > 5 && (
                            <span className="text-xs text-slate-500 flex items-center px-1">
                              +{job.requirements.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/8 flex justify-between items-center mt-auto">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowInviteModal(true);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-200 text-xs font-semibold shadow-md shadow-violet-600/20 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Invite Colleges
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Campus Drive Outreach & Invites */}
        {activeTab === "invites" && (
          <div className="space-y-4">
            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-[rgba(20,20,38,0.5)] border border-white/8 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter by Status:
                </span>
                {["all", "pending", "accepted", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInviteStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      inviteStatusFilter === st
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                Showing {displayedRequests.length} of {requests.length} requests
              </span>
            </div>

            {requestsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : displayedRequests.length === 0 ? (
              <div className="text-center py-20 bg-[rgba(20,20,38,0.5)] rounded-3xl border border-white/8 p-8">
                <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No drive invites found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Select any active role and click "Invite Colleges" to initiate placement drives with target universities.
                </p>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition-colors"
                >
                  View Active Roles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedRequests.map((req) => {
                  const isAccepted = req.status === "accepted";
                  const isPending = req.status === "pending";
                  const isRejected = req.status === "rejected";

                  return (
                    <div
                      key={req._id}
                      className="bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-2xl p-5 hover:border-violet-500/40 transition-all shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                              {req.college?.name ? req.college.name.charAt(0) : "C"}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white tracking-tight">
                                {req.college?.name || "Partner University"}
                              </h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {req.college?.location || "Campus Location"}
                                {req.college?.tier && (
                                  <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[10px] text-cyan-300">
                                    {req.college.tier}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              isAccepted
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                : isPending
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                            }`}
                          >
                            {isAccepted ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : isPending ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            <span className="capitalize">{req.status}</span>
                          </span>
                        </div>

                        {/* Job Details Box */}
                        <div className="bg-[#121226] border border-white/5 rounded-xl p-3 mb-4">
                          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                              Target Role
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              {req.job?.salary || "Package as per norm"}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-white">{req.job?.title || "Placement Role"}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{req.job?.company}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Sent: {new Date(req.createdAt).toLocaleDateString()}
                        </span>

                        {isAccepted ? (
                          <button
                            onClick={() => navigate("/recruiter/drives")}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold transition-all cursor-pointer"
                          >
                            <span>Open Assigned Drive</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        ) : isPending ? (
                          <span className="text-amber-400/80 italic text-[11px]">
                            Awaiting college TPO schedule
                          </span>
                        ) : (
                          <span className="text-rose-400/80 text-[11px]">
                            Drive declined by college
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Job Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121226] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-dark p-8 relative shadow-2xl">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-violet-400" /> Post a New Role
              </h2>

              <form onSubmit={handleCreateJob} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newJobData.title}
                      onChange={(e) =>
                        setNewJobData({ ...newJobData, title: e.target.value })
                      }
                      className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Frontend Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newJobData.company}
                      onChange={(e) =>
                        setNewJobData({ ...newJobData, company: e.target.value })
                      }
                      className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newJobData.location}
                      onChange={(e) =>
                        setNewJobData({ ...newJobData, location: e.target.value })
                      }
                      className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Bangalore / Remote"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Package / CTC
                    </label>
                    <input
                      type="text"
                      value={newJobData.salary}
                      onChange={(e) =>
                        setNewJobData({ ...newJobData, salary: e.target.value })
                      }
                      className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. 15 LPA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Job Description
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={newJobData.description}
                    onChange={(e) =>
                      setNewJobData({
                        ...newJobData,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    placeholder="Describe role responsibilities and qualifications..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobData.requirements}
                    onChange={(e) =>
                      setNewJobData({
                        ...newJobData,
                        requirements: e.target.value,
                      })
                    }
                    className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="React, Node.js, MongoDB, AWS"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all text-sm"
                  >
                    Publish Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite College Modal */}
        {showInviteModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-[#121226] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative">
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-1">
                  Invite College for Placement Drive
                </h2>
                <p className="text-xs text-slate-400">
                  Send a drive request to campus placement officers for{" "}
                  <span className="text-violet-300 font-semibold">
                    {selectedJob.title}
                  </span>
                  .
                </p>
              </div>

              <div className="p-6 bg-[#0a0a16] flex-1 overflow-hidden flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search universities by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121226] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-dark space-y-2.5 pr-2">
                  {filteredColleges.map((college) => (
                    <div
                      key={college._id}
                      className="bg-[#121226] border border-white/8 p-4 rounded-xl flex items-center justify-between hover:border-violet-500/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {college.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />{" "}
                            {college.location || "Location not set"}
                          </span>
                          {college.tier && (
                            <span className="text-[11px] text-cyan-400 font-medium">
                              • Tier {college.tier}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleInviteCollege(college._id)}
                        disabled={inviteLoading}
                        className="flex items-center gap-1.5 bg-violet-600/20 text-violet-300 border border-violet-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-violet-600 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Invite
                      </button>
                    </div>
                  ))}
                  {filteredColleges.length === 0 && (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No colleges found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterJobs;
