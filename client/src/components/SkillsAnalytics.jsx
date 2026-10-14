import React, { useState } from "react";
import { Code2, Database, Cloud, Wrench, Users, Target, Sparkles, BarChart2, Layers } from "lucide-react";

const SkillsAnalytics = ({ skillsData }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getCategoryIcon = (category) => {
    const icons = {
      programming_language: Code2,
      database: Database,
      cloud: Cloud,
      framework: Wrench,
      devops: Target,
    };
    return icons[category] || Code2;
  };

  const getCategoryGradient = (category) => {
    const colors = {
      programming_language: "from-violet-500 to-indigo-600",
      database: "from-emerald-500 to-teal-600",
      cloud: "from-cyan-500 to-blue-600",
      framework: "from-amber-500 to-orange-600",
      devops: "from-rose-500 to-red-600",
      soft_skill: "from-fuchsia-500 to-pink-600",
      domain_knowledge: "from-indigo-500 to-purple-600",
    };
    return colors[category] || "from-violet-500 to-cyan-500";
  };

  const filteredSkills =
    selectedCategory === "all"
      ? skillsData?.topSkills
      : skillsData?.allSkills?.filter((s) => s.category === selectedCategory) ||
        [];

  const totalSkillCount =
    skillsData?.allSkills?.reduce((sum, s) => sum + (s.count || 0), 0) || 0;
  const avgSkillsPerStudent =
    skillsData?.totalStudents > 0
      ? (totalSkillCount / skillsData.totalStudents).toFixed(1)
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn text-[#e3e0f1]">
      {/* ─── SUMMARY KPI CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 shadow-xl group hover:border-violet-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Unique Skills
            </h3>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {skillsData?.allSkills?.length ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">Documented across all cohort profiles</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 shadow-xl group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-600/10 rounded-full blur-3xl group-hover:bg-emerald-600/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Skills per Student
            </h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {avgSkillsPerStudent}
          </p>
          <p className="text-xs text-slate-400 mt-2">Verified proficiencies per student</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 shadow-xl group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Skill Domains
            </h3>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {skillsData?.skillsByCategory?.length ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">Distinct domain classifications</p>
        </div>
      </div>

      {/* ─── CATEGORY FILTER TILES ─── */}
      <div className="rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Browse by Technology Domain
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`p-3.5 rounded-xl border text-center transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-violet-400 shadow-lg shadow-violet-600/25"
                : "bg-white/5 border-white/8 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <p className="text-lg font-bold">All</p>
            <p className="text-[11px] opacity-80 mt-0.5">Comprehensive</p>
          </button>

          {skillsData?.skillsByCategory?.map((cat, index) => {
            const Icon = getCategoryIcon(cat.category);
            const isSelected = selectedCategory === cat.category;
            return (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-violet-400 shadow-lg shadow-violet-600/25"
                    : "bg-white/5 border-white/8 text-slate-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-white" : "text-violet-400"}`} />
                <p className="text-base font-bold leading-tight">{cat.count}</p>
                <p className="text-[10px] capitalize opacity-80 truncate max-w-full mt-0.5">
                  {(cat.category || "").replace(/_/g, " ")}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TOP SKILLS PROGRESS LIST ─── */}
      <div className="rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              {selectedCategory === "all"
                ? "Most Prevalent Student Skills"
                : `Top ${(selectedCategory || "").replace(/_/g, " ")} Proficiencies`}
            </h2>
            <p className="text-xs text-slate-400">
              Ranked by total cohort adoption and student proficiency levels
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 w-fit">
            {filteredSkills?.length ?? 0} skills identified
          </span>
        </div>

        <div className="space-y-5">
          {(filteredSkills || []).slice(0, 20).map((skill, index) => {
            const total = skillsData?.totalStudents || 1;
            const percentage = ((skill.count / total) * 100).toFixed(1);
            const levels = skill.proficiencyLevels || {};
            return (
              <div
                key={index}
                className="group p-4 rounded-2xl bg-[#141426]/90 border border-white/5 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-violet-300 font-bold text-xs shrink-0">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {(skill.category || "").replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">{skill.count} students</span>
                    <span className="text-xs text-cyan-400 ml-2 font-semibold">({percentage}%)</span>
                  </div>
                </div>

                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${getCategoryGradient(skill.category)} rounded-full transition-all duration-700`}
                    style={{
                      width: `${Math.min(100, parseFloat(percentage))}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="w-2 h-2 bg-red-400 rounded-full" />
                    Beginner: <span className="text-white font-medium">{levels.beginner ?? 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    Intermediate: <span className="text-white font-medium">{levels.intermediate ?? 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Advanced: <span className="text-white font-medium">{levels.advanced ?? 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    Expert: <span className="text-white font-medium">{levels.expert ?? 0}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {(!filteredSkills || filteredSkills.length === 0) && (
          <p className="text-slate-500 text-center py-12 text-sm">
            No skill telemetry available for this domain filter.
          </p>
        )}
      </div>

      {/* ─── SKILL MATRIX TABLE ─── */}
      <div className="rounded-3xl bg-[rgba(23,23,43,0.8)] backdrop-blur-xl border border-white/8 p-7 shadow-xl overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-4">
          Cohort Proficiency Distribution Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4 text-center">Beginner</th>
                <th className="py-3 px-4 text-center">Intermediate</th>
                <th className="py-3 px-4 text-center">Advanced</th>
                <th className="py-3 px-4 text-center">Expert</th>
                <th className="py-3 px-4 text-right">Total Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {(filteredSkills || []).slice(0, 10).map((skill, index) => {
                const levels = skill.proficiencyLevels || {};
                return (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {skill.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        {levels.beginner ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {levels.intermediate ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {levels.advanced ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {levels.expert ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {skill.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillsAnalytics;
