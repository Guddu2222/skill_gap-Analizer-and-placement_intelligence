øimport React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import MobileNav from './MobileNav';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = !!localStorage.getItem('token');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // If on auth pages, just render children without layout wrapper
  if (isAuthPage) {
    return <div className="min-h-screen flex items-center justify-center p-4">{children}</div>;
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 glass border-r border-white/10 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
            Fitness Tracker
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            Home
          </NavLink>
          <NavLink to="/workouts" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
             Workouts
          </NavLink>
          <NavLink to="/meals" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
             Meals
          </NavLink>
          <NavLink to="/goals" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
             Goals
          </NavLink>
          <NavLink to="/friends" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
             Friends
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600/20 text-primary-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
             Feed
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Navigation */}
      {loggedIn && <MobileNav />}
    </div>
  );
}
ø"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Qfile:///d:/project/Fittness%20tracking%20website/client/src/components/Layout.jsx:0file:///d:/project/Fittness%20tracking%20website