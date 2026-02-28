import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, CheckCircle, Lock, PlayCircle, AlertCircle, Award, Target, Briefcase, MapPin, Zap, BarChart3, Users, ArrowRight } from 'lucide-react';
import { fetchStudentProfile, fetchLatestSkillGapAnalysis, fetchLearningPaths, triggerSkillGapAnalysis } from '../services/api'; 

import ResumeUploadWidget from '../components/student/ResumeUploadWidget';
import ProfilePictureUpload from '../components/student/ProfilePictureUpload';
import SkillGapOverview from '../components/student/SkillGapOverview';
import LearningPathTracker from '../components/student/LearningPathTracker';
import SkillRadarChart from '../components/student/SkillRadarChart';
import RecommendedCourses from '../components/student/RecommendedCourses';
import CompetitiveAnalysis from '../components/student/CompetitiveAnalysis';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const profileRes = await fetchStudentProfile();
      setStudent(profileRes.student);

      try {
        const gapRes = await fetchLatestSkillGapAnalysis();
        setSkillGapAnalysis(gapRes.analysis);
      } catch (error) {
        setSkillGapAnalysis(null);
      }

      try {
        const pathsRes = await fetchLearningPaths();
        setLearningPaths(pathsRes.learningPaths || []);
      } catch (error) {
        setLearningPaths([]);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAnalyzeSkills = async () => {
    try {
       setAnalyzing(true);
       // Use safe defaults if the student profile doesn't have these explicitly set yet
       const domain = student?.targetDomain || 'Software Engineer';
       const role = student?.targetRole || 'Full Stack Developer';
       await triggerSkillGapAnalysis(domain, role);
       await fetchDashboardData();
    } catch(err) {
       console.error(err);
       alert("Failed to analyze skills");
    } finally {
       setAnalyzing(false);
       
    }
  };

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
  // Removed redundant radar data gen inline

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

        {/* Alert Banner - No Analysis */}
        {!skillGapAnalysis && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Your Personalized Career Roadmap</h3>
                  <p className="text-blue-100 mb-4">
                    Discover your skill gaps, get AI-powered recommendations, and create a learning path tailored just for you!
                  </p>
                  <button 
                    onClick={handleAnalyzeSkills}
                    disabled={analyzing}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5" />
                    <span>{analyzing ? 'Analyzing with AI...' : 'Start Analysis Now'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {skillGapAnalysis && (
          <>
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 inline-block mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('learning')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'learning'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-5 h-5 inline-block mr-2" />
                  My Paths
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'skills'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Target className="w-5 h-5 inline-block mr-2" />
                  Skill Radar
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'courses'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-5 h-5 inline-block mr-2" />
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('competitive')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'competitive'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5 inline-block mr-2" />
                  Compare
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-12">
              {activeTab === 'overview' && (
                <SkillGapOverview 
                  analysis={skillGapAnalysis} 
                  student={student}
                  onReanalyze={handleAnalyzeSkills}
                />
              )}
              {activeTab === 'learning' && (
                <LearningPathTracker 
                  learningPaths={learningPaths}
                  onUpdate={fetchDashboardData}
                />
              )}
              {activeTab === 'skills' && (
                <SkillRadarChart 
                  analysis={skillGapAnalysis}
                  studentSkills={student?.skills}
                />
              )}
              {activeTab === 'courses' && (
                <RecommendedCourses 
                  analysis={skillGapAnalysis}
                />
              )}
              {activeTab === 'competitive' && (
                <CompetitiveAnalysis 
                  student={student}
                  analysis={skillGapAnalysis}
                />
              )}
            </div>
          </>
        )}
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default StudentDashboard;
