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

const SkillGapOverview = ({ analysis, student, onReanalyze }) => {
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
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto"
        >
          <Zap className="w-5 h-5" />
          <span>Launch AI Analysis</span>
          <ArrowRight className="w-5 h-5 ml-2" />
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
    <div className="space-y-8 animate-fadeIn">
      {/* Premium Readiness Score Card */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/20 blur-[80px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row items-center xl:items-end justify-between gap-8">
          
          {/* Main Info */}
          <div className="flex-1 w-full text-center xl:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-inner">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Readiness Overview</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{analysis.overallReadinessScore || 0}</span><span className="text-2xl text-slate-500 ml-1 font-medium">/100</span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-indigo-500 pl-4 mb-8">
              {analysis.analysisSummary}
            </p>
            
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
              <div className={`px-5 py-2.5 rounded-xl font-bold backdrop-blur-md border border-white/5 ${readinessLevel.bg} ${readinessLevel.color} shadow-inner`}>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {readinessLevel.text}
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 font-medium">
                <span className="text-slate-500 mr-2">Target Role:</span> 
                <span className="text-white font-semibold">{analysis.targetDomain} • {analysis.targetRole}</span>
              </div>
            </div>
          </div>

          {/* Action / Progress Sidebar */}
          <div className="w-full xl:w-72 flex flex-col items-center xl:items-end space-y-6 pt-6 border-t xl:border-t-0 xl:border-l border-white/10 xl:pl-8">
            <button 
              onClick={onReanalyze}
              className="w-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all duration-300 rounded-2xl py-4 px-6 font-bold flex items-center justify-center gap-3 group shadow-lg"
            >
              <Zap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Refresh Analysis</span>
            </button>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Updated • {new Date(analysis.updatedAt || analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar Bottom */}
        <div className="relative mt-12 z-10">
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-violet-500 rounded-full relative"
              style={{ width: `${analysis.overallReadinessScore || 0}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Missing Skills Column */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Critical Gaps</h3>
              <p className="text-sm font-medium text-slate-500">Skills requiring immediate action</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.missingSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-rose-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-slate-800 leading-tight">{skill.skill}</h4>
                  <span className={getPriorityBadge(skill.priority)}>{skill.priority}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">{skill.reasoning}</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 bg-white/50 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {skill.estimatedLearningTime}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                    <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                    {skill.difficulty}
                  </span>
                </div>
              </div>
            ))}
            {!analysis.missingSkills?.length && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><CheckCircle className="w-8 h-8 text-emerald-400"/></div>
                 <p className="text-slate-600 font-medium">No critical missing skills! You're solid here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills to Improve Column */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Growth Areas</h3>
              <p className="text-sm font-medium text-slate-500">Level up your existing foundation</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.skillsToImprove?.slice(0, 5).map((skill, index) => (
              <div key={index} className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-1">
                <h4 className="font-bold text-slate-800 mb-4 leading-tight">{skill.skill}</h4>
                <div className="relative mb-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 px-1">
                    <span>{skill.currentLevel}</span>
                    <span className="text-indigo-600">{skill.requiredLevel}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-slate-400 w-1/3"></div>
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-1/3 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{skill.reasoning}</p>
              </div>
            ))}
            {!analysis.skillsToImprove?.length && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Star className="w-8 h-8 text-emerald-400"/></div>
                 <p className="text-slate-600 font-medium">No immediate improvements needed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Strong Skills Column */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-800">Core Strengths</h3>
              <p className="text-sm font-medium text-slate-500">Your competitive advantages</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.strongSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="relative group bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-16 h-16 fill-emerald-500 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-slate-800 mb-3 pr-8">{skill.skill}</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-white text-emerald-700 shadow-sm rounded-lg text-xs font-bold border border-emerald-100">
                      {skill.strengthLevel}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                      skill.marketDemand?.toLowerCase() === 'high' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {skill.marketDemand} Demand
                    </span>
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed font-medium">{skill.leverageAdvice}</p>
                </div>
              </div>
            ))}
             {!analysis.strongSkills?.length && (
               <div className="flex flex-col items-center justify-center py-10 text-center">
                 <p className="text-slate-600 font-medium">Keep building and practicing to develop core strengths.</p>
              </div>
             )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Widget */}
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-white/80 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Estimated Timeline</h3>
          <p className="text-sm text-slate-500 mb-6 px-4">Focus dedicated time to reach job readiness</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{analysis.estimatedTimeToReady || 0}</span>
            <span className="text-xl font-bold text-slate-400">Weeks</span>
          </div>
        </div>

        {/* Priority Learning Path Widget */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-indigo-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target className="w-48 h-48 text-indigo-900" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-indigo-600" />
              Strategic Learning Path
            </h3>
            <div className="space-y-4 max-w-2xl">
              {analysis.priorityLearningPath?.map((step, index) => (
                <div key={index} className="flex gap-4 group cursor-default">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      {index + 1}
                    </div>
                    {index < analysis.priorityLearningPath.length - 1 && (
                      <div className="w-0.5 h-full bg-indigo-100 my-1 group-hover:bg-indigo-300 transition-colors"></div>
                    )}
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm border border-white rounded-2xl p-4 flex-1 shadow-sm group-hover:shadow-md transition-all duration-300 mb-2">
                    <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Advice Widget */}
      {analysis.careerAdvice && (
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
             <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-md">
               <Star className="w-10 h-10 text-indigo-300" />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Executive Career Advice</h3>
                <p className="text-indigo-100/80 text-lg leading-relaxed max-w-4xl font-light">
                  {analysis.careerAdvice}
                </p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapOverview;
