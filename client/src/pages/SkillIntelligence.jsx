
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Target, TrendingUp, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
// import { fetchSkillGap } from '../services/api'; // To be implemented

const SkillIntelligence = () => {
  const [data, setData] = useState({
    targetRole: 'Full Stack Developer',
    matchScore: 0,
    missingSkills: [],
    acquiredSkills: []
  });

  // Mock Data for now
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        targetRole: 'Full Stack Developer',
        matchScore: 68,
        requiredSkills: ['React', 'Node.js', 'System Design', 'MongoDB', 'AWS', 'Docker'],
        acquiredSkills: ['React', 'Node.js', 'MongoDB'],
        missingSkills: ['System Design', 'AWS', 'Docker']
      });
    }, 500);
  }, []);

  const chartData = [
    { subject: 'React', A: 90, fullMark: 100 },
    { subject: 'Node.js', A: 85, fullMark: 100 },
    { subject: 'MongoDB', A: 80, fullMark: 100 },
    { subject: 'Sys Design', A: 40, fullMark: 100 },
    { subject: 'AWS', A: 30, fullMark: 100 },
    { subject: 'Docker', A: 20, fullMark: 100 },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
           <h1 className="text-2xl font-bold text-gray-900">Skill Intelligence Engine</h1>
           <p className="text-gray-500">Analyze your profile against your dream role: <span className="text-blue-600 font-semibold">{data.targetRole}</span></p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Score Card */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                       strokeDasharray={440} strokeDashoffset={440 - (440 * data.matchScore) / 100}
                       className="text-blue-600 transition-all duration-1000 ease-out" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-gray-900">{data.matchScore}%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Match</span>
                 </div>
              </div>
              <p className="mt-4 text-center text-gray-600">You are <span className="font-semibold text-gray-900">Great</span> match for this role!</p>
           </div>

           {/* Radar Chart */}
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skill Proficiency Map</h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Proficiency" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                      <Tooltip />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Missing Skills */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-red-500" />
                 Critical Gaps
              </h3>
              <div className="space-y-3">
                 {data.missingSkills.map((skill, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                       <span className="font-medium text-red-700">{skill}</span>
                       <button className="text-xs font-semibold bg-white text-red-600 px-3 py-1.5 rounded-md border border-red-200 hover:bg-red-50">
                          Learn Now
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           {/* Acquired Skills */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-500" />
                 Verified Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                 {data.acquiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                       {skill}
                    </span>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default SkillIntelligence;
