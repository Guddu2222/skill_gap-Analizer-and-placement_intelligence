
import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const funnelData = [
  { name: 'AI Matched', value: 2450 },
  { name: 'Screened', value: 1200 },
  { name: 'Tech Round', value: 450 },
  { name: 'HR Round', value: 150 },
  { name: 'Offered', value: 78 },
];

const RecruiterDashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="recruiter" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-8 rounded-2xl mb-8 shadow-xl">
           <h1 className="text-3xl font-bold mb-2">Hello, Sarah!</h1>
           <p className="text-blue-200">Manage your campus hiring drives and candidate pipeline.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Applications" value="2,450" subtext="+15% vs last season" trend={15} icon={FileText} />
          <StatCard title="Interviews" value="86" subtext="12 Scheduled Today" trend={0} icon={Users} />
          <StatCard title="Offers Rolled" value="124" subtext="78 Accepted" trend={5} icon={CheckCircle} />
          <StatCard title="Time to Hire" value="18 Days" subtext="-2 days improvement" trend={-10} icon={Clock} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Hiring Funnel Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fill: '#4b5563', fontSize: 12}} />
                  <Tooltip 
                     cursor={{fill: '#f9fafb'}}
                     contentStyle={{borderRadius: '8px'}}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(230, 80%, ${70 - (index * 10)}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Interviews</h3>
            <div className="space-y-4">
               {[1,2,3].map((i) => (
                   <div key={i} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 mr-4 overflow-hidden">
                        {/* Placeholder Avatar */}
                        <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            C{i}
                        </div>
                      </div>
                      <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">Candidate Name</h4>
                          <p className="text-xs text-gray-500">10:00 AM • Tech Round</p>
                      </div>
                      <button className="text-blue-600 text-xs font-semibold px-2 py-1 bg-blue-50 rounded hover:bg-blue-100">Join</button>
                   </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
