import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Zap, Award, AlertCircle } from 'lucide-react';

const SkillRadarChart = ({ analysis, studentSkills }) => {
  // Generate radar chart data dynamically based on the skill gap response
  const generateRadarData = () => {
    if (!analysis) return [];
    
    const data = [];
    
    // Extract unique skills to plot
    const strongSkills = (analysis.strongSkills || []).map(s => s.skill);
    const improveSkills = (analysis.skillsToImprove || []).map(s => s.skill);
    const missingSkills = (analysis.missingSkills || []).map(s => s.skill);
    
    // Fallback to basic student skills if no complex analysis available
    const allSkills = [...new Set([
      ...strongSkills,
      ...improveSkills,
      ...missingSkills,
      ...(studentSkills || []).map(s => typeof s === 'string' ? s : s.skillName)
    ])].filter(Boolean); // remove undefined/null
    
    allSkills.forEach(skill => {
      let userScore = 50; // default 
      
      if (strongSkills.includes(skill)) userScore = Math.floor(Math.random() * 20 + 130); // 130-150
      else if (improveSkills.includes(skill)) userScore = Math.floor(Math.random() * 30 + 70); // 70-100
      else if (missingSkills.includes(skill)) userScore = Math.floor(Math.random() * 30 + 30); // 30-60
      else if (studentSkills?.some(s => (typeof s === 'string' ? s : s.skillName) === skill)) userScore = 120; // acquired previously
      
      data.push({
        subject: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
        You: userScore,
        TargetRole: 150,
        fullMark: 150
      });
    });

    return data.slice(0, 6); // Limit to top 6 skills for visual clarity on radar
  };

  const radarData = generateRadarData();

  if (!analysis) {
     return (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
           <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">Run an analysis to generate your skill radar</p>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Skill Readiness Assessment */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Skill Readiness Profile
            </h3>
            <p className="text-sm text-slate-500">Compared to {analysis?.targetRole || 'industry standard'}</p>
          </div>
          {analysis?.marketAlignmentScore && (
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-indigo-600">{analysis.marketAlignmentScore}%</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Market Alignment</span>
            </div>
          )}
        </div>
        
        <div className="h-[350px] flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-50">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="You" dataKey="You" stroke="#4f46e5" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Target Role" dataKey="TargetRole" stroke="#10b981" strokeDasharray="3 3" strokeWidth={2} fill="transparent" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name) => [value, name === 'You' ? 'Your Competency' : 'Target Requirement']}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-slate-500">
              <p>Not enough skill data to build chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* Critical Skill Gaps List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Critical Action Items
            </h3>
            <p className="text-sm text-slate-500">Skills required for your target role</p>
          </div>
          {analysis?.missingSkills?.length > 0 && (
            <span className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
              {analysis.missingSkills.length} Action Items
            </span>
          )}
        </div>
        
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {analysis?.missingSkills?.length > 0 ? (
            analysis.missingSkills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition group">
                <div className="flex gap-4 items-center">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{skill.skill}</h4>
                    <p className="text-xs text-rose-500 font-medium">Priority: {skill.priority || 'High'}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm">
                  Add to Path
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-medium text-slate-900">No major gaps identified!</p>
              <p className="text-sm text-slate-500">You perfectly match your target role's skill profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;
