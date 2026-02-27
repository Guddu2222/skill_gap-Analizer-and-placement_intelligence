import React, { useState } from 'react';
import { Code, Link, Upload, X, Plus, ExternalLink, ChevronLeft } from 'lucide-react';

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Machine Learning', 'Data Structures'
];

const Step4SkillsResume = ({ formData, updateFormData, onNext, onBack }) => {
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [suggestedSkills, setSuggestedSkills] = useState(COMMON_SKILLS);

  const addSkill = (skillName, level) => {
    if (!skillName.trim()) return;
    const isDuplicate = formData.skills.some(s => s.skillName.toLowerCase() === skillName.toLowerCase());
    
    if (!isDuplicate) {
      updateFormData({
        skills: [...formData.skills, { skillName: skillName.trim(), proficiencyLevel: level }]
      });
    }
    setSkillInput('');
    setSuggestedSkills(suggestedSkills.filter(s => s.toLowerCase() !== skillName.toLowerCase()));
  };

  const removeSkill = (skillToRemove) => {
    updateFormData({
      skills: formData.skills.filter(s => s.skillName !== skillToRemove)
    });
    if (COMMON_SKILLS.includes(skillToRemove) && !suggestedSkills.includes(skillToRemove)) {
      setSuggestedSkills([...suggestedSkills, skillToRemove]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Portfolio</h2>
          <p className="text-gray-600">Showcase your technical capabilities</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 4 of 6</span>
            <span className="text-sm text-gray-500">Skills & Links</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: '66.66%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Skills Section */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Technical Skills *
              </label>
              
              <div className="flex gap-2 items-start mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput, skillLevel);
                      }
                    }}
                    placeholder="E.g. React, Python"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-40 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={() => addSkill(skillInput, skillLevel)}
                  className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Added Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    <span className="font-medium text-sm">{skill.skillName}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-white text-blue-500 rounded-md shadow-sm border border-blue-50">
                      {skill.proficiencyLevel}
                    </span>
                    <button type="button" onClick={() => removeSkill(skill.skillName)} className="hover:text-red-500 ml-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              {suggestedSkills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suggested</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.slice(0, 8).map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill, 'Intermediate')}
                        className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-100 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Professional Links */}
            <div className="pt-4 border-t space-y-4">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Link className="w-5 h-5 text-gray-600" />
                Professional Links
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => updateFormData({ linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => updateFormData({ githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Portfolio / Personal Website</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
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

export default Step4SkillsResume;
