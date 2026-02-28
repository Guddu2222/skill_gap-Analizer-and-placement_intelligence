
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, BarChart2, Settings, Building, LogOut } from 'lucide-react';

const Sidebar = ({ role = 'college' }) => {
  const navigate = useNavigate();
  const links = {
    college: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/college' },
      { icon: Briefcase, label: 'Campus Drives', path: '/college/drives' },
      { icon: Users, label: 'Students', path: '/college/students' },
      { icon: Building, label: 'Recruiters', path: '/college/recruiters' },
      { icon: BarChart2, label: 'Analytics', path: '/college/analytics' },
    ],
    recruiter: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/recruiter' },
      { icon: Briefcase, label: 'Jobs & Postings', path: '/recruiter/jobs' },
      { icon: Users, label: 'Smart Shortlister', path: '/recruiter/smart-shortlist' },
      { icon: Users, label: 'Candidates', path: '/recruiter/candidates' },
      { icon: BarChart2, label: 'Analytics', path: '/recruiter/analytics' },
    ],
    student: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
      { icon: Users, label: 'Alumni Network', path: '/student/alumni' },
      { icon: Briefcase, label: 'Interview Prep', path: '/student/interviews' },
    ]
  };

  const navLinks = links[role] || links.college;

  useEffect(() => {
    // Optionally check token validity here
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-2 text-blue-600">
          <Building className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">PlacementIQ</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path.split('/').length > 2 ? false : true}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
