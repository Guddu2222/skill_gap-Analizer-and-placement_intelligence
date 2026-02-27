import React from 'react';
import { X, Mail, Phone, Linkedin, Github, Download, Award, TrendingUp, Calendar, MapPin } from 'lucide-react';

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: 'bg-red-100 text-red-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-blue-100 text-blue-700',
      expert: 'bg-green-100 text-green-700',
    };
    return colors[(level || '').toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const groupedSkills = (student.skills || []).reduce((acc, skill) => {
    const cat = skill.skill_category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const displayName = [student.first_name, student.last_name].filter(Boolean).join(' ') || student.roll_number;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {(student.first_name || '')[0]}{(student.last_name || '')[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
              <p className="text-blue-100 mb-3">
                {student.roll_number} • {student.department}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {student.email && (
                  <a
                    href={`mailto:${student.email}`}
                    className="flex items-center space-x-2 text-sm hover:text-blue-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </a>
                )}
                {student.phone && (
                  <a
                    href={`tel:${student.phone}`}
                    className="flex items-center space-x-2 text-sm hover:text-blue-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{student.cgpa ?? '–'}</p>
              <p className="text-sm text-gray-600">CGPA</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{student.graduation_year ?? '–'}</p>
              <p className="text-sm text-gray-600">Graduation</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <Award className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{student.skills?.length || 0}</p>
              <p className="text-sm text-gray-600">Skills</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              {student.is_placed ? (
                <>
                  <Award className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">₹{student.placement_package}L</p>
                  <p className="text-sm text-gray-600">Package</p>
                </>
              ) : (
                <>
                  <MapPin className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-lg font-bold text-gray-900">Seeking</p>
                  <p className="text-sm text-gray-600">Opportunities</p>
                </>
              )}
            </div>
          </div>

          {student.is_placed && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">Placed at {student.placed_company}</h3>
                  <p className="text-sm text-green-700">Package: ₹{student.placement_package} LPA</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Inventory</h3>
            <div className="space-y-4">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                    {(category || 'other').replace(/_/g, ' ')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <span className="font-medium text-gray-900">{skill.skill_name}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getProficiencyColor(
                            skill.proficiency_level
                          )}`}
                        >
                          {skill.proficiency_level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(groupedSkills).length === 0 && (
                <p className="text-gray-500 text-sm">No skills recorded.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {student.resume_url && (
              <a
                href={student.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </a>
            )}
            {student.linkedin_url && (
              <a
                href={student.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#004182] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            )}
            {student.github_url && (
              <a
                href={student.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
