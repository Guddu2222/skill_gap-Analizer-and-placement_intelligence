
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, ChevronDown, MessageSquare, Star, Clock } from 'lucide-react';

const interviews = [
  { id: 1, company: 'Google', role: 'SDE Intern', difficulty: 'Hard', date: '2 days ago', rounds: 3, outcome: 'Selected' },
  { id: 2, company: 'Amazon', role: 'SDE I', difficulty: 'Medium', date: '1 week ago', rounds: 4, outcome: 'Rejected' },
  { id: 3, company: 'Microsoft', role: 'SWE', difficulty: 'Medium', date: '2 weeks ago', rounds: 3, outcome: 'Pending' },
];

const InterviewPrep = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Intelligence</h1>
              <p className="text-gray-500">Real interview experiences from students & alumni.</p>
           </div>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
              Share Experience
           </button>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by company, role, or skill..." 
                 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition" />
           </div>
           <select className="px-4 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
           </select>
        </div>

        <div className="space-y-4">
           {interviews.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition cursor-pointer group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-700">
                          {item.company.charAt(0)}
                       </div>
                       <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">{item.role} @ {item.company}</h3>
                           <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                             <span>•</span>
                             <span>{item.rounds} Rounds</span>
                          </div>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                       item.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                       {item.difficulty}
                    </span>
                 </div>
                 
                 <div className="pl-16">
                    <p className="text-gray-600 text-sm line-clamp-2">
                       "The online assessment had 2 dynamic programming questions. The technical interview focused heavily on HashMaps and Trees. System design round was about designing a URL shortener..."
                    </p>
                    <div className="mt-4 flex gap-2">
                       {['DSA', 'System Design', 'Behavioral'].map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200">{tag}</span>
                       ))}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default InterviewPrep;
