import React, { useState, useEffect } from 'react';
import { Building2, Users, Bookmark, Target, Award, TrendingUp, Briefcase, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import CollegeExplorer from '../components/recruiter/CollegeExplorer';
import AdvancedSearch from '../components/recruiter/AdvancedSearch';
import DomainExperts from '../components/recruiter/DomainExperts';
import SavedCandidates from '../components/recruiter/SavedCandidates';
import { fetchRecruiterStats } from '../services/api';

const TABS = [
  { id: 'explore',  label: 'Explore Colleges', icon: Building2 },
  { id: 'search',   label: 'Advanced Search',  icon: Search },
  { id: 'saved',    label: 'Saved',             icon: Bookmark },
  { id: 'experts',  label: 'Domain Experts',    icon: Target },
];

const StatCard = ({ icon: Icon, title, value, subtitle, color, badge }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {badge != null && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3 h-3" /> {badge}%
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value ?? '–'}</h3>
    <p className="text-sm font-medium text-gray-600 mb-0.5">{title}</p>
    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
  </div>
);

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-900 via-blue-900 to-blue-800 text-white p-8 rounded-2xl mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Recruiter Portal</h1>
                <p className="text-blue-200 text-sm">Discover top talent across campuses</p>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse shadow-md" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Bookmark} title="Saved Candidates"
              value={stats?.savedCandidates ?? 0} subtitle="Shortlisted profiles"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Building2} title="Colleges in Pipeline"
              value={stats?.viewedColleges ?? 0} subtitle="Institutions explored"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={Users} title="In Interviews"
              value={stats?.statusBreakdown?.interviewing ?? 0} subtitle="Active candidates"
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              icon={Award} title="Hired"
              value={stats?.statusBreakdown?.hired ?? 0} subtitle="Successful hires"
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
          </div>
        )}

        {/* Tab Nav */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-8 flex gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {id === 'saved' && stats ? `${label} (${stats.savedCandidates ?? 0})` : label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'explore'  && <CollegeExplorer />}
          {activeTab === 'search'   && <AdvancedSearch />}
          {activeTab === 'saved'    && <SavedCandidates stats={stats} />}
          {activeTab === 'experts'  && <DomainExperts />}
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
