import React, { useState } from 'react';
import StudentSignupStep1 from './StudentSignupStep1';
import StudentSignupStep2 from './StudentSignupStep2';
import StudentSignupStep3 from './StudentSignupStep3';
import EmailVerificationPage from './EmailVerificationPage';

const StudentSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    college: '',
    rollNumber: '',
    department: '',
    graduationYear: '',
    cgpa: '',
    degree: '',
    skills: [],
    linkedinUrl: '',
    githubUrl: ''
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StudentSignupStep1
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <StudentSignupStep2
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <StudentSignupStep3
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <EmailVerificationPage
            email={formData.email}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default StudentSignup;
