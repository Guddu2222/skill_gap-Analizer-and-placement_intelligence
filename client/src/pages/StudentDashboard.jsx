import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  Target,
  Briefcase,
  MapPin,
  Pencil,
  RefreshCw,
  Bell,
  Search,
} from "lucide-react";
import {
  fetchStudentProfile,
  fetchLatestSkillGapAnalysis,
  fetchLearningPaths,
  triggerSkillGapAnalysis,
} from "../services/api";

import ResumeUploadWidget from "../components/student/ResumeUploadWidget";
import ProfilePictureUpload from "../components/student/ProfilePictureUpload";
import ProfileEditModal from "../components/student/ProfileEditModal";
import ReadinessScoreWidget from "../components/student/ReadinessScoreWidget";
import StudentStatsBar from "../components/student/StudentStatsBar";
import SkillGapOverview from "../components/student/SkillGapOverview";
import LearningPathTracker from "../components/student/LearningPathTracker";
import SkillRadarChart from "../components/student/SkillRadarChart";
import RecommendedCourses from "../components/student/RecommendedCourses";
import CompetitiveAnalysis from "../components/student/CompetitiveAnalysis";
import OpportunitiesTab from "../components/student/OpportunitiesTab";
import MentorshipTab from "../components/student/MentorshipTab";
import InterviewDashboard from "../components/student/interview/InterviewDashboard";
import InterviewSession from "../components/student/interview/InterviewSession";
import InterviewFeedbackCard from "../components/student/interview/InterviewFeedbackCard";
import StudentSettings from "../components/student/settings/StudentSettings";
import AnalyzedSkillsModal from "../components/student/AnalyzedSkillsModal";

const SIDEBAR_COLLAPSED_KEY = "sgapi_sidebar_collapsed";

const StudentDashboard = ({ activeRoute = "overview" }) => {
  const [student, setStudent] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [activeTab, setActiveTab] = useState(activeRoute);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  );

  // Interview view state
  const [interviewView, setInterviewView] = useState("dashboard");
  const [activeInterviewId, setActiveInterviewId] = useState(null);

  // Sync sidebar collapsed state to localStorage and listen for Sidebar's internal toggle
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Sync active tab from route prop
  useEffect(() => {
    setActiveTab(activeRoute);
    if (activeRoute !== "interviews") {
      setInterviewView("dashboard");
    }
  }, [activeRoute]);

  const handleResumeUploadSuccess = (resumeUrl, newProfileCompletionPercentage) => {
    setStudent((prev) => ({
      ...prev,
      resumeUrl,
      profileCompletionPercentage:
        newProfileCompletionPercentage || prev.profileCompletionPercentage,
    }));
  };

  const handleProfilePictureUploadSuccess = (profilePictureUrl, newProfileCompletionPercentage) => {
    setStudent((prev) => ({
      ...prev,
      profilePicture: profilePictureUrl,
      profileCompletionPercentage:
        newProfileCompletionPercentage || prev.profileCompletionPercentage,
    }));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await fetchStudentProfile();
      setStudent(profileRes.student);

      try {
        const gapRes = await fetchLatestSkillGapAnalysis();
        setSkillGapAnalysis(gapRes.analysis);
      } catch {
        setSkillGapAnalysis(null);
      }

      try {
        const pathsRes = await fetchLearningPaths();
        setLearningPaths(pathsRes.learningPaths || []);
      } catch {
        setLearningPaths([]);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAnalyzeSkills = async (currentStudent = student) => {
    try {
      setAnalyzing(true);
      const domain = currentStudent?.targetDomain || "Software Engineer";
      const role = currentStudent?.targetRole || "Full Stack Developer";
      await triggerSkillGapAnalysis(domain, role);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to analyze skills");
    } finally {
      setAnalyzing(false);
    }
  };

  const sidebarWidth = sidebarCollapsed ? "ml-16" : "ml-64";

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex bg-slate-950 min-h-screen">
        <Sidebar role="student" collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        <main className={`flex-1 ${sidebarWidth} transition-all duration-300 flex items-center justify-center min-h-screen`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <p className="text-slate-400 font-medium text-sm tracking-wide">
              Loading your insights...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div className="flex bg-slate-950 min-h-screen">
        <Sidebar role="student" collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        <main className={`flex-1 ${sidebarWidth} flex items-center justify-center`}>
          <p className="text-slate-400">
            Failed to load profile. Please try reloading.
          </p>
        </main>
      </div>
    );
  }

  // Derived display values
  const firstName = student.firstName || student.user?.name?.split(" ")[0] || "Student";
  const initials = firstName.charAt(0).toUpperCase() + (student.lastName?.charAt(0) || "").toUpperCase();

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar role="student" collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      {/* ── Main Content Area ── */}
      <div className={`flex-1 ${sidebarWidth} transition-all duration-300 min-h-screen`}>

        {/* ── Sticky Top Bar ── */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            <span className="text-slate-400">Dashboard</span>
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-slate-700 capitalize">
              {activeTab === "overview" ? "Overview" :
               activeTab === "learning" ? "My Paths" :
               activeTab === "skills" ? "Skill Radar" :
               activeTab === "competitive" ? "Compare" :
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-sm text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer w-48">
              <Search className="w-4 h-4" />
              Search...
              <kbd className="ml-auto text-[10px] bg-white rounded px-1.5 py-0.5 font-mono text-slate-400">⌘K</kbd>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              title={firstName}
            >
              {initials || "S"}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="px-6 py-6 max-w-7xl mx-auto">
      {activeTab === "settings" ? (
        <StudentSettings student={student} onUpdate={fetchDashboardData} />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════
              PREMIUM HERO BANNER
          ═══════════════════════════════════════════════ */}
          <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e3a8a 100%)",
              }}
            />
            {/* Animated orb overlays */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 50%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(59,130,246,0.3) 0%, transparent 45%), radial-gradient(circle at 60% 80%, rgba(99,102,241,0.2) 0%, transparent 40%)",
              }}
            />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* ── Left: Profile Info ── */}
              <div className="flex items-center gap-5">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <ProfilePictureUpload
                    student={student}
                    onUploadSuccess={handleProfilePictureUploadSuccess}
                  />
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-800 shadow-sm" />
                </div>

                {/* Name & Tags */}
                <div>
                  <p className="text-indigo-200/80 text-sm font-medium mb-1">
                    Welcome back,
                  </p>
                  <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-3">
                    {firstName}! 👋
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {student.targetRole && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium border border-white/20">
                        <Target className="w-3 h-3 text-blue-300" />
                        {student.targetRole}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-400/15 backdrop-blur-sm text-green-200 text-xs font-medium border border-green-400/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <Briefcase className="w-3 h-3" />
                      <span className="capitalize">{student.placementStatus || "Active"}</span>
                    </span>
                    {student.college?.name && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 backdrop-blur-sm text-white/70 text-xs border border-white/15">
                        <MapPin className="w-3 h-3" />
                        {student.college.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Right: Readiness Card + Edit Button ── */}
              <div className="flex flex-col gap-3 w-full md:w-64 relative z-20 shrink-0">
                <ReadinessScoreWidget
                  score={student.placementReadinessScore}
                  components={
                    student.readinessComponents || {
                      profile: student.profileCompletionPercentage,
                      skillGap: skillGapAnalysis?.overallReadinessScore || 0,
                      resume: student.resumeUrl ? 100 : 0,
                    }
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/25 hover:border-white/45 transition-all group"
                  >
                    <Pencil className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleAnalyzeSkills}
                    disabled={analyzing}
                    title="Refresh Analysis"
                    className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${analyzing ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom decorative strip */}
            <div
              className="h-0.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg, #f59e0b 0%, #8b5cf6 50%, #06b6d4 100%)",
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════
              STATS BAR
          ═══════════════════════════════════════════════ */}
          <StudentStatsBar
            student={student}
            skillGapAnalysis={skillGapAnalysis}
            learningPaths={learningPaths}
            onStatClick={(tab) => {
              if (tab === "skills_modal") {
                setShowSkillsModal(true);
              } else {
                setActiveTab(tab);
                // Smooth scroll down to the tab content area
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
              }
            }}
          />

          {/* ═══════════════════════════════════════════════
              RESUME UPLOAD PROMPT (if missing)
          ═══════════════════════════════════════════════ */}
          {!student.resumeUrl && (
            <div className="mb-8">
              <ResumeUploadWidget onUploadSuccess={handleResumeUploadSuccess} />
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              NO-ANALYSIS CTA BANNER
          ═══════════════════════════════════════════════ */}
          {!skillGapAnalysis && (
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-indigo-500/25">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="relative flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Get Your Personalized Career Roadmap
                    </h3>
                    <p className="text-indigo-100 text-sm mb-4 max-w-lg">
                      Discover your skill gaps, get AI-powered recommendations, and create a
                      learning path tailored just for you!
                    </p>
                    <button
                      onClick={handleAnalyzeSkills}
                      disabled={analyzing}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {analyzing ? (
                        <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>⚡</span>
                      )}
                      {analyzing ? "Analyzing with AI..." : "Start Analysis Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              TAB CONTENT
          ═══════════════════════════════════════════════ */}
          {skillGapAnalysis && (
            <div className="pb-12 animate-fadeIn">
              {activeTab === "overview" && (
                <SkillGapOverview
                  analysis={skillGapAnalysis}
                  student={student}
                  onReanalyze={handleAnalyzeSkills}
                  isAnalyzing={analyzing}
                />
              )}
              {activeTab === "learning" && (
                <LearningPathTracker
                  learningPaths={learningPaths}
                  student={student}
                  onUpdate={fetchDashboardData}
                />
              )}
              {activeTab === "skills" && (
                <SkillRadarChart
                  analysis={skillGapAnalysis}
                  studentSkills={student?.skills}
                />
              )}
              {activeTab === "courses" && (
                <RecommendedCourses analysis={skillGapAnalysis} />
              )}
              {activeTab === "competitive" && (
                <CompetitiveAnalysis
                  student={student}
                  analysis={skillGapAnalysis}
                />
              )}
              {activeTab === "opportunities" && (
                <OpportunitiesTab student={student} />
              )}
              {activeTab === "mentorship" && <MentorshipTab />}
              {activeTab === "interviews" && (
                <div className="animate-fadeIn">
                  {interviewView === "dashboard" && (
                    <InterviewDashboard
                      student={student}
                      onStartInterview={() => setInterviewView("session")}
                      onViewFeedback={(id) => {
                        setActiveInterviewId(id);
                        setInterviewView("feedback");
                      }}
                    />
                  )}
                  {interviewView === "session" && (
                    <InterviewSession
                      student={student}
                      onComplete={(id) => {
                        setActiveInterviewId(id);
                        setInterviewView("feedback");
                      }}
                    />
                  )}
                  {interviewView === "feedback" && (
                    <InterviewFeedbackCard
                      interviewId={activeInterviewId}
                      onBack={() => {
                        setActiveInterviewId(null);
                        setInterviewView("dashboard");
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
        </main>
      </div>

      <ProfileEditModal
        student={student}
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onProfileUpdate={async (updatedStudent) => {
          const roleChanged = student?.targetRole !== updatedStudent?.targetRole;
          const domainChanged = student?.targetDomain !== updatedStudent?.targetDomain;
          const oldSkills = JSON.stringify(student?.skills || []);
          const newSkills = JSON.stringify(updatedStudent?.skills || []);
          const skillsChanged = oldSkills !== newSkills;

          setStudent(updatedStudent);
          setShowEditProfile(false);

          if (roleChanged || domainChanged || skillsChanged) {
            await handleAnalyzeSkills(updatedStudent);
          }
        }}
      />

      {/* ── Analyzed Skills View Modal ── */}
      <AnalyzedSkillsModal 
        isOpen={showSkillsModal} 
        onClose={() => setShowSkillsModal(false)}
        analysis={skillGapAnalysis}
      />
    </div>
  );
};

export default StudentDashboard;
