import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader, Code, Link as LinkIcon, ChevronLeft } from 'lucide-react';

const StudentSignupStep3 = ({ onNext, onBack, formData, setFormData }) => {
  const [selectedSkills, setSelectedSkills] = useState(formData.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const suggestedSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Git',
    'Machine Learning', 'Data Analysis', 'C++', 'Angular', 'Vue.js'
  ];

  const handleSkillAdd = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    setAiParsing(true);
    
    // Simulate upload and AI parsing
    setTimeout(() => {
      setUploading(false);
      setResumeUploaded(true);
      
      // Simulate AI extracting skills
      setTimeout(() => {
        setAiParsing(false);
        setSelectedSkills([...selectedSkills, 'React', 'Node.js', 'MongoDB']);
      }, 2000);
    }, 1500);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, skills: selectedSkills };
    setFormData(updatedFormData);
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${updatedFormData.firstName} ${updatedFormData.lastName}`,
          email: updatedFormData.email,
          password: updatedFormData.password,
          role: 'student'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onNext();
      } else {
        setError(data.msg || data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Skills & Resume
          </h2>
          <p className="text-gray-600">
            Help recruiters find you by showcasing your skills
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-green-600 font-medium">Basic</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-green-600 font-medium">Academic</span>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                3
              </div>
              <span className="text-xs text-blue-600 font-medium">Skills</span>
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
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              <span className="font-medium">Error!</span> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Your Resume (Optional)
              </label>
              
              {!resumeUploaded ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  {uploading ? (
                    <Loader className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  )}
                  
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {uploading ? 'Uploading...' : 'Drag & drop your resume here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, DOC, DOCX (Max 5MB)
                  </p>
                  
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-green-500 rounded-xl p-6 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-900">Resume uploaded successfully</p>
                        <p className="text-sm text-green-700">resume.pdf</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeUploaded(false)}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {aiParsing && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                  <span className="text-sm font-medium text-blue-900">
                    AI is analyzing your resume and extracting skills...
                  </span>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Skills *
              </label>
              
              {selectedSkills.length > 0 && (
                <p className="text-sm text-green-600 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {aiParsing 
                    ? 'Extracting skills from your resume...'
                    : 'Great! Add more if needed.'
                  }
                </p>
              )}

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Skill Input */}
              <div className="relative">
                <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSkillAdd(skillInput);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type to add skills (e.g., React, Python, AWS)"
                />
              </div>

              {/* Suggested Skills */}
              {selectedSkills.length < 5 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Popular in your field:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills
                      .filter(s => !selectedSkills.includes(s))
                      .slice(0, 8)
                      .map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSkillAdd(skill)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                LinkedIn Profile (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            {/* GitHub Profile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GitHub Profile (Optional)
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <button
                type="submit"
                disabled={selectedSkills.length === 0 || loading}
                className={`
                  flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${selectedSkills.length === 0 || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Finish & Verify
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Skip Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onNext}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Skip for now →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupStep3;
