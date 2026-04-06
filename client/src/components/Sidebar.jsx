import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart2,
  Settings,
  Building,
  LogOut,
  BookOpen,
  Target,
  Award,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Zap,
  GraduationCap,
  UserCheck,
  Brain,
  TrendingUp,
} from "lucide-react";

const Sidebar = ({ role = "college" }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = {
    college: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/college" },
      { icon: Briefcase, label: "Campus Drives", path: "/college/drives" },
      { icon: Users, label: "Students", path: "/college/students" },
      { icon: Building, label: "Recruiters", path: "/college/recruiters" },
      { icon: BarChart2, label: "Analytics", path: "/college/analytics" },
    ],
    recruiter: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/recruiter" },
      { icon: Briefcase, label: "Jobs & Postings", path: "/recruiter/jobs" },
      {
        icon: UserCheck,
        label: "Smart Shortlister",
        path: "/recruiter/smart-shortlist",
      },
      { icon: Users, label: "Candidates", path: "/recruiter/candidates" },
      { icon: BarChart2, label: "Analytics", path: "/recruiter/analytics" },
    ],
    student: [
      { icon: LayoutDashboard, label: "Overview", path: "/student/overview" },
      { icon: BookOpen, label: "My Paths", path: "/student/paths" },
      { icon: Target, label: "Skill Radar", path: "/student/skills" },
      { icon: Award, label: "Courses", path: "/student/courses" },
      { icon: TrendingUp, label: "Compare", path: "/student/compare" },
      {
        icon: Briefcase,
        label: "Opportunities",
        path: "/student/opportunities",
      },
      { icon: Users, label: "Mentorship", path: "/student/mentorship" },
      {
        icon: MessageSquare,
        label: "Interviews",
        path: "/student/interviews",
      },
    ],
  };

  const roleLabels = {
    college: "College Hub",
    recruiter: "Recruiter CRM",
    student: "Student Portal",
  };

  const roleIcons = {
    college: GraduationCap,
    recruiter: Brain,
    student: Zap,
  };

  const navLinks = links[role] || links.college;
  const RoleIcon = roleIcons[role] || Zap;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{
        background:
          "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <RoleIcon className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold text-base tracking-tight block truncate">
              SkillBridge
            </span>
            <span className="text-violet-300/70 text-[10px] font-medium uppercase tracking-widest">
              {roleLabels[role]}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.4)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Navigation
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto custom-scrollbar-dark">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path.split("/").length <= 2}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden ${
                isActive
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80 hover:bg-white/8"
              }`
            }
            title={collapsed ? link.label : undefined}
          >
            {({ isActive }) => (
              <>
                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 rounded-xl" />
                )}
                <span
                  className={`relative flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-violet-400"
                      : "group-hover:text-white/70"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                </span>
                {!collapsed && (
                  <span className="relative truncate">{link.label}</span>
                )}
                {isActive && !collapsed && (
                  <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl z-50">
                    {link.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div
        className="px-2 py-4 space-y-0.5 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <NavLink
          to={`/${role}/settings`}
          className={({ isActive }) =>
            `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden ${
              isActive
                ? "bg-white/15 text-white shadow-lg"
                : "hover:bg-white/10"
            }`
          }
          style={({ isActive }) =>
            !isActive ? { color: "rgba(255,255,255,0.45)" } : undefined
          }
          title={collapsed ? "Settings" : undefined}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 rounded-xl" />
              )}
              <Settings
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-violet-400" : "group-hover:text-white/70"
                }`}
              />
              {!collapsed && (
                <span
                  className={`transition-colors ${
                    isActive ? "text-white" : "group-hover:text-white/70"
                  }`}
                >
                  Settings
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl z-50">
                  Settings
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
              )}
            </>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group overflow-hidden"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl z-50">
              Logout
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
