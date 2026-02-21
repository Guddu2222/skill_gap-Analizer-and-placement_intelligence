
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Linkedin, Mail, Briefcase, GraduationCap } from 'lucide-react';

const alumniData = [
  { id: 1, name: 'Priya Sharma', role: 'SDE II', company: 'Amazon', batch: 2022, dept: 'CSE', skills: ['Java', 'AWS', 'System Design'] },
  { id: 2, name: 'Rahul Verma', role: 'Frontend Engineer', company: 'Uber', batch: 2023, dept: 'ISE', skills: ['React', 'Redux', 'Performance'] },
  { id: 3, name: 'Ankit Gupta', role: 'Data Scientist', company: 'Microsoft', batch: 2021, dept: 'CSE', skills: ['Python', 'ML', 'Azure'] },
  { id: 4, name: 'Sneha Reddy', role: 'Product Manager', company: 'Google', batch: 2020, dept: 'ECE', skills: ['Strategy', 'Analytics', 'UX'] },
];

const AlumniNetwork = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
           <h1 className="text-2xl font-bold text-gray-900">Alumni Network</h1>
           <p className="text-gray-500">Connect with seniors working in your dream companies.</p>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
           {['All Companies', 'Google', 'Microsoft', 'Amazon', 'Uber'].map((filter, i) => (
              <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                 i === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
                 {filter}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {alumniData.map((alumni) => (
              <div key={alumni.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                 <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                       {alumni.name.charAt(0)}
                    </div>
                    <a href="#" className="text-gray-400 hover:text-blue-600"><Linkedin className="w-5 h-5" /></a>
                 </div>
                 
                 <h3 className="text-lg font-bold text-gray-900">{alumni.name}</h3>
                 <p className="text-blue-600 font-medium text-sm mb-1">{alumni.role} @ {alumni.company}</p>
                 
                 <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                    <GraduationCap className="w-3 h-3" />
                    <span>Batch of {alumni.batch} • {alumni.dept}</span>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-6">
                    {alumni.skills.map((skill, j) => (
                       <span key={j} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100">{skill}</span>
                    ))}
                 </div>

                 <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Request Mentorship
                 </button>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default AlumniNetwork;
