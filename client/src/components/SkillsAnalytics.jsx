import React, { useState } from 'react';
import { Code, Database, Cloud, Wrench, Users, Target } from 'lucide-react';

const SkillsAnalytics = ({ skillsData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getCategoryIcon = (category) => {
    const icons = {
      programming_language: Code,
      database: Database,
      cloud: Cloud,
      framework: Wrench,
      devops: Target,
    };
    return icons[category] || Code;
  };

  const getCategoryColor = (category) => {
    const colors = {
      programming_language: 'from-blue-500 to-blue-600',
      database: 'from-green-500 to-green-600',
      cloud: 'from-purple-500 to-purple-600',
      framework: 'from-orange-500 to-orange-600',
      devops: 'from-red-500 to-red-600',
      soft_skill: 'from-pink-500 to-pink-600',
      domain_knowledge: 'from-indigo-500 to-indigo-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const filteredSkills =
    selectedCategory === 'all'
      ? skillsData?.topSkills
      : skillsData?.allSkills?.filter((s) => s.category === selectedCategory) || [];

  const totalSkillCount =
    skillsData?.allSkills?.reduce((sum, s) => sum + (s.count || 0), 0) || 0;
  const avgSkillsPerStudent =
    skillsData?.totalStudents > 0 ? (totalSkillCount / skillsData.totalStudents).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Unique Skills</h3>
            <Code className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{skillsData?.allSkills?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-2">Across all students</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg Skills per Student</h3>
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{avgSkillsPerStudent}</p>
          <p className="text-sm text-gray-500 mt-2">Per registered student</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skill Categories</h3>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{skillsData?.skillsByCategory?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-2">Different categories</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Skills by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCategory === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">All</p>
              <p className="text-sm text-gray-600 mt-1">View all skills</p>
            </div>
          </button>
          {skillsData?.skillsByCategory?.map((cat, index) => {
            const Icon = getCategoryIcon(cat.category);
            return (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === cat.category ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
                <p className="text-xs text-gray-600 mt-1 capitalize">{(cat.category || '').replace(/_/g, ' ')}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory === 'all'
              ? 'Top Skills'
              : `Top ${(selectedCategory || '').replace(/_/g, ' ')} Skills`}
          </h2>
          <span className="text-sm text-gray-500">{filteredSkills?.length ?? 0} skills</span>
        </div>
        <div className="space-y-4">
          {(filteredSkills || []).slice(0, 20).map((skill, index) => {
            const total = skillsData?.totalStudents || 1;
            const percentage = ((skill.count / total) * 100).toFixed(1);
            const levels = skill.proficiencyLevels || {};
            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">{(skill.category || '').replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{skill.count} students</p>
                    <p className="text-sm text-gray-500">{percentage}%</p>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getCategoryColor(skill.category)} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(100, parseFloat(percentage))}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-1" />
                    Beginner: {levels.beginner ?? 0}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                    Intermediate: {levels.intermediate ?? 0}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-1" />
                    Advanced: {levels.advanced ?? 0}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                    Expert: {levels.expert ?? 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {(!filteredSkills || filteredSkills.length === 0) && (
          <p className="text-gray-500 text-center py-8">No skill data available.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Skill Distribution Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Skill</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Beginner</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Intermediate</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Advanced</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Expert</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {(filteredSkills || []).slice(0, 10).map((skill, index) => {
                const levels = skill.proficiencyLevels || {};
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{skill.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          (levels.beginner || 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {levels.beginner ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          (levels.intermediate || 0) > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {levels.intermediate ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          (levels.advanced || 0) > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {levels.advanced ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          (levels.expert || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {levels.expert ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-gray-900">{skill.count}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!filteredSkills || filteredSkills.length === 0) && (
          <p className="text-gray-500 text-center py-6">No data to display.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsAnalytics;
