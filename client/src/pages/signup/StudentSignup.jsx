import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";

import Step1BasicInfo from "./signup-steps/Step1BasicInfo";
import EmailVerificationPage from "./EmailVerificationPage";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const totalSteps = 2; // Basic Info + Email Verification

  const submitStudentData = async () => {
    setLoading(true);
    setError("");
    try {
      // Reformat the payload slightly to match the backend expectations
      const payload = {
        role: "student",
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        ...formData,
      };

      const data = await register(payload);

      if (data) {
        // Success! Proceed to verification
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      submitStudentData();
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
                  <p className="font-bold text-gray-900">
                    Creating your profile...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This might take a few seconds
                  </p>
                </div>
              </div>
            )}
            <Step1BasicInfo
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          </div>
        );
      case 2:
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
