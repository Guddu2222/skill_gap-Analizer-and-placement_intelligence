
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Calendar, CheckCircle, AlertTriangle, UserPlus, Clock } from 'lucide-react';

const SmartShortlist = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Arjun Reddy', skills: ['React', 'Node.js', 'AWS'], cgpa: 8.5, prediction: 85, status: 'Matched' },
    { id: 2, name: 'Sneha Gupta', skills: ['Python', 'Django', 'ML'], cgpa: 9.2, prediction: 92, status: 'Matched' },
    { id: 3, name: 'Rohan Mehta', skills: ['Java', 'Spring'], cgpa: 7.8, prediction: 60, status: 'Risk: CTC Mismatch' },
  ]);

  const [schedule, setSchedule] = useState([]);

  const handleAutoSchedule = () => {
    // Simulate API call to /api/recruiter-features/auto-schedule
    const newSchedule = candidates.map((c, i) => ({
      time: `10:00 AM`, // Simplified
      candidate: c.name,
      panel: `Panel ${i + 1}`
    }));
    setSchedule(newSchedule);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="recruiter" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
           <h1 className="text-2xl font-bold text-gray-900">Smart Shortlisting & Scheduling</h1>
           <p className="text-gray-500">AI-powered candidate matching and logistics automation.</p>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8 flex gap-4 items-center">
           <div className="flex-1 flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">Full Stack Developer</span>
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm border border-gray-200">CGPA &gt; 8.0</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium" onClick={handleAutoSchedule}>
              <Calendar className="w-4 h-4" /> Auto-Schedule Interviews
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Candidate List */}
           <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-gray-900 mb-2">AI Matched Candidates</h3>
              {candidates.map((c) => (
                 <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {c.name.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900">{c.name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500 mt-1">
                             {c.skills.map((s, i) => <span key={i} className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">{s}</span>)}
                          </div>
                       </div>
                    </div>

                    <div className="text-right">
                       <div className="flex items-center justify-end gap-2 mb-1">
                          <span className={`text-lg font-bold ${c.prediction > 80 ? 'text-green-600' : 'text-amber-500'}`}>
                             {c.prediction}%
                          </span>
                          <span className="text-xs text-gray-400 uppercase">Joining Probability</span>
                       </div>
                       {c.prediction < 70 && (
                          <div className="text-xs text-amber-600 flex items-center gap-1 justify-end">
                             <AlertTriangle className="w-3 h-3" /> {c.status}
                          </div>
                       )}
                    </div>
                 </div>
              ))}
           </div>

           {/* Schedule Panel */}
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-indigo-600" /> Interview Schedule
              </h3>
              {schedule.length === 0 ? (
                 <div className="text-center py-8 text-gray-400 text-sm">
                    No interviews scheduled yet.
                    <br />Click "Auto-Schedule" to generate.
                 </div>
              ) : (
                 <div className="space-y-4 relative">
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    {schedule.map((s, i) => (
                       <div key={i} className="relative flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 z-10 box-content border-4 border-white"></div>
                          <div className="flex-1 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                             <div className="flex justify-between font-bold text-indigo-900 text-sm mb-1">
                                <span>{s.time}</span>
                                <span>{s.panel}</span>
                             </div>
                             <p className="text-indigo-700 text-sm">{s.candidate}</p>
                             <a href="#" className="text-xs text-indigo-500 hover:text-indigo-700 underline mt-2 block">View Meeting Link</a>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
};

export default SmartShortlist;
