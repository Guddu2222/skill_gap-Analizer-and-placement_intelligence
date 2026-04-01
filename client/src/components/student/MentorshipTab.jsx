import React from "react";
import { Linkedin, Mail, GraduationCap, Users } from "lucide-react";

const alumniData = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "SDE II",
    company: "Amazon",
    batch: 2022,
    dept: "CSE",
    skills: ["Java", "AWS", "System Design"],
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Frontend Engineer",
    company: "Uber",
    batch: 2023,
    dept: "ISE",
    skills: ["React", "Redux", "Performance"],
  },
  {
    id: 3,
    name: "Ankit Gupta",
    role: "Data Scientist",
    company: "Microsoft",
    batch: 2021,
    dept: "CSE",
    skills: ["Python", "ML", "Azure"],
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Product Manager",
    company: "Google",
    batch: 2020,
    dept: "ECE",
    skills: ["Strategy", "Analytics", "UX"],
  },
];

const MentorshipTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Alumni Mentorship
          </h2>
          <p className="text-slate-500">
            Connect with seniors working in your dream companies.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {["Recommended for you", "Google", "Microsoft", "Amazon", "Uber"].map(
          (filter, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                i === 0
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-indigo-200"
              }`}
            >
              {filter}
            </button>
          ),
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniData.map((alumni) => (
          <div
            key={alumni.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                {alumni.name.charAt(0)}
              </div>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {alumni.name}
            </h3>
            <p className="text-indigo-600 font-semibold text-sm mb-3">
              {alumni.role} @ {alumni.company}
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-xs mb-5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span className="font-medium">
                Batch of {alumni.batch} • {alumni.dept}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {alumni.skills.map((skill, j) => (
                <span
                  key={j}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button className="w-full py-2.5 bg-slate-900 border border-transparent text-white font-semibold rounded-xl hover:bg-indigo-600 hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Request Mentorship
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipTab;
