import React, { useState } from 'react';
import { Building2, Hash, GraduationCap, TrendingUp, ChevronLeft } from 'lucide-react';

const StudentSignupStep2 = ({ onNext, onBack, formData, setFormData }) => {
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  
  const colleges = [
    'Indian Institute of Technology, Delhi',
    'Indian Institute of Technology, Bombay',
    'National Institute of Technology, Trichy',
    'Delhi Technological University'
  ];

  const departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Information
          </h2>
          <p className="text-gray-600">
            Tell us about your academic background
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-green-600 font-medium">Basic Info</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                2
              </div>
              <span className="text-xs text-blue-600 font-medium">Academic</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold mb-2">
                3
              </div>
              <span className="text-xs text-gray-500">Skills</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold mb-2">
                4
              </div>
              <span className="text-xs text-gray-500">Verify</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
            {/* College Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College/University *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.college || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, college: e.target.value });
                    setShowCollegeSuggestions(e.target.value.length > 2);
                  }}
                  onFocus={() => setShowCollegeSuggestions((formData.college || '').length > 2)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search your college..."
                  required
                />
                
                {/* Autocomplete Dropdown */}
                {showCollegeSuggestions && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {colleges
                      .filter(c => c.toLowerCase().includes((formData.college || '').toLowerCase()))
                      .map((college, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, college });
                            setShowCollegeSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b last:border-b-0"
                        >
                          <p className="text-sm font-medium text-gray-900">{college}</p>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Can't find your college? <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Request to add</a>
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
                  value={formData.rollNumber || ''}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 20CS101"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department / Branch *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Graduation Year & CGPA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <select
                  value={formData.graduationYear || ''}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current CGPA *
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.01"
                    max="10"
                    value={formData.cgpa || ''}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Degree Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Degree *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['B.Tech / B.E.', 'M.Tech / M.E.', 'MCA', 'MBA'].map((degree) => (
                  <label
                    key={degree}
                    className={`
                      relative flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${formData.degree === degree 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="degree"
                      value={degree}
                      checked={formData.degree === degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{degree}</span>
                    {formData.degree === degree && (
                      <svg className="absolute right-2 top-2 w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center"
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

export default StudentSignupStep2;
