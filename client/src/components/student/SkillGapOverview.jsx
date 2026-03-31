import React from 'react';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Star,
  Zap,
  Trophy,
  BookOpen,
  ChevronRight,
  Activity
} from 'lucide-react';

const SkillGapOverview = ({ analysis, student, onReanalyze, isAnalyzing }) => {
  if (!analysis) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-16 text-center shadow-2xl shadow-slate-200/50 border border-white">
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-indigo-50 text-indigo-600 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
            <Target className="w-10 h-10" />
          </div>
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Profile Not Analyzed Yet</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
          Unlock your personalized roadmap to success. Let our AI discover your skill gaps and recommend the exact steps you need to take.
        </p>
        <button 
          onClick={onReanalyze}
          disabled={isAnalyzing}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isAnalyzing ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <Zap className="w-5 h-5" />
          )}
          <span>{isAnalyzing ? 'Analyzing with AI...' : 'Launch AI Analysis'}</span>
          {!isAnalyzing && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    );
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-rose-100/80 text-rose-700 border-rose-200',
      high: 'bg-orange-100/80 text-orange-700 border-orange-200',
      medium: 'bg-amber-100/80 text-amber-700 border-amber-200',
      low: 'bg-emerald-100/80 text-emerald-700 border-emerald-200'
    };
    const style = styles[priority?.toLowerCase()] || styles.medium;
    return `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`;
  };

  const getReadinessLevel = (score) => {
    if (score >= 80) return { text: 'Exceptional', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (score >= 60) return { text: 'On Track', color: 'text-indigo-400', bg: 'bg-indigo-400/10' };
    if (score >= 40) return { text: 'Needs Focus', color: 'text-amber-400', bg: 'bg-amber-400/10' };
    return { text: 'Critical Action Required', color: 'text-rose-400', bg: 'bg-rose-400/10' };
  };

  const readinessLevel = getReadinessLevel(analysis.overallReadinessScore || 0);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Premium Readiness Score Card */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        {/* Subtle background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row items-center xl:items-end justify-between gap-8">
          
          {/* Main Info */}
          <div className="flex-1 w-full text-center xl:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6 shadow-sm">
              <Trophy className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-900 tracking-wide uppercase">Readiness Overview</span>
            </div>
            
            <h1 className="flex items-baseline justify-center xl:justify-start gap-1 mb-4">
              <span className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter">{analysis.overallReadinessScore || 0}</span>
              <span className="text-2xl md:text-3xl font-bold text-slate-400">/100</span>
            </h1>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-indigo-500/50 pl-5 mb-8 font-medium">
              {analysis.analysisSummary}
            </p>
            
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
              <div className={`px-5 py-2.5 rounded-2xl font-bold border shadow-sm ${readinessLevel.bg.replace('/10', '/30')} ${readinessLevel.color.replace('400', '700')} z-10`}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {readinessLevel.text}
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium shadow-sm">
                <span className="text-slate-400 mr-2">Target Role:</span> 
                <span className="text-slate-800 font-bold">{analysis.targetDomain} • {analysis.targetRole}</span>
              </div>
            </div>
          </div>

          {/* Action / Progress Sidebar */}
          <div className="w-full xl:w-72 flex flex-col items-center xl:items-end space-y-6 pt-6 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-8">
            <button 
              onClick={onReanalyze}
              disabled={isAnalyzing}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 rounded-xl py-4 px-6 font-bold flex items-center justify-center gap-3 group shadow-xl hover:shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                 <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                 <Zap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}</span>
            </button>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-white/50 px-4 py-2 rounded-xl border border-slate-100">
              Updated • {new Date(analysis.updatedAt || analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar Bottom */}
        <div className="relative mt-12 z-10 w-full max-w-4xl mx-auto xl:mx-0">
          <div className="h-4 bg-slate-200/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-violet-500 rounded-full relative"
              style={{ width: `${analysis.overallReadinessScore || 0}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Layout for Skills */}
      <div className="flex flex-col gap-6">
        
        {/* Missing Skills Column */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-sm border border-rose-100">
              <AlertTriangle className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Critical Gaps</h3>
              <p className="text-sm font-semibold text-rose-500/80 uppercase tracking-widest mt-0.5">Immediate Action Required</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.missingSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="group bg-white hover:bg-rose-50/30 border border-slate-200 hover:border-rose-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-rose-100/50 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight w-3/4">{skill.skill}</h4>
                  <span className={getPriorityBadge(skill.priority)}>{skill.priority}</span>
                </div>
                <p className="text-sm text-slate-600 mb-5 line-clamp-2 group-hover:line-clamp-none transition-all leading-relaxed">{skill.reasoning}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    {skill.estimatedLearningTime}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Level: <span className="text-slate-800">{skill.difficulty}</span>
                  </span>
                </div>
              </div>
            ))}
            {!analysis.missingSkills?.length && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200">
                 <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5"><CheckCircle className="w-10 h-10 text-emerald-500"/></div>
                 <p className="text-slate-800 font-bold text-lg">No critical missing skills!</p>
                 <p className="text-slate-500 mt-1">You're solid here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills to Improve Column */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-white flex items-center justify-center shadow-sm border border-amber-100">
              <TrendingUp className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Growth Areas</h3>
              <p className="text-sm font-semibold text-amber-500/80 uppercase tracking-widest mt-0.5">Level Up Your Foundation</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.skillsToImprove?.slice(0, 5).map((skill, index) => (
              <div key={index} className="group bg-white hover:bg-amber-50/30 border border-slate-200 hover:border-amber-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/50 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="font-bold text-slate-800 text-lg mb-5 leading-tight">{skill.skill}</h4>
                <div className="relative mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3"/> {skill.currentLevel}</span>
                    <span className="text-indigo-600 flex items-center gap-1"><Target className="w-3 h-3"/> {skill.requiredLevel}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-slate-400 w-1/3"></div>
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-1/3 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{skill.reasoning}</p>
              </div>
            ))}
            {!analysis.skillsToImprove?.length && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200">
                 <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5"><Star className="w-10 h-10 text-emerald-500"/></div>
                 <p className="text-slate-800 font-bold text-lg">No improvements needed.</p>
                 <p className="text-slate-500 mt-1">Looking good!</p>
              </div>
            )}
          </div>
        </div>

        {/* Strong Skills Column */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-white flex items-center justify-center shadow-sm border border-emerald-100">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Core Strengths</h3>
              <p className="text-sm font-semibold text-emerald-500/80 uppercase tracking-widest mt-0.5">Competitive Advantages</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.strongSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="relative group bg-gradient-to-br from-emerald-50/80 to-white hover:to-emerald-50/50 border border-emerald-100 hover:border-emerald-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/60 hover:-translate-y-1 overflow-hidden">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 group-hover:scale-110 duration-500">
                  <Star className="w-32 h-32 fill-emerald-500 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-slate-800 text-lg mb-4 pr-8">{skill.skill}</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="px-3 py-1.5 bg-white text-emerald-700 shadow-sm rounded-xl text-xs font-black border border-emerald-200/60">
                      {skill.strengthLevel}
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      skill.marketDemand?.toLowerCase() === 'high' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {skill.marketDemand} Demand
                    </span>
                  </div>
                  <p className="text-sm text-emerald-950/70 leading-relaxed font-semibold bg-white/50 p-4 rounded-xl border border-emerald-100/50">{skill.leverageAdvice}</p>
                </div>
              </div>
            ))}
             {!analysis.strongSkills?.length && (
               <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200">
                 <p className="text-slate-800 font-bold text-lg">Keep building to develop core strengths.</p>
              </div>
             )}
          </div>
        </div>

      </div>

      {/* Strategic Roadmap - Fully Redesigned */}
      <div className="relative w-full bg-white/40 backdrop-blur-2xl border border-white rounded-[3rem] p-8 md:p-14 shadow-[0_10px_40px_rgb(0,0,0,0.06)] overflow-hidden mt-6 mb-6 group/roadmap">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover/roadmap:bg-indigo-500/10 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover/roadmap:bg-emerald-500/10 transition-colors duration-1000"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 px-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/50 mb-6 shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-900 tracking-widest uppercase">Strategic Roadmap</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Your Path to Excellence</h3>
          </div>
          
          {/* Integrated Timeline Badge */}
          <div className="flex flex-col items-start lg:items-end hover:-translate-y-1 transition-transform duration-300">
            <p className="text-slate-500 font-bold mb-3 uppercase tracking-widest text-xs ml-2">Target Completion</p>
            <div className="flex items-center gap-5 bg-white pl-4 pr-8 py-4 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 cursor-default">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center animate-pulse">
                <Clock className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600">
                  {String(analysis.estimatedTimeToReady || '0').match(/\d+/) ? String(analysis.estimatedTimeToReady || '0').match(/\d+/)[0] : '0'}
                </span>
                <span className="text-xl font-black text-slate-300">WKS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* The continuous vertical line */}
          <div className="absolute left-[39px] md:left-[51px] top-8 bottom-8 w-1 bg-gradient-to-b from-indigo-500 via-violet-400 to-indigo-100 rounded-full opacity-30"></div>
          
          <div className="space-y-12">
            {analysis.priorityLearningPath?.map((step, index) => (
              <div key={index} className="relative flex items-start gap-8 md:gap-12 group">
                {/* Timeline Node */}
                <div className="relative z-10 shrink-0 mt-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-[6px] border-indigo-50 rounded-full flex items-center justify-center shadow-xl group-hover:border-indigo-100 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 cursor-default">
                    <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600">{index + 1}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-indigo-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none"></div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100/80 shadow-lg shadow-slate-200/40 group-hover:shadow-2xl group-hover:shadow-indigo-200 group-hover:-translate-y-2 group-hover:border-indigo-100 transition-all duration-500 relative overflow-hidden cursor-default">
                  {/* Subtle hover gradient flare */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Animated header layout */}
                  <div className="flex items-center gap-3 mb-2 relative h-8">
                     <Zap className="w-6 h-6 text-indigo-500 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 absolute left-0" />
                     <h4 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:translate-x-10 transition-transform duration-500 absolute left-0">Phase {index + 1}</h4>
                  </div>
                  
                  <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mt-6 group-hover:text-slate-900 transition-colors duration-300 relative z-10">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Advice Widget */}
      {analysis.careerAdvice && (
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
             <div className="w-24 h-24 rounded-[2rem] bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-indigo-400">
               <Star className="w-12 h-12 text-white fill-white" />
             </div>
             <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-5">
                  <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase">Expert Guidance</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Executive Career Advice</h3>
                 <div className="text-slate-300 text-lg leading-relaxed font-light border-l-4 border-indigo-500 pl-6">
                  {Array.isArray(analysis.careerAdvice) ? (
                    <ul className="space-y-4">
                      {analysis.careerAdvice.map((advice, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{analysis.careerAdvice}</p>
                  )}
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapOverview;
