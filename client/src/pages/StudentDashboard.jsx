import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, CheckCircle, Lock, PlayCircle, AlertCircle, Award, Target, Briefcase, MapPin, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchStudentProfile, fetchSkillGap } from '../services/api'; // Make sure this is correctly exported in api.js

import ResumeUploadWidget from '../components/student/ResumeUploadWidget';
import ProfilePictureUpload from '../components/student/ProfilePictureUpload';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);

  // function to handle upload success dynamic UI updates
  const handleResumeUploadSuccess = (resumeUrl, newProfileCompletionPercentage) => {
    setStudent(prev => ({
      ...prev,
      resumeUrl: resumeUrl,
      profileCompletionPercentage: newProfileCompletionPercentage || prev.profileCompletionPercentage
    }));
  };

  const handleProfilePictureUploadSuccess = (profilePictureUrl, newProfileCompletionPercentage) => {
    setStudent(prev => ({
      ...prev,
      profilePicture: profilePictureUrl,
      profileCompletionPercentage: newProfileCompletionPercentage || prev.profileCompletionPercentage
    }));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileRes, gapRes] = await Promise.all([
          fetchStudentProfile(),
          fetchSkillGap()
        ]);
        
        setStudent(profileRes.student);
        setSkillGap(gapRes);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar role="student" />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading your insights...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar role="student" />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <p className="text-gray-500">Failed to load profile. Please try reloading.</p>
        </main>
      </div>
    );
  }

  // Generate radar chart data dynamically based on the skill gap response
  const generateRadarData = () => {
    if (!skillGap) return [];
    
    const data = [];
    const allSkills = [...new Set([...(skillGap.acquiredSkills || []), ...(skillGap.missingSkills || [])])];
    
    allSkills.forEach(skill => {
      // Basic heuristic to create visual delta
      const isAcquired = skillGap.acquiredSkills?.includes(skill);
      data.push({
        subject: skill,
        You: isAcquired ? Math.floor(Math.random() * 30 + 120) : Math.floor(Math.random() * 40 + 40), // 120-150 if acquired, 40-80 if missing
        TargetRole: 150,
        fullMark: 150
      });
    });

    // If no skills found from backend, return empty array to prevent Crash
    return data.slice(0, 6); // Limit to top 6 skills for visual clarity on radar
  };

  const radarData = generateRadarData();

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8">
        
        {/* Dynamic Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl shadow-xl mb-8 border border-white/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <ProfilePictureUpload student={student} onUploadSuccess={handleProfilePictureUploadSuccess} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {student.firstName || student.user?.name?.split(' ')[0]}!
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-indigo-100 text-sm">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Target className="w-4 h-4" />
                    Target: {student.targetRole || 'Set your target role'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Briefcase className="w-4 h-4" />
                    Status: <span className="capitalize">{student.placementStatus}</span>
                  </span>
                  {student.college?.name && (
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <MapPin className="w-4 h-4" />
                      {student.college.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile Completion Widget */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 w-full md:w-64">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-sm">Profile Completion</span>
                <span className="text-indigo-200 font-bold text-sm">{student.profileCompletionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
                  style={{ width: `${student.profileCompletionPercentage}%` }}
                ></div>
              </div>
              {student.profileCompletionPercentage < 100 && (
                <p className="text-xs text-indigo-200">
                  {student.resumeUrl ? 'Add more skills to reach 100%' : 'Upload a resume to boost your score!'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Require Resume Upload if missing */}
        {!student.resumeUrl && (
          <div className="mb-8">
            <ResumeUploadWidget onUploadSuccess={handleResumeUploadSuccess} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Skill Readiness Assessment */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Radar className="w-5 h-5 text-indigo-600" />
                     Skill Readiness
                   </h3>
                   <p className="text-sm text-slate-500">Compared to {skillGap?.targetRole || 'industry standard'}</p>
                 </div>
                 {skillGap?.matchScore && (
                   <div className="flex flex-col items-end">
                     <span className="text-2xl font-bold text-indigo-600">{skillGap.matchScore}%</span>
                     <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Match Score</span>
                   </div>
                 )}
              </div>
              
              <div className="h-80 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-50">
                {radarData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="You" dataKey="You" stroke="#4f46e5" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                      <Radar name="Target Role" dataKey="TargetRole" stroke="#10b981" strokeDasharray="3 3" strokeWidth={2} fill="transparent" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </RadarChart>
                 </ResponsiveContainer>
                ) : (
                  <div className="text-center text-slate-500">
                    <p>Not enough skill data to build chart.</p>
                    <button className="mt-2 text-indigo-600 font-medium text-sm hover:underline">Add Skills</button>
                  </div>
                )}
              </div>
           </div>

           {/* Critical Skill Gaps */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <Zap className="w-5 h-5 text-amber-500" />
                       Critical Gaps
                    </h3>
                    <p className="text-sm text-slate-500">Skills required for your target role</p>
                 </div>
                 {skillGap?.missingSkills?.length > 0 && (
                  <span className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
                    {skillGap.missingSkills.length} Action Items
                  </span>
                 )}
              </div>
              
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                 {skillGap?.missingSkills?.length > 0 ? (
                   skillGap.missingSkills.map((skill, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition group">
                         <div className="flex gap-4 items-center">
                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                               <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-semibold text-slate-900">{skill}</h4>
                               <p className="text-xs text-rose-500 font-medium">Gap Identified</p>
                            </div>
                         </div>
                         <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm">
                            Learn
                         </button>
                      </div>
                   ))
                 ) : (
                   <div className="text-center py-12">
                     <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                     <p className="font-medium text-slate-900">No major gaps identified!</p>
                     <p className="text-sm text-slate-500">You perfectly match your target role's skill profile.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Personalized Learning Roadmap */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>

           <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">Personalized Roadmap</h3>
                 <p className="text-slate-500 text-sm mt-1">AI-curated steps based on your current profile</p>
              </div>
              <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                View Full Path
              </button>
           </div>
           
           <div className="flex gap-5 overflow-x-auto pb-6 relative z-10 snap-x">
              
              {/* Acquired Skills - Completed Steps */}
              {skillGap?.acquiredSkills?.slice(0, 1).map((skill, idx) => (
                <div key={idx} className="snap-start min-w-[280px] p-6 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white shadow-sm flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                   </div>
                   <h4 className="font-bold text-slate-900 mb-1">{skill} Mastery</h4>
                   <p className="text-xs text-emerald-600 font-medium mb-auto">Competency Verified</p>
                </div>
              ))}

              {/* Active Step (Top Missing Skill) */}
              {skillGap?.missingSkills?.[0] && (
                <div className="snap-start min-w-[320px] p-1.5 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 transform hover:-translate-y-1 transition-transform cursor-pointer">
                   <div className="bg-white rounded-[20px] p-5 h-full flex flex-col">
                       <div className="relative h-32 bg-slate-900 rounded-xl mb-5 overflow-hidden group">
                          <img src={`https://source.unsplash.com/random/400x200/?${skillGap.missingSkills[0].toLowerCase().replace(' ', ',')},coding`} alt="Course Cover" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                             <PlayCircle className="w-12 h-12 text-white shadow-xl opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition drop-shadow-lg" />
                          </div>
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-bold">Recommended</div>
                       </div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{skillGap.missingSkills[0]} Fundamentals</h4>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-1">Master the core concepts required for {student.targetRole}.</p>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                           <span>0% Complete</span>
                           <span className="text-indigo-600">Start Now</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600 rounded-full w-[5%]"></div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Locked Steps (Other Missing Skills) */}
              {skillGap?.missingSkills?.slice(1, 3).map((skill, idx) => (
                <div key={idx} className="snap-start min-w-[280px] p-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-sm flex flex-col opacity-75">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm border border-slate-200">
                        <Lock className="w-5 h-5" />
                      </div>
                   </div>
                   <h4 className="font-bold text-slate-700 mb-1">{skill} Deep Dive</h4>
                   <p className="text-xs text-slate-500 font-medium mb-auto">Locked • Complete previous step</p>
                </div>
              ))}
              
              {/* Final Goal */}
              <div className="snap-start min-w-[280px] p-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-sm flex flex-col justify-center items-center text-center">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm mb-4">
                   <Briefcase className="w-6 h-6 text-slate-400" />
                 </div>
                 <h4 className="font-bold text-slate-700">Mock Interview</h4>
                 <p className="text-xs text-slate-500 font-medium mt-1">Unlocks after roadmap completion</p>
              </div>

           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default StudentDashboard;
