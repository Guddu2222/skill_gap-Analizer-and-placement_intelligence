import React, { useState, useEffect } from 'react';
import { Building2, Hash, GraduationCap, TrendingUp, Calendar, BookOpen, AlertCircle, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const Step2AcademicInfo = ({ formData, updateFormData, onNext, onBack }) => {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [errors, setErrors] = useState({});

  const degrees = ['B.Tech', 'B.E.', 'M.Tech', 'M.E.', 'MCA', 'MBA', 'B.Sc', 'M.Sc'];
  
  const departmentsList = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Aerospace Engineering',
    'Production Engineering'
  ];

  useEffect(() => {
    setDepartments(departmentsList);
  }, []);

  const searchColleges = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await axios.get(`/api/colleges/search?q=${query}`);
      setColleges(response.data);
    } catch (error) {
      console.error('College search error:', error);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (!formData.college || formData.college.trim().length < 3) {
      newErrors.college = 'Please enter a valid college name';
    }
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.department) newErrors.department = 'Please select your department';
    if (!formData.degree) newErrors.degree = 'Please select your degree';
    if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (!formData.currentSemester) newErrors.currentSemester = 'Current semester is required';
    
    if (!formData.cgpa) {
      newErrors.cgpa = 'CGPA is required';
    } else if (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
      newErrors.cgpa = 'CGPA must be between 0 and 10';
    }

    if (formData.activeBacklogs < 0) {
      newErrors.activeBacklogs = 'Cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Academic Information</h2>
          <p className="text-gray-600">Tell us about your educational background</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 2 of 6</span>
            <span className="text-sm text-gray-500">Academic Details</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: '33.33%' }}></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College / University *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => {
                    updateFormData({ college: e.target.value, collegeId: '' }); // Reset ID on typing
                    searchColleges(e.target.value);
                    setShowCollegeSuggestions(true);
                  }}
                  onFocus={() => setShowCollegeSuggestions(true)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.college ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Search your college..."
                  required
                />
                
                {/* Autocomplete Dropdown */}
                {showCollegeSuggestions && colleges.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {colleges.map((college, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          updateFormData({ 
                            college: college.name,
                            collegeId: college._id || college.id
                          });
                          setShowCollegeSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                      >
                        <p className="font-medium text-gray-900">{college.name}</p>
                        <p className="text-sm text-gray-500">{college.location || college.emailDomain}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.college && <p className="mt-1 text-sm text-red-600">{errors.college}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Can't find your college?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Request to add
                </a>
              </p>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Roll Number / Registration Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => updateFormData({ rollNumber: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 20CS101"
                  required
                />
              </div>
              {errors.rollNumber && <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
            </div>

            {/* Department & Degree */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department / Branch *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                  <select
                    value={formData.department}
                    onChange={(e) => updateFormData({ department: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                  <select
                    value={formData.degree}
                    onChange={(e) => updateFormData({ degree: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                      errors.degree ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Degree</option>
                    {degrees.map((degree, index) => (
                      <option key={index} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>
                {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
              </div>
            </div>

            {/* Specialization (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => updateFormData({ specialization: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Machine Learning, Data Science"
              />
            </div>

            {/* Academic Years */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admission Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                  <select
                    value={formData.admissionYear}
                    onChange={(e) => updateFormData({ admissionYear: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Year</option>
                    {[...Array(6)].map((_, i) => (
                      <option key={i} value={2020 + i}>{2020 + i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => updateFormData({ graduationYear: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.graduationYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Year</option>
                  {[2024, 2025, 2026, 2027, 2028, 2029].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.graduationYear && <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Semester *
                </label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => updateFormData({ currentSemester: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.currentSemester ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Sem</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
                {errors.currentSemester && <p className="mt-1 text-sm text-red-600">{errors.currentSemester}</p>}
              </div>
            </div>

            {/* CGPA & Backlogs */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current CGPA *
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => updateFormData({ cgpa: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cgpa ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="8.5"
                    required
                  />
                </div>
                {errors.cgpa && <p className="mt-1 text-sm text-red-600">{errors.cgpa}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Active Backlogs
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.activeBacklogs}
                  onChange={(e) => updateFormData({ activeBacklogs: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.activeBacklogs ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.activeBacklogs && <p className="mt-1 text-sm text-red-600">{errors.activeBacklogs}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cleared Backlogs
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.clearedBacklogs}
                  onChange={(e) => updateFormData({ clearedBacklogs: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Info Box */}
            {(formData.activeBacklogs > 0 || formData.clearedBacklogs > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Note about backlogs</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Some companies have strict no-backlog policies. We recommend clearing all backlogs before applying to maximize your opportunities.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Continue
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step2AcademicInfo;
