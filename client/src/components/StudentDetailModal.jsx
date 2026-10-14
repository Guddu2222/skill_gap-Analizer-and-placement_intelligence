import React from "react";
import {
  X,
  Mail,
  Phone,
  Linkedin,
  Github,
  Download,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Code2,
  ExternalLink,
} from "lucide-react";
import { normalizeDepartment } from "../constants/departments";

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  const getProficiencyColor = (level) => {
    const l = (level || "").toLowerCase();
    if (l === "expert") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    if (l === "advanced") return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
    if (l === "intermediate") return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
  };

  const groupedSkills = (student.skills || []).reduce((acc, skill) => {
    const cat = skill.skill_category || "technical";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const displayName =
    [student.first_name, student.last_name].filter(Boolean).join(" ") ||
    student.roll_number ||
    "Student";

  const initials =
    ((student.first_name || "")[0] || "") + ((student.last_name || "")[0] || "S");

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#141426] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative text-[#e3e0f1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient header glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/15 border-b border-white/8 p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start space-x-5">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-violet-600/30 border border-white/15 shrink-0">
              {initials.toUpperCase()}
            </div>
            <div className="flex-1 pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{displayName}</h2>
                {student.is_placed && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Placed
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-3">
                {student.roll_number || "No Roll"} • {normalizeDepartment(student.department)}
                {student.college_roll_number ? ` • College ID: ${student.college_roll_number}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                {student.email && (
                  <a
                    href={`mailto:${student.email}`}
                    className="flex items-center space-x-1.5 hover:text-violet-400 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.email}</span>
                  </a>
                )}
                {student.phone && (
                  <a
                    href={`tel:${student.phone}`}
                    className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 overflow-y-auto max-h-[calc(90vh-170px)] space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
              <TrendingUp className="w-6 h-6 text-violet-400 mb-2" />
              <p className="text-2xl font-bold text-white tracking-tight">
                {student.cgpa != null ? student.cgpa : "–"}
              </p>
              <p className="text-xs text-slate-400">Cumulative GPA</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
              <Calendar className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-2xl font-bold text-white tracking-tight">
                {student.graduation_year ?? "–"}
              </p>
              <p className="text-xs text-slate-400">Graduation Year</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
              <Code2 className="w-6 h-6 text-indigo-400 mb-2" />
              <p className="text-2xl font-bold text-white tracking-tight">
                {student.skills?.length || 0}
              </p>
              <p className="text-xs text-slate-400">Verified Skills</p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
              {student.is_placed ? (
                <>
                  <Award className="w-6 h-6 text-emerald-400 mb-2" />
                  <p className="text-2xl font-bold text-emerald-400 tracking-tight">
                    ₹{student.placement_package}L
                  </p>
                  <p className="text-xs text-slate-400">Annual CTC</p>
                </>
              ) : (
                <>
                  <MapPin className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-lg font-bold text-white tracking-tight">Seeking</p>
                  <p className="text-xs text-slate-400">Campus Drives</p>
                </>
              )}
            </div>
          </div>

          {/* Placed Highlight Card */}
          {student.is_placed && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Placed at {student.placed_company || "Recruiter Partner"}
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Package: ₹{student.placement_package} LPA • Offer Confirmed
                </p>
              </div>
            </div>
          )}

          {/* Skills Breakdown */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-violet-400" />
              Verified Skills Inventory
            </h3>
            <div className="space-y-4">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 capitalize text-slate-300">
                    {(category || "other").replace(/_/g, " ")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-[#10101e] rounded-xl px-3.5 py-2.5 border border-white/5"
                      >
                        <span className="font-medium text-slate-200 text-xs">
                          {typeof skill === "string" ? skill : skill.skill_name}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getProficiencyColor(
                            skill.proficiency_level
                          )}`}
                        >
                          {skill.proficiency_level || "Intermediate"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedSkills).length === 0 && (
                <p className="text-slate-500 text-xs py-4 text-center">No skills registered yet.</p>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/8">
            {student.resume_url && (
              <a
                href={student.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            )}
            {student.linkedin_url && (
              <a
                href={student.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {student.github_url && (
              <a
                href={student.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold transition-all"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
