import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Target, Zap, Award, AlertCircle } from "lucide-react";

const SkillRadarChart = ({ analysis, studentSkills }) => {
  // Generate radar chart data dynamically based on the skill gap response
  const generateRadarData = () => {
    if (!analysis) return [];

    const data = [];

    // Extract unique skills to plot
    const strongSkills = (analysis.strongSkills || []).map((s) => s.skill);
    const improveSkills = (analysis.skillsToImprove || []).map((s) => s.skill);
    const missingSkills = (analysis.missingSkills || []).map((s) => s.skill);

    // Fallback to basic student skills if no complex analysis available
    const allSkills = [
      ...new Set([
        ...strongSkills,
        ...improveSkills,
        ...missingSkills,
        ...(studentSkills || []).map((s) =>
          typeof s === "string" ? s : s.skillName,
        ),
      ]),
    ].filter(Boolean); // remove undefined/null

    allSkills.forEach((skill) => {
      let userScore = 50; // default

      if (strongSkills.includes(skill))
        userScore = Math.floor(Math.random() * 20 + 130); // 130-150
      else if (improveSkills.includes(skill))
        userScore = Math.floor(Math.random() * 30 + 70); // 70-100
      else if (missingSkills.includes(skill))
        userScore = Math.floor(Math.random() * 30 + 30); // 30-60
      else if (
        studentSkills?.some(
          (s) => (typeof s === "string" ? s : s.skillName) === skill,
        )
      )
        userScore = 120; // acquired previously

      data.push({
        subject: skill.length > 15 ? skill.substring(0, 15) + "..." : skill,
        You: userScore,
        TargetRole: 150,
        fullMark: 150,
      });
    });

    return data.slice(0, 6); // Limit to top 6 skills for visual clarity on radar
  };

  const radarData = generateRadarData();

  if (!analysis) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Target className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Skill Profile Locked</h3>
        <p className="text-slate-400 font-medium max-w-md">
          Run an AI analysis to generate your comparative skill radar and view market alignment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* Skill Readiness Assessment */}
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-secondary" />
              Skill Readiness Profile
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Compared to {analysis?.targetRole || "industry standard"}
            </p>
          </div>
          {analysis?.marketAlignmentScore && (
            <div className="flex flex-col items-end bg-secondary/10 px-4 py-2 rounded-2xl border border-secondary/20">
              <span className="text-2xl font-black text-secondary">
                {analysis.marketAlignmentScore}%
              </span>
              <span className="text-[8px] text-secondary font-bold uppercase tracking-widest mt-1">
                Market Alignment
              </span>
            </div>
          )}
        </div>

        <div className="h-[350px] flex items-center justify-center bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,158,255,0.05),transparent_70%)] pointer-events-none"></div>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#ffffff" strokeOpacity={0.1} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#acaab3", fontSize: 10, fontWeight: 700, fontFamily: "Inter, sans-serif" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="You"
                  dataKey="You"
                  stroke="#ba9eff"
                  strokeWidth={2}
                  fill="url(#colorYou)"
                  fillOpacity={1}
                />
                <Radar
                  name="Target Role"
                  dataKey="TargetRole"
                  stroke="#7c3aed"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba9eff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ba9eff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 31, 39, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }}
                  itemStyle={{
                    color: '#ba9eff',
                    fontWeight: 'bold'
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "You" ? "Your Competency" : "Target Requirement",
                  ]}
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
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-error" />
              Critical Action Items
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Skills required for your target role
            </p>
          </div>
          {(Array.isArray(analysis?.missingSkills) ? analysis.missingSkills : []).length > 0 && (
            <span className="bg-error/10 border border-error/20 text-error text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,71,87,0.2)]">
              {analysis.missingSkills.length} Items
            </span>
          )}
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar-dark flex-1">
          {(Array.isArray(analysis?.missingSkills) ? analysis.missingSkills : []).length > 0 ? (
            analysis.missingSkills.map((skill, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-error/30 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-error/5 text-error/50 flex items-center justify-center group-hover:bg-error/10 group-hover:text-error transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5 group-hover:text-error transition-colors">
                      {skill.skill}
                    </h4>
                    <p className="text-[9px] text-error/70 font-black uppercase tracking-widest">
                      Priority: {skill.priority || "High"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-error/10 hover:text-error hover:border-error/30 transition-all">
                  Add
                </button>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <Award className="w-10 h-10 text-green-400" />
              </div>
              <p className="font-bold text-white text-lg mb-2">
                No major gaps identified!
              </p>
              <p className="text-sm text-slate-400 max-w-[250px]">
                You perfectly match your target role's skill profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;
