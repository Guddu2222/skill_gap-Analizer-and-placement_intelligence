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
import ATSChecker from "../components/student/ATSChecker";

import OnboardingWizard from "../components/onboarding/OnboardingWizard";

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
  const [analysisError, setAnalysisError] = useState(null);
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
      setAnalysisError(null);
      const domain = currentStudent?.targetDomain || "Software Engineer";
      const role = currentStudent?.targetRole || "Full Stack Developer";
      await triggerSkillGapAnalysis(domain, role);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      setAnalysisError(err.message || "Failed to analyze skills");
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

  // Check if onboarding is needed (targetRole is set during the wizard)
  const needsOnboarding = !student.targetRole || student.department === "General" || !student.college;

  if (needsOnboarding) {
    return (
      <OnboardingWizard 
        user={{ ...student.user, role: 'student' }} 
        onComplete={fetchDashboardData} 
      />
    );
  }

  // Derived display values
  const firstName = student.firstName || student.user?.name?.split(" ")[0] || "Student";
  const initials = firstName.charAt(0).toUpperCase() + (student.lastName?.charAt(0) || "").toUpperCase();

  const totalSkillsAnalyzed = skillGapAnalysis
    ? (skillGapAnalysis.missingSkills?.length || 0) +
      (skillGapAnalysis.strongSkills?.length || 0) +
      (skillGapAnalysis.skillsToImprove?.length || 0)
    : 0;

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex bg-[#12121d] text-[#e3e0f1] min-h-screen font-sans">
      <Sidebar role="student" collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      {/* ── Main Content Area ── */}
      <div className={`flex-1 ${sidebarWidth} transition-all duration-300 min-h-screen bg-[#12121d]`}>

        {/* ── Sticky Top Bar Shell ── */}
        <header className={`sticky top-0 z-40 bg-[#0F0F1A]/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 font-body text-sm border-b border-white/5`}>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Welcome back,</span>
            <span className="font-bold text-white">{firstName}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center bg-surface-container-lowest px-4 py-2 rounded-full border border-white/5 focus-within:ring-1 ring-[#7C3AED]/50">
              <span className="material-symbols-outlined text-slate-500 text-sm mr-2">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-xs w-48 text-on-surface outline-none" placeholder="Search skills, jobs..." type="text"/>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-white transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button 
                onClick={() => setShowEditProfile(true)}
                className="hover:text-white transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="px-8 py-8 md:px-12 w-full max-w-7xl mx-auto min-h-screen text-on-surface">
      {activeTab === "settings" ? (
        <StudentSettings student={student} onUpdate={fetchDashboardData} />
      ) : (
        <>
          {/* ═══════════════════════════════════════════════
              ERROR BANNER
          ═══════════════════════════════════════════════ */}
          {analysisError && (
             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-fadeIn relative shadow-sm">
               <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <div className="flex-1">
                 <h4 className="font-bold text-sm mb-1">Wait Required</h4>
                 <p className="text-xs font-medium text-red-600 leading-relaxed">{analysisError}</p>
               </div>
               <button onClick={() => setAnalysisError(null)} className="p-1 hover:bg-red-100 rounded-md transition-colors">
                 <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
          )}

          {/* HERO PROFILE BANNER */}
          <section className="relative w-full rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#1E1040] via-[#12121d] to-[#0F0F1A] border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.1),transparent_50%)]"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between p-8 gap-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ProfilePictureUpload
                    student={student}
                    onUploadSuccess={handleProfilePictureUploadSuccess}
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[#1E1040] rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-[28px] font-bold text-white tracking-tight">{student.firstName} {student.lastName}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-3 py-0.5 bg-primary-container text-white text-[10px] font-bold uppercase rounded-full tracking-wider">{student.targetRole || "Student"}</span>
                    {student.college?.name && <span className="text-slate-400 text-xs">{student.college.name}</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 z-20 shrink-0">
                <div className="flex items-center gap-6 glass-card p-4 rounded-xl border-white/10">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-container-highest" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-secondary transition-all duration-1000" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (student.placementReadinessScore || 0) / 100)} strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{student.placementReadinessScore || 0}</span>
                      <span className="text-[8px] uppercase tracking-tighter text-slate-400">Score</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Placement Readiness</p>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold text-sm">
                        {(student.placementReadinessScore || 0) < 50 ? "Needs Improvement" : (student.placementReadinessScore || 0) < 80 ? "Good" : "Excellent"}
                      </span>
                      <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[140px]">Improve skill match by focusing on growth areas.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white text-xs font-semibold rounded-xl border border-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span> Edit Profile
                  </button>
                  <button
                    onClick={handleAnalyzeSkills}
                    disabled={analyzing}
                    className="flex items-center justify-center p-2 px-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 mr-2 ${analyzing ? "animate-spin" : ""}`} /> Refresh
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* STAT CARDS ROW */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 cursor-pointer">
            <div onClick={() => { setShowSkillsModal(true); }} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                </div>
                <span className="text-[10px] font-bold text-green-400 flex items-center justify-center">View Map</span>
              </div>
              <h4 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Skills Analyzed</h4>
              <p className="text-3xl font-bold text-white mt-1">{totalSkillsAnalyzed}</p>
              <div className="w-full h-1 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{width: `${Math.min(totalSkillsAnalyzed * 10, 100)}%`}}></div>
              </div>
            </div>
            <div onClick={() => setActiveTab(activeTab === "learning" ? "overview" : "learning")} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">route</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center">Continue</span>
              </div>
              <h4 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active Learning Paths</h4>
              <p className="text-3xl font-bold text-white mt-1">{learningPaths?.filter(p => !p.isCompleted).length || 0}</p>
              <div className="w-full h-1 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-secondary transition-all duration-500" style={{width: '60%'}}></div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400">check</span>
                </div>
                <span className="material-symbols-outlined text-green-400 text-sm">verified</span>
              </div>
              <h4 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Profile Complete</h4>
              <p className="text-3xl font-bold text-white mt-1">{student.profileCompletionPercentage || 0}%</p>
              <div className="w-full h-1 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-green-400 transition-all duration-500" style={{width: `${student.profileCompletionPercentage || 0}%`}}></div>
              </div>
            </div>
          </section>

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
                  onTabChange={setActiveTab}
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
              {activeTab === "ats-check" && <ATSChecker />}
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
