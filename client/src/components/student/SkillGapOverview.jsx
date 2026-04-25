import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const SkillGapOverview = ({ analysis, student, onReanalyze, isAnalyzing }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!analysis) return;
    const maxScore = analysis.overallReadinessScore || 0;
    
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
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-primary">target</span>
          <h3 className="text-xl font-bold text-white">Profile Not Analyzed Yet</h3>
          <p className="text-slate-400 max-w-md">Let our AI discover your skill gaps and recommend exact steps.</p>
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 disabled:opacity-70 transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">bolt</span>
            )}
            {isAnalyzing ? "Analyzing..." : "Launch Analysis"}
          </button>
        </div>
      </div>
    );
  }

  const score = analysis.overallReadinessScore || 0;
  const percentage = Math.min(Math.max((score / 100) * 100, 0), 100);
  const profilePerc = student?.profileCompletionPercentage || 0;
  const resumePerc = student?.resumeUrl ? 100 : 0;
  const skillsScore = analysis.overallReadinessScore || 0; 
  // Let's assume skillsScore is equivalent to overall readiness score, or derived. Let's use overallReadinessScore.

  return (
    <div className="animate-fadeIn w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* AI SKILL MATCH SCORE */}
        <div className={`lg:col-span-7 glass-card p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center border-l-4 ${score < 50 ? 'border-error/50' : score < 80 ? 'border-secondary/50' : 'border-green-500/50'}`}>
          <div className="flex-shrink-0 relative">
            <div className="w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                <circle className={`${score < 50 ? 'text-error' : score < 80 ? 'text-secondary' : 'text-green-500'} transition-all duration-1000`} cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="439.6" strokeDashoffset={439.6 - (439.6 * score / 100)} strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{animatedScore}%</span>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 max-w-[60px] text-center">Confidence Score</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-wrap gap-2 mb-6">
              {score < 60 && (
                <span className="px-3 py-1 bg-error-container/20 text-error border border-error/20 text-[10px] font-bold rounded-full uppercase">Critical Action Required</span>
              )}
              {student.targetRole && (
                <span className="px-3 py-1 bg-primary-container/20 text-primary border border-primary/20 text-[10px] font-bold rounded-full uppercase">{student.targetRole}</span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Skills Score</span>
                  <span className={skillsScore < 50 ? "text-error" : skillsScore < 80 ? "text-secondary" : "text-green-400"}>{skillsScore}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${skillsScore < 50 ? "bg-error" : skillsScore < 80 ? "bg-secondary" : "bg-green-400"} transition-all duration-1000`} style={{width: `${skillsScore}%`}}></div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Profile Score</span>
                  <span className={profilePerc < 50 ? "text-error" : profilePerc < 80 ? "text-secondary" : "text-green-400"}>{profilePerc}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${profilePerc < 50 ? "bg-error" : profilePerc < 80 ? "bg-secondary" : "bg-green-400"} transition-all duration-1000`} style={{width: `${profilePerc}%`}}></div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Resume Score</span>
                  <span className={resumePerc === 100 ? "text-green-400" : "text-error"}>{resumePerc}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full ${resumePerc === 100 ? "bg-green-400" : "bg-error"} transition-all duration-1000`} style={{width: `${resumePerc}%`}}></div>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-6 pt-4 border-t border-white/5 italic">
                Weighted Breakdown: 40% Skills · 40% Profile · 20% Resume
            </p>
          </div>
        </div>

        {/* CRITICAL GAPS */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-lg">warning</span>
              Critical Gaps
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar-dark pr-2">
              {analysis.missingSkills?.length > 0 ? (
                analysis.missingSkills.map((gap, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-medium text-on-surface">{gap.skill}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${gap.priority?.toUpperCase() === 'CRITICAL' ? 'bg-error/20 text-error' : gap.priority?.toUpperCase() === 'HIGH' ? 'bg-secondary/20 text-secondary' : 'bg-blue-500/20 text-blue-400'}`}>
                      {gap.priority || "Medium"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">No critical gaps! Great progress.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CORE STRENGTHS */}
        <div className="glass-card p-8 rounded-2xl flex flex-col">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">verified</span>
            Core Strengths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {analysis.strongSkills?.slice(0, 6).map((strength, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-secondary/30 transition-colors text-center flex flex-col justify-center">
                <p className="text-xs font-bold text-white mb-2 line-clamp-1" title={strength.skill}>{strength.skill}</p>
                <div className="flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            ))}
            {(!analysis.strongSkills || analysis.strongSkills.length === 0) && (
              <div className="col-span-3 text-center text-slate-500 text-xs">Building core strengths...</div>
            )}
          </div>
        </div>

        {/* GROWTH AREAS */}
        <div className="glass-card p-8 rounded-2xl flex flex-col">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
            Growth Areas
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar-dark pr-2">
            {analysis.skillsToImprove?.map((area, idx) => {
              const difficultyLevelMap = { beginner: 25, intermediate: 50, advanced: 85 };
              const currentLevelText = (area.currentLevel || "").toLowerCase();
              const currentLevelStr = Object.keys(difficultyLevelMap).find(k => currentLevelText.includes(k)) || "intermediate";
              const currentNumber = difficultyLevelMap[currentLevelStr] || 50;
              const targetNumber = 95;
              const gap = targetNumber - currentNumber;
              
              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-bold text-white">{area.skill}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{area.reasoning}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded">+{gap}% to target</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest rounded-full relative">
                    <div className="absolute h-full bg-blue-500 rounded-full z-10 transition-all duration-1000" style={{width: `${currentNumber}%`}}></div>
                    <div className="absolute inset-0 border-r-2 border-white/40 border-dashed z-20 pointer-events-none" style={{width: `${targetNumber}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STRATEGIC ROADMAP */}
      <section className="glass-card p-8 rounded-2xl mb-8">
        <h3 className="text-sm font-bold text-white mb-10 uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">timeline</span>
          Strategic Roadmap
        </h3>
        <div className="relative ml-4 md:ml-12 border-l-2 border-white/5 space-y-12 pb-4">
          {analysis.priorityLearningPath?.map((stepString, index) => {
             const isCurrent = index === 0;
             const isUpcoming = index === 1;
             
             let title = "Execute Priority Goal";
             let description = stepString;
             const stepMatch = stepString.match(/^(?:Step|Phase)\s*\d*[:\-]*\s*([^-\.]+)(?:[-.](.*))?$/i);
             if (stepMatch && stepMatch[1]) {
                 title = stepMatch[1].trim();
                 description = stepMatch[2] ? stepMatch[2].trim() : stepString;
             } else if (stepString.length < 35) {
                 title = stepString;
             }
             
             let totalWeeksText = String(analysis?.estimatedTimeToReady || "0");
             let totalWeeks = parseInt(totalWeeksText.match(/\d+/)?.[0] || "0");
             let weeksPerPhase = Math.max(1, Math.floor(totalWeeks / analysis.priorityLearningPath.length));
             
             return (
              <div key={index} className="relative pl-8">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${isCurrent ? 'bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-surface-container-highest border-2 border-white/20'}`}></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`text-lg font-bold ${isCurrent ? 'text-white' : 'text-white/60'}`}>Phase {index + 1}: {title}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${isCurrent ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                        {isCurrent ? 'Active' : isUpcoming ? 'Upcoming' : 'Future'}
                      </span>
                    </div>
                    <p className={`text-xs max-w-xl ${isCurrent ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 ${isCurrent ? 'bg-surface-container' : 'bg-surface-container/50'}`}>
                    <span className={`material-symbols-outlined text-xs ${isCurrent ? 'text-slate-400' : 'text-slate-500'}`}>schedule</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>~{weeksPerPhase} Weeks</span>
                  </div>
                </div>
              </div>
             );
          })}
        </div>
      </section>

      {/* EXECUTIVE CAREER ADVICE */}
      <section className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1040] to-[#2D1B69] border border-white/10 shadow-2xl relative mb-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="relative p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="px-3 py-1 bg-secondary text-on-secondary text-[10px] font-black rounded uppercase tracking-[0.2em] mb-4 inline-block">Expert Guidance</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">Executive Career Strategy</h3>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {(Array.isArray(analysis.careerAdvice) ? analysis.careerAdvice : [analysis.careerAdvice]).map((advice, index) => {
              // Extract potential title from advice string before the first period if it's short enough
              let title = `Insight ${index + 1}`;
              let desc = advice;
              const periodIndex = advice.indexOf('.');
              if (periodIndex > 0 && periodIndex < 50) {
                 title = advice.substring(0, periodIndex);
                 desc = advice.substring(periodIndex + 1).trim();
              }
              
              return (
                <div key={index} className="flex gap-4 items-start group">
                  <span className="text-2xl font-black text-secondary/30 group-hover:text-secondary transition-colors">{(index + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                    <p className="text-xs text-on-primary-container/70 leading-relaxed">{desc || title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default SkillGapOverview;
