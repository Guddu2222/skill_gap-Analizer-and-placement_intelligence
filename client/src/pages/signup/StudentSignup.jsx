import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Step1BasicInfo from './signup-steps/Step1BasicInfo';
import Step2AcademicInfo from './signup-steps/Step2AcademicInfo';
import Step3EducationHistory from './signup-steps/Step3EducationHistory';
import Step4SkillsResume from './signup-steps/Step4SkillsResume';
import Step5ExperienceProjects from './signup-steps/Step5ExperienceProjects';
import Step6Preferences from './signup-steps/Step6Preferences';
import EmailVerificationPage from './EmailVerificationPage';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Academic Info
    college: '',
    collegeId: '',
    rollNumber: '',
    department: '',
    degree: '',
    specialization: '',
    admissionYear: '',
    graduationYear: '',
    currentSemester: '',
    cgpa: '',
    activeBacklogs: 0,
    clearedBacklogs: 0,
    
    // Step 3: Education History
    education10th: {
      institutionName: '',
      board: '',
      percentage: '',
      yearOfPassing: ''
    },
    education12th: {
      institutionName: '',
      board: '',
      percentage: '',
      yearOfPassing: '',
      stream: ''
    },
    
    // Step 4: Skills & Resume
    skills: [],
    resumeUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    
    // Step 5: Experience & Projects
    experiences: [],
    projects: [],
    
    // Step 6: Preferences & Address
    targetRole: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    preferredLocations: [],
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    willingToRelocate: true
  });

  const totalSteps = 7; // Including email verification

  const submitStudentData = async () => {
    setLoading(true);
    setError('');
    try {
      // Reformat the payload slightly to match the backend expectations
      const payload = {
        role: 'student',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        ...formData,
      };

      // Ensure API endpoint matches
      // Replace this with standard auth register API import if preferred
      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      if (response.data) {
        // Success! Proceed to verification
        setCurrentStep(7);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Registration Error:', err);
      const msg = err.response?.data?.msg || err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 6) {
      submitStudentData();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <Step2AcademicInfo formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3EducationHistory formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4SkillsResume formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <Step5ExperienceProjects formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 6:
        return (
          <div className="relative">
             {error && (
              <div className="max-w-3xl mx-auto mt-8 mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-sm font-semibold text-center border border-red-200">
                {error}
              </div>
             )}
             {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-bold text-gray-900">Creating your profile...</p>
                  <p className="text-sm text-gray-500 mt-1">This might take a few seconds</p>
                </div>
              </div>
             )}
             <Step6Preferences formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
          </div>
        );
      case 7:
        return <EmailVerificationPage email={formData.email} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderStep()}
    </div>
  );
};

export default StudentSignup;
