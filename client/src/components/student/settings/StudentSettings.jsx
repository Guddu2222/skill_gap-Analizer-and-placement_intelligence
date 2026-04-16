import React, { useState, useEffect } from "react";
import { updateStudentProfile } from "../../../services/api";
import {
  User,
  Shield,
  Link as LinkIcon,
  Eye,
  Moon,
  Github,
  Award, // Using Award as fallback for LeetCode
  Linkedin,
  Save,
  CheckCircle,
} from "lucide-react";

// The new Settings module for the student dashboard
const StudentSettings = ({ student, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("account");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [formData, setFormData] = useState({
    githubUsername: student?.githubUsername || "",
    leetcodeUsername: student?.leetcodeUsername || "",
    linkedinUrl: student?.linkedinUrl || "",
    placementStatus: student?.placementStatus || "eligible",
    visibilityPreferences: student?.visibilityPreferences || {
      showPlacementScore: true,
      showLearningPaths: true,
      showCgpa: false,
    }
  });

  const [saving, setSaving] = useState(false);

  // Sync formData if student changes
  useEffect(() => {
    if (student) {
      setFormData({
        githubUsername: student.githubUsername || "",
        leetcodeUsername: student.leetcodeUsername || "",
        linkedinUrl: student.linkedinUrl || "",
        placementStatus: student.placementStatus || "eligible",
        visibilityPreferences: student.visibilityPreferences || {
          showPlacementScore: true,
          showLearningPaths: true,
          showCgpa: false,
        }
      });
    }
  }, [student]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateStudentProfile(formData);
      if (onUpdate) await onUpdate();
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleVisibilityPrefChange = (prefKey, val) => {
    setFormData(prev => ({
      ...prev,
      visibilityPreferences: {
        ...prev.visibilityPreferences,
        [prefKey]: val
      }
    }));
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    // Sync initial state if it was changed outside this component somehow
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const tabs = [
    { id: "account", label: "Account & Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "privacy", label: "Visibility", icon: Eye },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <div className="w-full relative z-10 animate-fadeIn">
      {/* ── Settings Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your account preferences, integrations, and placement visibility.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* ── Left Nav ── */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 custom-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal text-left ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Right Content Area ── */}
        <div className="flex-1 bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative z-10 max-w-2xl">
            {/* ═ Account Tab ═ */}
            {activeTab === "account" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Account Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${student?.firstName} ${student?.lastName}`}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Reach out to your college administrator to change your registered name.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Primary Email
                    </label>
                    <input
                      type="email"
                      defaultValue={student?.email || "student@example.com"}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1e1f35] border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
                      Security
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Password</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your login password</p>
                      </div>
                      <button className="px-4 py-2 border border-slate-200 dark:border-white/20 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors dark:text-white">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-600/20">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ═ Integrations Tab ═ */}
            {activeTab === "integrations" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Connected Platforms
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Connect your developer profiles to automatically pull in skills, verified projects, and competitive programming statistics.
                </p>

                <div className="space-y-4">
                  {/* GitHub */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/10">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Github className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-semibold text-slate-800 dark:text-white">GitHub Username</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Connect to verify your projects and code activity.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                       <input 
                         type="text" 
                         placeholder="Username" 
                         value={formData.githubUsername}
                         onChange={(e) => handleChange("githubUsername", e.target.value)}
                         className="flex-1 min-w-[120px] px-3 py-2 text-sm bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg dark:text-white outline-none focus:border-violet-500"
                       />
                    </div>
                  </div>

                  {/* LeetCode */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/10">
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-semibold text-slate-800 dark:text-white">LeetCode Stats</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Link username to show your problem-solving ranking.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                       <input 
                         type="text" 
                         placeholder="Username" 
                         value={formData.leetcodeUsername}
                         onChange={(e) => handleChange("leetcodeUsername", e.target.value)}
                         className="flex-1 min-w-[120px] px-3 py-2 text-sm bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg dark:text-white outline-none focus:border-violet-500"
                       />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/10">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-semibold text-slate-800 dark:text-white">LinkedIn Profile</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Share your professional network with recruiters.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                       <input 
                         type="text" 
                         placeholder="https://linkedin.com/..." 
                         value={formData.linkedinUrl}
                         onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                         className="flex-1 min-w-[120px] px-3 py-2 text-sm bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg dark:text-white outline-none focus:border-violet-500"
                       />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-600/20">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Integrations"}
                  </button>
                </div>
              </div>
            )}

            {/* ═ Privacy Tab ═ */}
            {activeTab === "privacy" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Placement Visibility
                </h2>
                
                <div className="space-y-6">
                  <div className={`p-5 border-2 rounded-xl transition-colors ${formData.placementStatus === "eligible" ? "border-violet-500/20 bg-violet-50 dark:bg-violet-500/5" : "border-slate-200 dark:border-white/10"}`}>
                     <div className="flex items-start gap-4">
                       <div className="mt-1 flex-shrink-0">
                         <div className={`w-4 h-4 rounded-full ${formData.placementStatus === "eligible" ? "bg-green-500 ring-4 ring-green-500/20" : "bg-slate-400"}`} />
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                           <h4 className="font-semibold text-slate-800 dark:text-white">Actively Looking</h4>
                           <input type="radio" 
                             name="visibility" 
                             checked={formData.placementStatus === "eligible"}
                             onChange={() => handleChange("placementStatus", "eligible")}
                             className="w-5 h-5 accent-violet-600 cursor-pointer" />
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-400">
                           Your profile and skill analysis will be fully visible to partnered recruiters and you will be suggested in Smart Shortlists.
                         </p>
                       </div>
                     </div>
                  </div>

                  <div className={`p-5 border-2 rounded-xl transition-colors ${formData.placementStatus === "opted_out" ? "border-violet-500/20 bg-violet-50 dark:bg-violet-500/5" : "border-slate-200 dark:border-white/10"}`}>
                     <div className="flex items-start gap-4">
                       <div className="mt-1 flex-shrink-0">
                         <div className={`w-4 h-4 rounded-full ${formData.placementStatus === "opted_out" ? "bg-red-500 ring-4 ring-red-500/20" : "bg-slate-400"}`} />
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center justify-between mb-1">
                           <h4 className="font-semibold text-slate-800 dark:text-white">Hidden / Closed</h4>
                           <input type="radio" 
                             name="visibility" 
                             checked={formData.placementStatus === "opted_out"}
                             onChange={() => handleChange("placementStatus", "opted_out")}
                             className="w-5 h-5 accent-violet-600 cursor-pointer" />
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-400">
                           You are not looking for jobs. Your profile is hidden from all recruiters and you will not receive interview requests.
                         </p>
                       </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
                      Data Sharing Options
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                        <input type="checkbox" 
                          checked={formData.visibilityPreferences.showPlacementScore}
                          onChange={(e) => handleVisibilityPrefChange("showPlacementScore", e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show Placement Readiness Score to recruiters</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                        <input type="checkbox" 
                           checked={formData.visibilityPreferences.showLearningPaths}
                           onChange={(e) => handleVisibilityPrefChange("showLearningPaths", e.target.checked)}
                           className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show my current learning paths</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg cursor-pointer">
                        <input type="checkbox" 
                           checked={formData.visibilityPreferences.showCgpa}
                           onChange={(e) => handleVisibilityPrefChange("showCgpa", e.target.checked)}
                           className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Include academic grades (CGPA) in profile view</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-600/20">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ═ Appearance Tab ═ */}
            {activeTab === "appearance" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Appearance
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Mode Card */}
                  <button 
                    onClick={() => {
                        document.documentElement.classList.remove("dark");
                        localStorage.setItem("theme", "light");
                        setIsDarkMode(false);
                    }}
                    className={`relative p-1 rounded-2xl flex flex-col text-left transition-all ${
                      !isDarkMode ? "ring-2 ring-violet-500" : "hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="h-32 mb-3 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                       {/* Mock UI for Light Mode */}
                       <div className="flex h-full">
                          <div className="w-1/4 border-r border-slate-200 bg-white" />
                          <div className="flex-1 p-3">
                            <div className="w-1/2 h-2 bg-slate-300 rounded mb-2" />
                            <div className="w-full h-10 bg-white rounded-md border border-slate-200 shadow-sm" />
                          </div>
                       </div>
                    </div>
                    <div className="px-2 pb-2">
                       <h4 className="font-semibold text-slate-800 dark:text-white flex items-center justify-between">
                         Light Mode
                         {!isDarkMode && <CheckCircle className="w-4 h-4 text-violet-600" />}
                       </h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Clean and crisp interface</p>
                    </div>
                  </button>

                  {/* Dark Mode Card */}
                  <button 
                    onClick={toggleDarkMode}
                    className={`relative p-1 rounded-2xl flex flex-col text-left transition-all ${
                      isDarkMode ? "ring-2 ring-violet-500" : "hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="h-32 mb-3 rounded-xl bg-[#0f1020] border border-[#2d2e46] overflow-hidden relative">
                       {/* Mock UI for Dark Mode */}
                       <div className="flex h-full">
                          <div className="w-1/4 border-r border-[#2d2e46] bg-[#141529]" />
                          <div className="flex-1 p-3">
                            <div className="w-1/2 h-2 bg-slate-700 rounded mb-2" />
                            <div className="w-full h-10 bg-[#1e1f35] rounded-md border border-[#3b3c5a] shadow-sm" />
                          </div>
                       </div>
                    </div>
                    <div className="px-2 pb-2">
                       <h4 className="font-semibold text-slate-800 dark:text-white flex items-center justify-between">
                         Dark Mode
                         {isDarkMode && <CheckCircle className="w-4 h-4 text-violet-500" />}
                       </h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Easier on the eyes for coding</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
