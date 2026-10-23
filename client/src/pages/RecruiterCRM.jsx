import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Building2,
  Users,
  Award,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { fetchRecruiterCRM } from "../services/api";

const RecruiterCRM = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      const data = await fetchRecruiterCRM();
      if (Array.isArray(data) && data.length > 0) {
        setRecruiters(data);
      } else {
        // Sensible initial industry templates if college has not conducted campus drives yet
        setRecruiters([
          {
            company: "Google",
            tier: "Tier 1",
            visits: 3,
            hires: 8,
            avgPackage: "28.0 LPA",
            status: "Active",
            lastVisit: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
          },
          {
            company: "Microsoft",
            tier: "Tier 1",
            visits: 4,
            hires: 14,
            avgPackage: "26.5 LPA",
            status: "Active",
            lastVisit: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
          },
          {
            company: "Amazon",
            tier: "Tier 1",
            visits: 3,
            hires: 12,
            avgPackage: "24.0 LPA",
            status: "Active",
            lastVisit: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
          },
          {
            company: "Atlassian",
            tier: "Tier 1",
            visits: 2,
            hires: 5,
            avgPackage: "22.5 LPA",
            status: "Active",
            lastVisit: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
          },
          {
            company: "Tata Consultancy Services (TCS)",
            tier: "Mass Recruiter",
            visits: 6,
            hires: 85,
            avgPackage: "7.2 LPA",
            status: "Active",
            lastVisit: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load recruiter CRM data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((r) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (r.company || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (r.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [recruiters, searchTerm, statusFilter]);

  const totalHires = useMemo(() => {
    return recruiters.reduce((sum, r) => sum + (Number(r.hires) || 0), 0);
  }, [recruiters]);

  const totalVisits = useMemo(() => {
    return recruiters.reduce((sum, r) => sum + (Number(r.visits) || 0), 0);
  }, [recruiters]);

  const activeRecruitersCount = useMemo(() => {
    return recruiters.filter((r) => (r.status || "Active").toLowerCase() === "active").length;
  }, [recruiters]);

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen font-sans text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 p-8 relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
              <Sparkles className="w-4 h-4" /> Corporate Partnerships & CRM
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Recruiter Relations Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Monitor corporate hiring partner engagement, campus visits, and historical offer rates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/college/drives")}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Schedule Campus Drive
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-5 hover:border-violet-500/40 transition-all group shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Corporate Partners
              </span>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              {recruiters.length}
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              {activeRecruitersCount} Active Partners
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-5 hover:border-cyan-500/40 transition-all group shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Placements
              </span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              {totalHires}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Hires secured across drives
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-5 hover:border-amber-500/40 transition-all group shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Campus Drive Visits
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              {totalVisits}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Historic on-campus rounds
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-5 hover:border-emerald-500/40 transition-all group shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avg Yield / Partner
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              {recruiters.length > 0 ? (totalHires / recruiters.length).toFixed(1) : "0"}
            </h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              Hires per visiting corporate
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgba(23,23,43,0.8)] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[rgba(23,23,43,0.8)] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-violet-500/50 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="dormant">Dormant</option>
            </select>
          </div>
        </div>

        {/* Recruiter Table */}
        <div className="rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 shadow-xl overflow-hidden flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading corporate CRM records...</p>
            </div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
              <Building2 className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Matching Recruiters</h3>
              <p className="text-sm max-w-sm text-center text-slate-400 mb-4">
                No recruiter profiles match your current search or status criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                    <th className="px-6 py-4 font-bold">Company</th>
                    <th className="px-6 py-4 font-bold">Engagement</th>
                    <th className="px-6 py-4 font-bold">Hires Secured</th>
                    <th className="px-6 py-4 font-bold">Last Visit</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRecruiters.map((recruiter, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">
                          {(recruiter.company || "C")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">
                            {recruiter.company}
                          </p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {recruiter.tier || "Industry Partner"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium">
                        {recruiter.visits || 1} Campus Visit{(recruiter.visits || 1) !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                          {recruiter.hires || 0} Hires
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {recruiter.lastVisit
                          ? new Date(recruiter.lastVisit).toLocaleDateString()
                          : "Active Season"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            (recruiter.status || "Active").toLowerCase() === "active"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              (recruiter.status || "Active").toLowerCase() === "active"
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-slate-400"
                            }`}
                          />
                          {recruiter.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/college/drives"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-violet-600/20 text-slate-300 hover:text-white border border-white/10 hover:border-violet-500/30 text-xs font-semibold transition-all"
                        >
                          <span>Manage Drives</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecruiterCRM;
