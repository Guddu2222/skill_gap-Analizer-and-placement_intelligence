import React from "react";
import { Target, Zap, TrendingUp, Info } from "lucide-react";

const ReadinessScoreWidget = ({ score, components }) => {
  // Determine color based on score
  const getScoreColor = (s) => {
    if (s >= 80) return "from-emerald-400 to-teal-500";
    if (s >= 50) return "from-amber-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const colorClass = getScoreColor(score || 0);

  return (
    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 relative group overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-medium text-sm flex items-center gap-1.5">
            Placement Readiness
            <span
              className="cursor-help"
              title="Based on your skills (40%), profile (40%), and resume (20%)"
            >
              <Info className="w-3.5 h-3.5 text-indigo-200" />
            </span>
          </h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-white font-bold text-2xl">{score || 0}</span>
          <span className="text-indigo-200 text-xs font-medium">/ 100</span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score || 0}%` }}
        ></div>
      </div>

      {/* Breakdown Mini-Stats */}
      <div className="flex justify-between text-xs text-indigo-100/80 px-1 border-t border-white/10 pt-3">
        <div className="flex flex-col items-center gap-1 group/item relative">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{components?.skillGap || 0}% Skills</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Target className="w-3.5 h-3.5 text-blue-300" />
          <span>{components?.profile || 0}% Profile</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
          <span>{components?.resume || 0}% Resume</span>
        </div>
      </div>

      {/* Decorative background glow */}
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r ${colorClass} opacity-20 blur-2xl rounded-full pointer-events-none`}
      ></div>
    </div>
  );
};

export default ReadinessScoreWidget;
