import React from "react";
import { Eye, UserCheck, AlertTriangle, ShieldCheck } from "lucide-react";

const InterviewHUD = ({ postureScore, eyeContactScore, isSlouching, gazeDeviated, warningMsg }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl text-white space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            MediaPipe Vision Proctor HUD
          </span>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Posture Card */}
        <div className={`p-3 rounded-xl border ${isSlouching ? "bg-amber-950/30 border-amber-500/40" : "bg-slate-950/50 border-slate-800"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Posture
            </span>
            <span className={`text-xs font-bold ${postureScore >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
              {postureScore}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${postureScore >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${postureScore}%` }}
            />
          </div>
        </div>

        {/* Eye Contact Card */}
        <div className={`p-3 rounded-xl border ${gazeDeviated ? "bg-rose-950/30 border-rose-500/40" : "bg-slate-950/50 border-slate-800"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" /> Eye Gaze
            </span>
            <span className={`text-xs font-bold ${eyeContactScore >= 80 ? "text-emerald-400" : "text-rose-400"}`}>
              {eyeContactScore}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${eyeContactScore >= 80 ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${eyeContactScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Pill Alert */}
      {warningMsg && (
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs font-medium animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{warningMsg}</span>
        </div>
      )}
    </div>
  );
};

export default InterviewHUD;
