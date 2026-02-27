import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StudentsView from '../components/StudentsView';
import SkillsAnalytics from '../components/SkillsAnalytics';
import {
  Users,
  TrendingUp,
  Award,
  Building2,
  Download,
  BarChart3,
  Code,
  Briefcase,
} from 'lucide-react';
import {
  fetchCollegeDashboard,
  fetchCollegeStudents,
  fetchCollegeSkillsAnalytics,
  exportCollegeStudents,
} from '../services/api';

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend != null && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 font-semibold">{trend}%</span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      </div>
    )}
  </div>
);

const CollegeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [exporting, setExporting] = useState(false);

  const loadDashboard = async () => {
    try {
      setError(null);
      const data = await fetchCollegeDashboard();
      setDashboardData(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.msg || err.message || 'Failed to load dashboard';
      setError(msg);
      setDashboardData(null);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await fetchCollegeStudents({ limit: 100 });
      setStudents(data.students || []);
    } catch (err) {
      if (activeView === 'students') setError(err.response?.data?.msg || 'Failed to load students');
    }
  };

  const loadSkills = async () => {
    try {
      const data = await fetchCollegeSkillsAnalytics();
      setSkillsData(data);
    } catch (err) {
      if (activeView === 'skills') setError(err.response?.data?.msg || 'Failed to load skills analytics');
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadDashboard();
      if (cancelled) return;
      await Promise.all([loadStudents(), loadSkills()]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportCollegeStudents('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.msg || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const departments = dashboardData?.departmentStats ? Object.keys(dashboardData.departmentStats) : [];

  if (loading && !dashboardData) {
    return (
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <Sidebar role="college" />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="college" />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {dashboardData?.college?.name ? `${dashboardData.college.name} – Placement Dashboard` : 'Placement Command Center'}
            </h1>
            <p className="text-gray-500">
              {dashboardData?.college?.location ? `${dashboardData.college.location} • ` : ''}Academic Year Overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">{error}</span>
            )}
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </header>

        {!dashboardData?.college && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-amber-800">
              You are not linked to a college, or the college record is missing. Dashboard and student data are available only for college admins with an associated college.
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeView === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveView('students')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeView === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Students
          </button>
          <button
            type="button"
            onClick={() => setActiveView('skills')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeView === 'skills' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-5 h-5" />
            Skills Analytics
          </button>
        </div>

        {activeView === 'overview' && dashboardData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Students"
                value={dashboardData.statistics?.totalStudents ?? 0}
                subtitle="Registered students"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Award}
                title="Placed Students"
                value={dashboardData.statistics?.placedStudents ?? 0}
                subtitle="Successfully placed"
                color="bg-gradient-to-br from-green-500 to-emerald-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Placement Rate"
                value={`${dashboardData.statistics?.placementRate ?? 0}%`}
                subtitle="Success rate"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatCard
                icon={Briefcase}
                title="Avg Package"
                value={`₹${dashboardData.statistics?.avgPackage ?? 0}L`}
                subtitle="Per annum"
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Department-wise Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.departmentStats &&
                  Object.entries(dashboardData.departmentStats).map(([dept, data]) => (
                    <div
                      key={dept}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{dept}</h3>
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Students</span>
                          <span className="font-semibold text-gray-900">{data.total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Placed</span>
                          <span className="font-semibold text-green-600">{data.placed}</span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Placement Rate</span>
                            <span className="font-semibold">
                              {data.total > 0 ? ((data.placed / data.total) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                              style={{ width: `${data.total > 0 ? (data.placed / data.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {(!dashboardData.departmentStats || Object.keys(dashboardData.departmentStats).length === 0) && (
                <p className="text-gray-500">No department data yet.</p>
              )}
            </div>
          </div>
        )}

        {activeView === 'students' && (
          <StudentsView
            students={students}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            viewMode={viewMode}
            setViewMode={setViewMode}
            departments={departments}
          />
        )}

        {activeView === 'skills' && <SkillsAnalytics skillsData={skillsData} />}
      </main>
    </div>
  );
};

export default CollegeDashboard;
