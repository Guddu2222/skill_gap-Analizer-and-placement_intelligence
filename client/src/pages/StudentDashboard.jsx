
import React from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, CheckCircle, Lock, PlayCircle, AlertCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const skillData = [
  { subject: 'Data Structures', A: 120, B: 110, fullMark: 150 },
  { subject: 'System Design', A: 98, B: 130, fullMark: 150 },
  { subject: 'Frontend', A: 86, B: 130, fullMark: 150 },
  { subject: 'Database', A: 99, B: 100, fullMark: 150 },
  { subject: 'Communication', A: 85, B: 90, fullMark: 150 },
  { subject: 'Cloud', A: 65, B: 85, fullMark: 150 },
];

const StudentDashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
           <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h1>
           <p className="text-gray-500">Target: Full Stack Developer @ Tier 1 Tech</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Skill Readiness Assessment */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Skill Readiness Assessment</h3>
                 <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 p-2">
                    <option>Compare vs: Market Average</option>
                 </select>
              </div>
              <div className="h-80 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="You" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Target Role" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Critical Skill Gaps */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Critical Skill Gaps</h3>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">3 High Priority</span>
                 </div>
              </div>
              
              <div className="space-y-4">
                 {[
                    { topic: 'Docker & Kubernetes', gap: 'High Importance', action: 'Start Learning' },
                    { topic: 'System Design Arch', gap: 'Medium', action: 'View Resources' },
                    { topic: 'GraphQL', gap: 'Low', action: 'Practice' }
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition bg-white">
                       <div className="flex gap-4 items-center">
                          <div className={`p-3 rounded-lg ${i===0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                             <AlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-semibold text-gray-900">{item.topic}</h4>
                             <p className={`text-xs ${item.gap === 'High Importance' ? 'text-red-500 font-bold' : 'text-orange-500'}`}>Gap: {item.gap}</p>
                          </div>
                       </div>
                       <button className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                          i === 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                       }`}>
                          {item.action}
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Learning Roadmap Carousel */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-lg font-bold text-gray-900">Personalized Learning Roadmap</h3>
                 <p className="text-gray-500 text-sm">Step-by-step path to your target role as Full Stack Developer</p>
              </div>
              <button className="text-blue-600 text-sm font-semibold hover:underline">View Full Path →</button>
           </div>
           
           <div className="flex gap-4 overflow-x-auto pb-4">
              {/* Completed Step */}
              <div className="min-w-[280px] p-1 rounded-xl border-t-4 border-green-500 bg-white shadow-sm">
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-green-50 rounded-full text-green-600"><CheckCircle className="w-5 h-5" /></div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">DSA Foundation</h4>
                    <p className="text-xs text-gray-500">Completed Oct 12</p>
                 </div>
              </div>

              {/* Active Step */}
              <div className="min-w-[320px] p-1 rounded-xl border-t-4 border-indigo-500 bg-indigo-50/10 shadow-md transform scale-105 origin-center">
                 <div className="p-5">
                     <div className="relative h-32 bg-gray-900 rounded-lg mb-4 overflow-hidden group">
                        {/* Placeholder for video thumbnail */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                           <PlayCircle className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition" />
                        </div>
                     </div>
                    <h4 className="font-bold text-gray-900 mb-1">Advanced React Patterns</h4>
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                       <span>65% Complete</span>
                       <span>4 hrs left</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4">
                       <div className="h-full bg-indigo-600 rounded-full w-[65%]"></div>
                    </div>
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Continue Learning</button>
                 </div>
              </div>

              {/* Locked Step */}
              <div className="min-w-[280px] p-1 rounded-xl border-t-4 border-gray-200 bg-gray-50">
                 <div className="p-5 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-gray-200 rounded-full text-gray-500"><Lock className="w-5 h-5" /></div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">System Design for Scale</h4>
                    <p className="text-xs text-gray-500">Locked</p>
                 </div>
              </div>
              
              <div className="min-w-[280px] p-1 rounded-xl border-t-4 border-gray-200 bg-gray-50">
                 <div className="p-5 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-gray-200 rounded-full text-gray-500"><Lock className="w-5 h-5" /></div>
                    </div>
                     <h4 className="font-bold text-gray-900 mb-1">Mock Interview: Amazon</h4>
                     <p className="text-xs text-gray-500">Scheduled: Oct 25</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
