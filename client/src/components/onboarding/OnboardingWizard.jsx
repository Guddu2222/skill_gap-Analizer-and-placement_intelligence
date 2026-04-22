import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Briefcase, GraduationCap, Target, MapPin, Phone, Upload, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { updateStudentProfile } from '../../services/api';

const OnboardingWizard = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Student Form State
  const [studentData, setStudentData] = useState({
    collegeName: '',
    department: '',
    year: new Date().getFullYear(),
    rollNumber: '',
    targetRole: '',
    dreamCompanies: '',
    skills: '' // comma separated
  });

  // College Form State
  const [collegeData, setCollegeData] = useState({
    collegeName: user?.name || '',
    address: '',
    phone: '',
    contactPerson: '',
    designation: ''
  });

  // Recruiter Form State
  const [recruiterData, setRecruiterData] = useState({
    companyName: user?.name || '',
    industry: '',
    website: '',
    targetDomains: '',
    expectedHiringVolume: ''
  });

  const role = user?.role || 'student';
  const totalSteps = role === 'student' ? 3 : 2;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'student') {
        const skillsArray = studentData.skills.split(',').map(s => s.trim()).filter(s => s);
        const dreamArray = studentData.dreamCompanies.split(',').map(s => s.trim()).filter(s => s);
        
        await updateStudentProfile({
          college: studentData.collegeName,
          department: studentData.department,
          graduationYear: studentData.year,
          rollNumber: studentData.rollNumber,
          targetRole: studentData.targetRole,
          dreamCompanies: dreamArray,
          skills: skillsArray.map(skillName => ({ skillName, proficiencyLevel: 'beginner' }))
        });
      } else if (role === 'college_admin') {
        // Mocking college update - requires endpoint in backend
        console.log("College update payload:", collegeData);
        // await api.put('/college-features/update', collegeData);
      } else if (role === 'recruiter') {
        // Mocking recruiter update - requires endpoint in backend
        console.log("Recruiter update payload:", recruiterData);
        // await api.put('/recruiter-features/update', recruiterData);
      }
      
      onComplete(); // Triggers re-fetch and hides wizard
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERERS FOR DIFFERENT STEPS ---

  const renderStudentSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="text-[#ba9eff] w-6 h-6" /> Academic Profile
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">College / University Name</label>
              <input type="text" value={studentData.collegeName} onChange={e => setStudentData({...studentData, collegeName: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="E.g. Stanford University" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Department</label>
                <input type="text" value={studentData.department} onChange={e => setStudentData({...studentData, department: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Graduation Year</label>
                <input type="number" value={studentData.year} onChange={e => setStudentData({...studentData, year: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Roll Number</label>
              <input type="text" value={studentData.rollNumber} onChange={e => setStudentData({...studentData, rollNumber: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="Enter your university roll number" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-[#ba9eff] w-6 h-6" /> Career Goals
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Target Role</label>
              <input type="text" value={studentData.targetRole} onChange={e => setStudentData({...studentData, targetRole: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="E.g. Full Stack Developer, Data Scientist" />
              <p className="text-[#acaab3] text-xs mt-2">This helps our AI tailor your skill gap analysis.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Dream Companies (Comma separated)</label>
              <input type="text" value={studentData.dreamCompanies} onChange={e => setStudentData({...studentData, dreamCompanies: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="Google, Microsoft, Stripe" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-[#ba9eff] w-6 h-6" /> Skills & Assets
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Current Skills (Comma separated)</label>
              <textarea rows={3} value={studentData.skills} onChange={e => setStudentData({...studentData, skills: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors resize-none" placeholder="React, Node.js, Python, Machine Learning" />
            </div>
            <div className="mt-4 p-4 rounded-xl border border-dashed border-[#48474f] bg-[#13131a] flex flex-col items-center justify-center text-center">
              <Upload className="w-8 h-8 text-[#acaab3] mb-2" />
              <p className="text-sm font-medium text-white">Resume Upload</p>
              <p className="text-xs text-[#acaab3] mt-1 mb-3">You can upload your resume later from the dashboard to auto-fill your profile.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderCollegeSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="text-[#ba9eff] w-6 h-6" /> Institution Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">College Name</label>
              <input type="text" value={collegeData.collegeName} onChange={e => setCollegeData({...collegeData, collegeName: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Complete Address</label>
              <textarea rows={2} value={collegeData.address} onChange={e => setCollegeData({...collegeData, address: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors resize-none" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="text-[#ba9eff] w-6 h-6" /> Placement Office Contact
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Contact Person Name</label>
              <input type="text" value={collegeData.contactPerson} onChange={e => setCollegeData({...collegeData, contactPerson: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Designation/Title</label>
                <input type="text" value={collegeData.designation} onChange={e => setCollegeData({...collegeData, designation: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="e.g. Placement Director" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Contact Phone</label>
                <input type="text" value={collegeData.phone} onChange={e => setCollegeData({...collegeData, phone: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" />
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderRecruiterSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-[#ba9eff] w-6 h-6" /> Company Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Company Name</label>
              <input type="text" value={recruiterData.companyName} onChange={e => setRecruiterData({...recruiterData, companyName: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Industry</label>
                <input type="text" value={recruiterData.industry} onChange={e => setRecruiterData({...recruiterData, industry: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="e.g. FinTech, Healthcare" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Website</label>
                <input type="url" value={recruiterData.website} onChange={e => setRecruiterData({...recruiterData, website: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="https://" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-[#ba9eff] w-6 h-6" /> Hiring Goals
            </h3>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Target Domains (Comma separated)</label>
              <input type="text" value={recruiterData.targetDomains} onChange={e => setRecruiterData({...recruiterData, targetDomains: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors" placeholder="Software Engineering, Data Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#acaab3] mb-1.5 uppercase tracking-wider text-[10px]">Expected Hiring Volume (Yearly)</label>
              <select value={recruiterData.expectedHiringVolume} onChange={e => setRecruiterData({...recruiterData, expectedHiringVolume: e.target.value})} className="w-full bg-[#1f1f27] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ba9eff] transition-colors">
                <option value="">Select an option</option>
                <option value="1-10">1-10 hires</option>
                <option value="11-50">11-50 hires</option>
                <option value="50+">50+ hires</option>
              </select>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Abyssal Space Background */}
      <div className="absolute inset-0 bg-[#000000] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#191921] via-[#0e0e14] to-[#000000]"></div>
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-[#6e3bd7]/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] bg-[#c48ef9]/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
      </div>

      {/* Glass Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#25252e]/60 backdrop-blur-[20px] rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(186,158,255,0.08)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header & Progress */}
        <div className="px-6 py-5 border-b border-white/5 bg-[#1f1f27]/80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Complete Your Profile</h2>
            <span className="text-xs font-bold text-[#ba9eff] tracking-widest uppercase">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full h-1 bg-[#13131a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ba9eff] to-[#ff97b5] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
             <div className="mb-4 p-3 bg-[#a70138]/20 border border-[#a70138] rounded-xl text-sm text-[#ffb2b9] text-center">
               {error}
             </div>
          )}
          {role === 'student' && renderStudentSteps()}
          {role === 'college_admin' && renderCollegeSteps()}
          {role === 'recruiter' && renderRecruiterSteps()}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-white/5 bg-[#1f1f27]/80 backdrop-blur-md flex justify-between items-center">
          <button
            onClick={handleBack}
            className={`flex items-center text-sm font-medium transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[#acaab3] hover:text-white'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25252e]/80 border border-[#ba9eff]/30 text-[#ae8dff] font-semibold hover:bg-[#ba9eff]/10 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-[#ba9eff] to-[#8455ef] text-[#39008c] font-bold shadow-[0_0_15px_rgba(186,158,255,0.4)] hover:shadow-[0_0_25px_rgba(186,158,255,0.6)] transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#39008c]/30 border-t-[#39008c] rounded-full animate-spin"></div>
              ) : (
                <>Complete <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
