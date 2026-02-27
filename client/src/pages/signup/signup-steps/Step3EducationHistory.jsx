import React, { useState } from 'react';
import { Book, Award, Calendar, Percent, ChevronLeft, AlertCircle } from 'lucide-react';

const Step3EducationHistory = ({ formData, updateFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    // 10th Validation
    if (!formData.education10th.institutionName.trim()) newErrors.inst10 = 'Institution name is required';
    if (!formData.education10th.board.trim()) newErrors.board10 = 'Board name is required';
    if (!formData.education10th.percentage) {
      newErrors.perc10 = 'Percentage/CGPA is required';
    } else {
      const val = parseFloat(formData.education10th.percentage);
      if (val < 0 || val > 100) newErrors.perc10 = 'Must be between 0 and 100';
    }
    if (!formData.education10th.yearOfPassing) newErrors.year10 = 'Passing year is required';

    // 12th Validation
    if (!formData.education12th.institutionName.trim()) newErrors.inst12 = 'Institution name is required';
    if (!formData.education12th.board.trim()) newErrors.board12 = 'Board name is required';
    if (!formData.education12th.percentage) {
      newErrors.perc12 = 'Percentage/CGPA is required';
    } else {
      const val = parseFloat(formData.education12th.percentage);
      if (val < 0 || val > 100) newErrors.perc12 = 'Must be between 0 and 100';
    }
    if (!formData.education12th.yearOfPassing) newErrors.year12 = 'Passing year is required';
    if (!formData.education12th.stream) newErrors.stream12 = 'Stream is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onNext();
    }
  };

  const handle10thChange = (field, value) => {
    updateFormData({
      education10th: { ...formData.education10th, [field]: value }
    });
  };

  const handle12thChange = (field, value) => {
    updateFormData({
      education12th: { ...formData.education12th, [field]: value }
    });
  };

  const currentYear = new Date().getFullYear();
  const passingYears = Array.from({ length: 15 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Education History</h2>
          <p className="text-gray-600">Add your previous academic qualifications</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 3 of 6</span>
            <span className="text-sm text-gray-500">Education Details</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: '50%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 10th Standard Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Book className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">10th Standard (Secondary)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name *</label>
                  <input
                    type="text"
                    value={formData.education10th?.institutionName || ''}
                    onChange={(e) => handle10thChange('institutionName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.inst10 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="School Name"
                  />
                  {errors.inst10 && <p className="mt-1 text-sm text-red-600">{errors.inst10}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Board *</label>
                  <input
                    type="text"
                    value={formData.education10th?.board || ''}
                    onChange={(e) => handle10thChange('board', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.board10 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="CBSE, ICSE, State Board etc."
                  />
                  {errors.board10 && <p className="mt-1 text-sm text-red-600">{errors.board10}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage / CGPA *</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.education10th?.percentage || ''}
                      onChange={(e) => handle10thChange('percentage', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.perc10 ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="85.5"
                    />
                  </div>
                  {errors.perc10 && <p className="mt-1 text-sm text-red-600">{errors.perc10}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Passing *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.education10th?.yearOfPassing || ''}
                      onChange={(e) => handle10thChange('yearOfPassing', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 ${errors.year10 ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Year</option>
                      {passingYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  {errors.year10 && <p className="mt-1 text-sm text-red-600">{errors.year10}</p>}
                </div>
              </div>
            </div>

            {/* 12th Standard Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">12th Standard / Diploma (Higher Secondary)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stream / Specialization *</label>
                  <select
                    value={formData.education12th?.stream || ''}
                    onChange={(e) => handle12thChange('stream', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 ${errors.stream12 ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Stream</option>
                    <option value="Science (PCM)">Science (PCM)</option>
                    <option value="Science (PCB)">Science (PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts/Humanities">Arts / Humanities</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.stream12 && <p className="mt-1 text-sm text-red-600">{errors.stream12}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name *</label>
                  <input
                    type="text"
                    value={formData.education12th?.institutionName || ''}
                    onChange={(e) => handle12thChange('institutionName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.inst12 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="School/College Name"
                  />
                  {errors.inst12 && <p className="mt-1 text-sm text-red-600">{errors.inst12}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Board / University *</label>
                  <input
                    type="text"
                    value={formData.education12th?.board || ''}
                    onChange={(e) => handle12thChange('board', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.board12 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="CBSE, State Board, etc."
                  />
                  {errors.board12 && <p className="mt-1 text-sm text-red-600">{errors.board12}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage / CGPA *</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.education12th?.percentage || ''}
                      onChange={(e) => handle12thChange('percentage', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.perc12 ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="80.0"
                    />
                  </div>
                  {errors.perc12 && <p className="mt-1 text-sm text-red-600">{errors.perc12}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Passing *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.education12th?.yearOfPassing || ''}
                      onChange={(e) => handle12thChange('yearOfPassing', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 ${errors.year12 ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Year</option>
                      {passingYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  {errors.year12 && <p className="mt-1 text-sm text-red-600">{errors.year12}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step3EducationHistory;
