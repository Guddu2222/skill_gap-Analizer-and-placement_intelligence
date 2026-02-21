
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Briefcase, Users, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CollegeDashboard = () => {
  const [stats, setStats] = useState({
    placedCount: 0,
    offerCount: 0,
    avgPackage: 0,
    activeCompanies: 0
  });
  const [gapAnalysis, setGapAnalysis] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        placedCount: 450,
        offerCount: 620,
        avgPackage: '12.5 LPA',
        activeCompanies: 45
      });
    }, 500);

    // Simulate fetching College Features Data
    setTimeout(() => {
        setGapAnalysis([
            { skill: 'React', demandCount: 150, supplyCount: 50, gap: 100 },
            { skill: 'AWS', demandCount: 120, supplyCount: 30, gap: 90 },
            { skill: 'Docker', demandCount: 80, supplyCount: 10, gap: 70 },
        ]);
        setAtRiskStudents([
            { id: 1, name: 'Rahul K.', reason: 'Low CGPA', riskLevel: 'Critical' },
            { id: 2, name: 'Sneha M.', reason: 'High Rejection', riskLevel: 'Critical' },
            { id: 3, name: 'Amit S.', reason: 'Skill Gap', riskLevel: 'Moderate' },
        ]);
    }, 800);
  }, []);

  const data = [
    { name: 'Aug', offers: 20, placed: 15 },
    { name: 'Sep', offers: 35, placed: 25 },
    { name: 'Oct', offers: 45, placed: 30 },
    { name: 'Nov', offers: 60, placed: 25 },
    { name: 'Dec', offers: 50, placed: 45 },
    { name: 'Jan', offers: 80, placed: 60 },
    { name: 'Feb', offers: 65, placed: 55 },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="college" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Placement Command Center</h1>
            <p className="text-gray-500">Academic Year 2023-2024 Overview</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Last updated: Today, 12:30 PM</span>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              RF
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Offers" value="458" subtext="Current Batch" trend={12} icon={Briefcase} />
          <StatCard title="Placement Rate" value="78%" subtext="122 Unplaced" trend={5} icon={Users} />
          <StatCard title="Avg Salary" value="₹ 12.5 LPA" subtext="Highest: ₹ 45 LPA" trend={8} icon={Award} />
          <StatCard title="Active Drives" value="18" subtext="4 Scheduled Today" trend={0} icon={TrendingUp} />
        </div>

        {/* Analytics Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Curriculum Gap Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Curriculum Gap Analysis</h3>
                    <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    {gapAnalysis.map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{item.skill}</span>
                                <span className="text-red-500 font-semibold">{item.gap} Short</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(item.supplyCount / item.demandCount) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Supply: {item.supplyCount}</span>
                                <span>Demand: {item.demandCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100">
                    Schedule Workshop
                </button>
            </div>

            {/* At-Risk Students */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">At-Risk Radar</h3>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">{atRiskStudents.length} Critical</span>
                </div>
                <div className="space-y-3">
                    {atRiskStudents.map((student) => (
                        <div key={student.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.reason}</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50">
                                Intervene
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Placement & Offer Conversion Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                    cursor={{fill: '#f9fafb'}}
                  />
                  <Bar dataKey="offers" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} name="Offers Released" />
                  <Bar dataKey="placed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Students Placed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Pending Actions</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-amber-900">Approve Job Post</h4>
                    <span className="text-xs bg-white px-2 py-1 rounded text-amber-700 font-bold shadow-sm">New</span>
                 </div>
                 <p className="text-sm text-amber-800 mb-3">Amazon SDE - 24 Applicants</p>
                 <div className="flex gap-2">
                    <button className="bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-amber-700 transition">Approve</button>
                    <button className="bg-white text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 transition">Review</button>
                 </div>
              </div>

               <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-red-900">Scheduling Conflict</h4>
                    <span className="text-xs bg-red-200 px-2 py-1 rounded text-red-800 font-bold">Urgent</span>
                 </div>
                 <p className="text-sm text-red-800 mb-3">TCS & Infosys slots overlap</p>
                 <button className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition w-full">Resolve Conflict</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;
