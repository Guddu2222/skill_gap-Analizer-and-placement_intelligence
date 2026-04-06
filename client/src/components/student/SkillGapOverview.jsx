import React, { useState, useEffect } from "react";
import { Target, Zap } from "lucide-react";

// Priority Config for Critical Gaps
const priorityConfig = {
  HIGH: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500", label: "HIGH" },
  CRITICAL: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "CRITICAL" },
  MEDIUM: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "MEDIUM" },
  LOW: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "LOW" },
};

// Colors for Core Strengths
const strengthColors = [
  { from: "from-emerald-400", to: "to-teal-500", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  { from: "from-blue-400", to: "to-indigo-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  { from: "from-violet-400", to: "to-purple-500", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
];

// Colors for Roadmap
const phaseColors = [
  { bg: "bg-violet-600", light: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", line: "bg-violet-200" },
  { bg: "bg-blue-600", light: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", line: "bg-blue-200" },
  { bg: "bg-indigo-600", light: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", line: "bg-indigo-200" },
  { bg: "bg-purple-600", light: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", line: "bg-purple-200" },
];

const SkillGapOverview = ({ analysis, student, onReanalyze, isAnalyzing }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Parse total weeks from estimatedTimeToReady
  let totalWeeksText = String(analysis?.estimatedTimeToReady || "0");
  let totalWeeks = parseInt(totalWeeksText.match(/\d+/)?.[0] || "0");

  useEffect(() => {
    if (!analysis) return;
    const maxScore = analysis.overallReadinessScore || 0;
    
    // Reset and animate
    setAnimatedScore(0);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= maxScore) {
            clearInterval(interval);
            return maxScore;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [analysis?.overallReadinessScore]);

  if (!analysis) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-16 text-center shadow-sm border border-slate-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Target className="w-12 h-12 text-indigo-500" />
          <h3 className="text-xl font-bold text-slate-800">Profile Not Analyzed Yet</h3>
          <p className="text-slate-500 max-w-md">Let our AI discover your skill gaps and recommend exact steps.</p>
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-70 transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isAnalyzing ? "Analyzing..." : "Launch Analysis"}
          </button>
        </div>
      </div>
    );
  }

  const score = analysis.overallReadinessScore || 0;
  const percentage = Math.min(Math.max((score / 100) * 100, 0), 100);
  const lastUpdated = new Date(analysis.updatedAt || analysis.createdAt).toLocaleDateString();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. ReadinessOverview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Skill Match AI Score</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Updated • {lastUpdated}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Score Visualization */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="58" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle
                    cx="72" cy="72" r="58"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - percentage / 100)}`}
                    style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{animatedScore}</span>
                  <span className="text-sm text-slate-400 font-medium">/ 100</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-2 w-full">
                {score < 60 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-amber-700 text-xs font-semibold">Critical Action Required</span>
                  </div>
                )}
                {student?.targetRole && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-violet-700 text-xs font-semibold">{student.targetRole}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Text */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-3">AI-Powered Analysis</h2>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
                <p className="pl-4 text-slate-600 text-sm leading-relaxed">
                  {analysis.analysisSummary}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>AI Skill Match Confidence</span>
                  <span className="font-semibold text-violet-600">{score}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 delay-500"
                    style={{
                      width: `${percentage}%`,
                      background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                    }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Skills Score", value: `${score}%`, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700" },
                  { label: "Profile", value: `${student?.profileCompletionPercentage || 0}%`, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
                  { label: "Resume", value: `${student?.resumeUrl ? 100 : 0}%`, color: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-700" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Formula Explanation */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">Placement Readiness Formula</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Your global readiness ({student?.placementReadinessScore || 0}/100) aggregates these stats.</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] bg-white px-2.5 py-1.5 rounded border border-slate-200 shadow-sm shrink-0 whitespace-nowrap">
                  <span className="text-violet-600 font-bold">40% Skills</span>
                  <span className="opacity-50">+</span>
                  <span className="text-blue-600 font-bold">40% Profile</span>
                  <span className="opacity-50">+</span>
                  <span className="text-green-600 font-bold">20% Resume</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-6 flex items-center justify-between">
            <button 
              onClick={onReanalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-200 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8l-8-0z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
            </button>
            <span className="text-xs text-slate-400">
              Last analyzed: {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Critical Gaps */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Critical Gaps</h3>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Immediate Action Required</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-700 text-xs font-bold">{analysis.missingSkills?.length || 0} Issues</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {analysis.missingSkills?.length ? (
              analysis.missingSkills.map((gap, index) => {
                const config = priorityConfig[gap.priority?.toUpperCase()] || priorityConfig.HIGH;
                return (
                  <div key={index} className="relative flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all duration-200 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-slate-800 text-sm">{gap.skill}</h4>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed mb-3">{gap.reasoning}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Level: {gap.difficulty}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
               <div className="text-center p-4 text-slate-500 text-sm">No critical gaps! Great progress.</div>
            )}
          </div>
        </div>

        {/* 3. Core Strengths */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Core Strengths</h3>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Competitive Advantages</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
            </div>
          </div>
          <div className="p-6 grid gap-4">
            {analysis.strongSkills?.length ? (
              analysis.strongSkills.map((strength, index) => {
                const color = strengthColors[index % strengthColors.length];
                return (
                  <div key={index} className={`relative flex items-center gap-4 p-4 rounded-xl border ${color.border} ${color.bg} hover:shadow-md transition-all duration-200 group overflow-hidden`}>
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl shadow-md border border-white">✨</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`font-bold text-sm ${color.text}`}>{strength.skill}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color.badge}`}>
                            {strength.marketDemand}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{strength.leverageAdvice}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-4 text-slate-500 text-sm">Building core strengths...</div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Growth Areas */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:max-w-4xl">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Growth Areas</h3>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Level Up Your Foundation</p>
          </div>
          <div className="ml-auto flex items-center px-3 py-1 bg-amber-100 rounded-full">
            <span className="text-amber-700 text-xs font-bold">{analysis.skillsToImprove?.length || 0} Skills</span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {analysis.skillsToImprove?.map((area, index) => {
            // Map text severity or skill gap to a percentage
            const difficultyLevelMap = { beginner: 25, intermediate: 50, advanced: 85 };
            const currentLevelText = (area.currentLevel || "").toLowerCase();
            const currentLevelStr = Object.keys(difficultyLevelMap).find(k => currentLevelText.includes(k)) || "intermediate";
            const currentNumber = difficultyLevelMap[currentLevelStr] || 50;
            const targetNumber = 95; // default high target

            const gap = targetNumber - currentNumber;

            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{area.skill}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">+{gap}% to target</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Current</span>
                    <span className="font-bold text-slate-800">{currentNumber}%</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-bold text-amber-600">{targetNumber}%</span>
                    <span className="text-slate-500">Target</span>
                  </div>
                </div>
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="absolute top-0 left-0 h-full rounded-full opacity-30" style={{ width: `${targetNumber}%`, background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                  <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000" style={{ width: `${currentNumber}%`, background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500" style={{ left: `${targetNumber}%` }} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{area.reasoning}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Strategic Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2"><span className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Strategic Roadmap</span></div>
              <h3 className="text-lg font-bold text-slate-800">Your Path to Excellence</h3>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Target Completion</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 rounded-xl">
              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-2xl font-black text-violet-700">{totalWeeks}</span>
              <span className="text-xs text-violet-600 font-medium">WKS</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="relative">
            {analysis.priorityLearningPath?.map((stepString, index) => {
              const color = phaseColors[index % phaseColors.length];
              const isLast = index === analysis.priorityLearningPath.length - 1;
              const isCurrent = index === 0; // Fake assumption: first step is active

              // basic regex to split "Phase/Step 1: Title - description" if possible
              const stepMatch = stepString.match(/^(?:Step|Phase)\s*\d*[:\-]*\s*([^-\.]+)(?:[-.](.*))?$/i);
              let title = `Phase ${index + 1}`;
              let description = stepString;

              if (stepMatch && stepMatch[1]) {
                 title = stepMatch[1].trim();
                 description = stepMatch[2] ? stepMatch[2].trim() : stepString;
              }

              return (
                <div key={index} className="flex gap-6 mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg z-10 ring-4 ring-white ${isCurrent ? color.bg : "bg-slate-200"}`}>
                      {isCurrent ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg> : (index + 1)}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[60px] mt-1 mb-1 ${isCurrent ? color.line : "bg-slate-100"}`} />}
                  </div>

                  <div className={`flex-1 mb-6 p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${isCurrent ? `${color.light} ${color.border} shadow-sm` : "bg-slate-50 border-slate-100 hover:border-slate-200"}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${color.light} ${color.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${color.bg} animate-pulse`} />
                            Active
                          </span>
                        )}
                        <h4 className={`font-bold text-sm ${isCurrent ? color.text : "text-slate-700"}`}>
                          Phase {index + 1}: {title}
                        </h4>
                      </div>
                      <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-500 font-semibold shadow-sm">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        ~{Math.max(1, Math.floor(totalWeeks / analysis.priorityLearningPath.length))} weeks
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Career Advice */}
      <div className="rounded-2xl overflow-hidden shadow-xl lg:max-w-4xl">
        <div className="relative p-8" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />

          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-1">
                ✨ Expert Guidance
              </span>
              <h3 className="text-white text-xl font-bold">Executive Career Advice</h3>
            </div>
          </div>

          <div className="relative space-y-4">
            {(Array.isArray(analysis.careerAdvice) ? analysis.careerAdvice : [analysis.careerAdvice]).map((advice, index, arr) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                    {index + 1}
                  </div>
                  {index < arr.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1 min-h-[20px]" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">{advice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SkillGapOverview;
