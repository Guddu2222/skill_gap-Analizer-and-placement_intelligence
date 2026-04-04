import React from "react";
import { Target, Zap, BookOpen, User } from "lucide-react";

/**
 * StudentStatsBar
 * A 4-card real-data stats row shown below the hero banner on the student dashboard.
 * Props:
 *  - student: object from fetchStudentProfile
 *  - skillGapAnalysis: object or null from fetchLatestSkillGapAnalysis
 *  - learningPaths: array from fetchLearningPaths
 */
const StudentStatsBar = ({ student, skillGapAnalysis, learningPaths = [] }) => {
  const totalSkillsAnalyzed = skillGapAnalysis
    ? (skillGapAnalysis.missingSkills?.length || 0) +
      (skillGapAnalysis.strongSkills?.length || 0) +
      (skillGapAnalysis.skillsToImprove?.length || 0)
    : 0;

  const activePathsCount = learningPaths.filter(
    (p) => p.status === "in_progress"
  ).length;

  const stats = [
    {
      label: "Placement Readiness",
      value: student?.placementReadinessScore || 0,
      suffix: "/100",
      icon: "🎯",
      gradient: "from-violet-500 to-indigo-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      textColor: "text-violet-700",
      iconBg: "bg-violet-100",
    },
    {
      label: "Skills Analyzed",
      value: totalSkillsAnalyzed,
      suffix: " skills",
      icon: "⚡",
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100",
    },
    {
      label: "Learning Paths",
      value: activePathsCount,
      suffix: " active",
      icon: "📚",
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      textColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Profile Complete",
      value: student?.profileCompletionPercentage || 0,
      suffix: "%",
      icon: "👤",
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
      textColor: "text-amber-700",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Decorative gradient line */}
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-60`}
          />

          <div className="flex items-start justify-between mb-4">
            <span className="text-2xl">{stat.icon}</span>
            <div
              className={`w-8 h-1 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50`}
            />
          </div>

          <p className={`text-2xl font-black ${stat.textColor} leading-none`}>
            {stat.value}
            <span className="text-sm font-semibold opacity-60 ml-0.5">
              {stat.suffix}
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            {stat.label}
          </p>

          {/* Hover glow */}
          <div
            className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}
          />
        </div>
      ))}
    </div>
  );
};

export default StudentStatsBar;
