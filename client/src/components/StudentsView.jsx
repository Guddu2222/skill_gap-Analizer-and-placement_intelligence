import React, { useState, useMemo } from "react";
import {
  Search,
  Grid3x3,
  List,
  Mail,
  Linkedin,
  Github,
  Award,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import StudentDetailModal from "./StudentDetailModal";

const StudentsView = ({
  students,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  viewMode,
  setViewMode,
  departments,
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = (searchTerm || "").toLowerCase();
      const fullName =
        `${student.first_name || ""} ${student.last_name || ""}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        (student.first_name || "").toLowerCase().includes(search) ||
        (student.last_name || "").toLowerCase().includes(search) ||
        (student.roll_number || "").toLowerCase().includes(search) ||
        (student.college_roll_number || "").toLowerCase().includes(search) ||
        (student.email || "").toLowerCase().includes(search);
      const matchesDept =
        selectedDepartment === "all" ||
        student.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDepartment]);

  const StudentCard = ({ student }) => {
    const name =
      [student.first_name, student.last_name].filter(Boolean).join(" ") ||
      student.roll_number ||
      "Student";
    const initials =
      (student.first_name || "")[0] + (student.last_name || "")[0] || "S";

    return (
      <div
        className="group relative bg-[#141426]/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer border border-white/8 hover:border-violet-500/40 hover:-translate-y-1 flex flex-col justify-between"
        onClick={() => setSelectedStudent(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setSelectedStudent(student)}
      >
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-violet-600/30 border border-white/10 shrink-0">
                {initials.toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors line-clamp-1">
                  {name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {student.roll_number || "No Roll"}
                </p>
                {student.college_roll_number && (
                  <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                    College ID: {student.college_roll_number}
                  </p>
                )}
              </div>
            </div>
            {student.is_placed && (
              <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center shrink-0">
                <Award className="w-3.5 h-3.5 mr-1" />
                Placed
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Department</span>
              <span className="font-semibold text-slate-200">
                {student.department || "–"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">CGPA</span>
              <span
                className={`font-bold ${
                  parseFloat(student.cgpa) >= 8
                    ? "text-emerald-400"
                    : parseFloat(student.cgpa) >= 6
                    ? "text-cyan-400"
                    : "text-amber-400"
                }`}
              >
                {student.cgpa != null ? `${student.cgpa} / 10` : "–"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Graduation Year</span>
              <span className="font-semibold text-slate-200">
                {student.graduation_year ?? "–"}
              </span>
            </div>
          </div>

          {student.skills && student.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Top Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-md text-xs font-medium"
                  >
                    {typeof skill === "string" ? skill : skill.skill_name}
                  </span>
                ))}
                {student.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-white/5 text-slate-400 border border-white/10 rounded-md text-xs">
                    +{student.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-white/5 text-slate-400 text-xs">
          <div className="flex items-center gap-3">
            {student.email && (
              <a
                href={`mailto:${student.email}`}
                className="hover:text-violet-400 transition-colors p-1"
                onClick={(e) => e.stopPropagation()}
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {student.linkedin_url && (
              <a
                href={student.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors p-1"
                onClick={(e) => e.stopPropagation()}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {student.github_url && (
              <a
                href={student.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors p-1"
                onClick={(e) => e.stopPropagation()}
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
          <span className="text-[11px] text-violet-400 group-hover:underline flex items-center gap-1 font-semibold">
            View Profile <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  const StudentListItem = ({ student }) => {
    const name =
      [student.first_name, student.last_name].filter(Boolean).join(" ") ||
      student.roll_number ||
      "Student";
    const initials =
      (student.first_name || "")[0] + (student.last_name || "")[0] || "S";

    return (
      <div
        className="bg-[#141426]/90 backdrop-blur-xl rounded-xl p-4 shadow-md hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer border border-white/8 hover:border-violet-500/40 group"
        onClick={() => setSelectedStudent(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setSelectedStudent(student)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 border border-white/10">
              {initials.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                  {name}
                </h3>
                {student.is_placed && (
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded text-xs font-semibold shrink-0">
                    Placed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {student.roll_number || "–"} • {student.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-white">
                {student.cgpa != null ? `${student.cgpa} CGPA` : "–"}
              </p>
              <p className="text-[11px] text-slate-400">
                Class of {student.graduation_year ?? "–"}
              </p>
            </div>
            <div className="hidden md:flex flex-wrap gap-1 max-w-xs justify-end">
              {student.skills?.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded text-xs"
                >
                  {typeof skill === "string" ? skill : skill.skill_name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const deptList = Array.isArray(departments)
    ? departments
    : departments
    ? Object.keys(departments)
    : [];

  return (
    <div className="space-y-6">
      {/* ─── FILTERS & SEARCH BAR ─── */}
      <div className="bg-[rgba(23,23,43,0.8)] backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number, email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Departments</option>
              {deptList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <p>
            Showing <span className="font-bold text-white">{filteredStudents.length}</span>{" "}
            students matching criteria
          </p>
          {selectedDepartment !== "all" && (
            <button
              onClick={() => setSelectedDepartment("all")}
              className="text-violet-400 hover:text-violet-300 font-semibold"
            >
              Reset Department Filter
            </button>
          )}
        </div>
      </div>

      {/* ─── STUDENTS CONTAINER ─── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id || student._id} student={student} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <StudentListItem key={student.id || student._id} student={student} />
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="bg-[rgba(23,23,43,0.8)] border border-white/8 rounded-2xl p-16 text-center shadow-xl">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No students match your search
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing department filters, or checking roll numbers.
          </p>
        </div>
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentsView;
