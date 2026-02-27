import React, { useState } from 'react';
import { Briefcase, FolderGit2, ChevronLeft, Plus, Trash2 } from 'lucide-react';

const Step5ExperienceProjects = ({ formData, updateFormData, onNext, onBack }) => {

  const handleAddExperience = () => {
    updateFormData({
      experiences: [...formData.experiences, {
        companyName: '', role: '', type: 'internship', 
        location: '', startDate: '', endDate: '', description: '', isCurrent: false
      }]
    });
  };

  const handleAddProject = () => {
    updateFormData({
      projects: [...formData.projects, {
        title: '', description: '', projectType: 'academic',
        projectUrl: '', githubUrl: ''
      }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExps = [...formData.experiences];
    newExps[index][field] = value;
    updateFormData({ experiences: newExps });
  };

  const updateProject = (index, field, value) => {
    const newProjs = [...formData.projects];
    newProjs[index][field] = value;
    updateFormData({ projects: newProjs });
  };

  const removeExperience = (index) => {
    updateFormData({ experiences: formData.experiences.filter((_, i) => i !== index) });
  };

  const removeProject = (index) => {
    updateFormData({ projects: formData.projects.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Experience & Projects</h2>
          <p className="text-gray-600">Add internships and significant projects</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 5 of 6</span>
            <span className="text-sm text-gray-500">Exp & Portfolio</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: '83.33%' }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Experience Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Experience / Internships</h3>
              </div>
              <button 
                type="button" 
                onClick={handleAddExperience}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>

            {formData.experiences.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No experiences added yet. You can add internships or part-time work here.</p>
            ) : (
              <div className="space-y-6">
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 relative bg-gray-50">
                    <button 
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-white p-1 rounded-md shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Org *</label>
                        <input
                          type="text" required
                          value={exp.companyName}
                          onChange={(e) => updateExperience(index, 'companyName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Role *</label>
                        <input
                          type="text" required
                          value={exp.role}
                          onChange={(e) => updateExperience(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Type *</label>
                        <select
                          value={exp.type}
                          onChange={(e) => updateExperience(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                        >
                          <option value="internship">Internship</option>
                          <option value="full_time">Full-time</option>
                          <option value="part_time">Part-time</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
                          <input
                            type="date" required
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            disabled={exp.isCurrent}
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${exp.isCurrent ? 'bg-gray-200' : ''}`}
                          />
                          <div className="mt-1 flex items-center">
                            <input 
                              type="checkbox" id={`current_exp_${index}`}
                              checked={exp.isCurrent}
                              onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                              className="mr-1"
                            />
                            <label htmlFor={`current_exp_${index}`} className="text-xs text-gray-600">Currently working</label>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                         <textarea
                           rows="2"
                           value={exp.description}
                           onChange={(e) => updateExperience(index, 'description', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                           placeholder="What did you do and achieve? (Optional)"
                         ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Key Projects</h3>
              </div>
              <button 
                type="button" 
                onClick={handleAddProject}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {formData.projects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No projects added yet. Highlight academic or side projects.</p>
            ) : (
              <div className="space-y-6">
                {formData.projects.map((proj, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 relative bg-gray-50">
                    <button 
                      onClick={() => removeProject(index)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-white p-1 rounded-md shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Project Title *</label>
                        <input
                          type="text" required
                          value={proj.title}
                          onChange={(e) => updateProject(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Type *</label>
                        <select
                          value={proj.projectType}
                          onChange={(e) => updateProject(index, 'projectType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        >
                          <option value="academic">Academic / Coursework</option>
                          <option value="personal">Personal / Side Project</option>
                          <option value="professional">Professional / Work</option>
                          <option value="open_source">Open Source</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                         <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                         <textarea
                           rows="3" required
                           value={proj.description}
                           onChange={(e) => updateProject(index, 'description', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                           placeholder="Explain the project, problems solved, and tech stack used."
                         ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Repository URL (GitHub etc.)</label>
                        <input
                          type="url"
                          value={proj.githubUrl}
                          onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Live Demo URL</label>
                        <input
                          type="url"
                          value={proj.projectUrl}
                          onChange={(e) => updateProject(index, 'projectUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </button>
              <button
                onClick={onNext}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5ExperienceProjects;
