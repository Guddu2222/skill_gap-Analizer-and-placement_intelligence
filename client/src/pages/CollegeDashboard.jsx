import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StudentsView from "../components/StudentsView";
import SkillsAnalytics from "../components/SkillsAnalytics";
import {
  Users,
  TrendingUp,
  Award,
  Building2,
  Download,
  BarChart3,
  Code2,
  Briefcase,
  MapPin,
  Sparkles,
  ArrowUpRight,
  GraduationCap,
  ChevronRight,
  Calendar,
  Layers,
} from "lucide-react";
import {
  fetchCollegeDashboard,
  fetchCollegeStudents,
  fetchCollegeSkillsAnalytics,
  exportCollegeStudents,
} from "../services/api";

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color, glowColor }) => (
  <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 hover:border-violet-500/40 transition-all duration-300 group shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
    <div
      className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-20 -translate-y-6 translate-x-6 transition-opacity group-hover:opacity-40 ${glowColor}`}
    />
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1">
          {value}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
          {subtitle}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${color}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend != null && (
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center text-emerald-400 font-semibold gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend}%</span>
          <span className="text-slate-400 font-normal">placement rate</span>
        </div>
        <span className="text-slate-400 text-[11px]">Academic Cohort</span>
      </div>
    )}
  </div>
);

const CollegeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [exporting, setExporting] = useState(false);

  const loadDashboard = async () => {
    try {
      setError(null);
      const data = await fetchCollegeDashboard();
      setDashboardData(data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        err.message ||
        "Failed to load dashboard";
      setError(msg);
      setDashboardData(null);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await fetchCollegeStudents({ limit: 100 });
      setStudents(data.students || []);
    } catch (err) {
      if (activeView === "students")
        setError(err.response?.data?.msg || "Failed to load students");
    }
  };

  const loadSkills = async () => {
    try {
      const data = await fetchCollegeSkillsAnalytics();
      setSkillsData(data);
    } catch (err) {
      if (activeView === "skills")
        setError(err.response?.data?.msg || "Failed to load skills analytics");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadDashboard();
      if (cancelled) return;
      await Promise.all([loadStudents(), loadSkills()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportCollegeStudents("csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.msg || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const departments = dashboardData?.departmentStats
    ? Object.keys(dashboardData.departmentStats)
    : [];

  const handleDepartmentDrilldown = (deptName) => {
    setSelectedDepartment(deptName);
    setActiveView("students");
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex bg-[#0a0a14] min-h-screen font-sans text-white">
        <Sidebar role="college" />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Loading Placement Command Center...
            </p>
          </div>
        </main>
      </div>
    );
  }

  const collegeName =
    dashboardData?.college?.name || "Panipat Institute of Engineering and Technology";
  const collegeLocation =
    dashboardData?.college?.location ||
    "70, Milestone GT Road, Samalkha, Panipat, Haryana 132102";

  return (
    <div className="flex bg-[#0a0a14] min-h-screen font-sans text-[#e3e0f1] relative selection:bg-violet-500/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-64 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 p-8 max-w-7xl">
        {/* ─── HERO HEADER BANNER ─── */}
        <header className="relative overflow-hidden rounded-3xl bg-[rgba(23,23,43,0.7)] backdrop-blur-2xl border border-white/10 p-7 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/30 border border-white/15 shrink-0">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    {collegeName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-semibold border border-violet-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Campus Hub
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {collegeLocation}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    Academic Year 2025–2026 Overview
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {error && (
                <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
                  {error}
                </span>
              )}
              <Link
                to="/college/analytics"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 hover:border-violet-500/30"
              >
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Deep Analytics
              </Link>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-violet-600/25 border border-white/10 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exporting..." : "Export Cohort CSV"}
              </button>
            </div>
          </div>
        </header>

        {/* ─── NAVIGATION CAPSULE TABS ─── */}
        <div className="flex items-center gap-2 mb-8 p-1.5 bg-[rgba(23,23,43,0.7)] backdrop-blur-xl rounded-2xl border border-white/8 w-fit shadow-lg">
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === "overview"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveView("students")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === "students"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Students Directory
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                activeView === "students"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {dashboardData?.statistics?.totalStudents ?? students.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("skills")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === "skills"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Skills Intelligence
          </button>
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeView === "overview" && dashboardData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                icon={Users}
                title="Total Students"
                value={dashboardData.statistics?.totalStudents ?? 0}
                subtitle="Enrolled this batch"
                color="bg-gradient-to-br from-violet-500 to-indigo-600"
                glowColor="bg-violet-500"
              />
              <StatCard
                icon={Award}
                title="Placed Students"
                value={dashboardData.statistics?.placedStudents ?? 0}
                subtitle="Offer letters secured"
                color="bg-gradient-to-br from-emerald-500 to-teal-600"
                glowColor="bg-emerald-500"
                trend={dashboardData.statistics?.placementRate ?? 0}
              />
              <StatCard
                icon={TrendingUp}
                title="Placement Rate"
                value={`${dashboardData.statistics?.placementRate ?? 0}%`}
                subtitle="Cohort success ratio"
                color="bg-gradient-to-br from-cyan-500 to-blue-600"
                glowColor="bg-cyan-500"
              />
              <StatCard
                icon={Briefcase}
                title="Avg Package"
                value={`₹${dashboardData.statistics?.avgPackage ?? 0} LPA`}
                subtitle="Annual CTC average"
                color="bg-gradient-to-br from-amber-500 to-orange-600"
                glowColor="bg-amber-500"
              />
            </div>

            {/* Overall Placement Progress Bar */}
            <div className="rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    Cohort Placement Target Progress
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time status based on campus drives and offer uploads
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                    {dashboardData.statistics?.placementRate ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400">completed</span>
                </div>
              </div>
              <div className="h-3.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-1000 shadow-lg shadow-violet-500/50"
                  style={{
                    width: `${Math.min(dashboardData.statistics?.placementRate ?? 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Department Breakdown Section */}
            <div className="rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-violet-400" />
                    <h2 className="text-lg font-bold text-white">
                      Department-wise Placement Performance
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Click any department card to drill down directly to its student directory
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 w-fit">
                  {Object.keys(dashboardData.departmentStats || {}).length} Departments Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {dashboardData.departmentStats &&
                  Object.entries(dashboardData.departmentStats).map(
                    ([dept, data]) => {
                      const rate =
                        data.total > 0
                          ? ((data.placed / data.total) * 100).toFixed(1)
                          : "0.0";
                      return (
                        <div
                          key={dept}
                          onClick={() => handleDepartmentDrilldown(dept)}
                          className="group relative rounded-2xl bg-[#141426]/90 p-5 border border-white/8 hover:border-violet-500/50 hover:bg-[#1a1a32] transition-all duration-300 cursor-pointer shadow-md hover:shadow-violet-500/10 hover:-translate-y-1"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 group-hover:bg-violet-500/20 transition-colors">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors line-clamp-1">
                                  {dept}
                                </h3>
                                <p className="text-xs text-slate-400">
                                  {data.total} registered students
                                </p>
                              </div>
                            </div>
                            <div className="p-1 rounded-lg text-slate-500 group-hover:text-violet-400 transition-colors">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-white/5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">Placed Students</span>
                              <span className="font-bold text-emerald-400">
                                {data.placed}{" "}
                                <span className="text-slate-400 font-normal">/ {data.total}</span>
                              </span>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                                <span>Placement Rate</span>
                                <span className="text-cyan-400 font-bold">{rate}%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-700"
                                  style={{
                                    width: `${Math.min(parseFloat(rate), 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>

              {(!dashboardData.departmentStats ||
                Object.keys(dashboardData.departmentStats).length === 0) && (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No department data recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STUDENTS VIEW TAB ─── */}
        {activeView === "students" && (
          <div className="animate-fadeIn">
            <StudentsView
              students={students}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              viewMode={viewMode}
              setViewMode={setViewMode}
              departments={departments}
            />
          </div>
        )}

        {/* ─── SKILLS ANALYTICS TAB ─── */}
        {activeView === "skills" && (
          <div className="animate-fadeIn">
            <SkillsAnalytics skillsData={skillsData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CollegeDashboard;
