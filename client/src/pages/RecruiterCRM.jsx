
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Building, Users, DollarSign, TrendingUp, Search, Filter } from 'lucide-react';

const RecruiterCRM = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to /api/college-features/recruiter-crm
    // For now using mock data matching the backend response structure
    setTimeout(() => {
      setRecruiters([
        { id: 1, company: 'Google', tier: 'Tier 1', visits: 5, hires: 12, avgPackage: '28 LPA', status: 'Active' },
        { id: 2, company: 'Amazon', tier: 'Tier 1', visits: 4, hires: 25, avgPackage: '24 LPA', status: 'Active' },
        { id: 3, company: 'Infosys', tier: 'Mass', visits: 10, hires: 150, avgPackage: '5 LPA', status: 'Active' },
        { id: 4, company: 'StartUp Inc', tier: 'Tier 2', visits: 1, hires: 2, avgPackage: '12 LPA', status: 'Dormant' },
        { id: 5, company: 'TechCorp', tier: 'Tier 2', visits: 0, hires: 0, avgPackage: '0 LPA', status: 'New Lead' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="college" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Relationship Management (CRM)</h1>
              <p className="text-gray-500">Track engagement, hiring trends, and lifetime value of recruiters.</p>
           </div>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
              Add New Recruiter
           </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           {[
              { label: 'Active Recruiters', value: '45', icon: Building, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Hires (YTD)', value: '328', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Avg Package', value: '8.5 LPA', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'YoY Growth', value: '+12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
           ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                 </div>
              </div>
           ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search companies..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
           </div>
           <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
           </button>
        </div>

        {/* Recruiter Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                 <tr>
                    <th className="px-6 py-4 font-semibold">Company</th>
                    <th className="px-6 py-4 font-semibold">Tier</th>
                    <th className="px-6 py-4 font-semibold">Engagement</th>
                    <th className="px-6 py-4 font-semibold">Hiring Stats</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {recruiters.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-gray-50 transition">
                       <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{recruiter.company}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${
                             recruiter.tier === 'Tier 1' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                             recruiter.tier === 'Mass' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                             {recruiter.tier}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-600">
                          {recruiter.visits} Campus Visits
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{recruiter.hires} Hires</div>
                          <div className="text-xs text-gray-500">Avg: {recruiter.avgPackage}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${
                             recruiter.status === 'Active' ? 'text-green-600' : 
                             recruiter.status === 'Dormant' ? 'text-red-500' : 'text-blue-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                               recruiter.status === 'Active' ? 'bg-green-500' : 
                               recruiter.status === 'Dormant' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></span>
                            {recruiter.status}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
};

export default RecruiterCRM;
