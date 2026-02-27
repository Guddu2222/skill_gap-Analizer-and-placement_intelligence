import React, { useState, useMemo } from 'react';
import { Search, Grid3x3, List, Mail, Linkedin, Github, Award } from 'lucide-react';
import StudentDetailModal from './StudentDetailModal';

const StudentsView = ({
  students,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  viewMode,
  setViewMode,
  departments,
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = (searchTerm || '').toLowerCase();
      const matchesSearch =
        !search ||
        (student.first_name || '').toLowerCase().includes(search) ||
        (student.last_name || '').toLowerCase().includes(search) ||
        (student.roll_number || '').toLowerCase().includes(search) ||
        (student.email || '').toLowerCase().includes(search);
      const matchesDept = selectedDepartment === 'all' || student.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDepartment]);

  const StudentCard = ({ student }) => {
    const name = [student.first_name, student.last_name].filter(Boolean).join(' ') || student.roll_number;
    const initials = (student.first_name || '')[0] + (student.last_name || '')[0] || '?';
    return (
      <div
        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300"
        onClick={() => setSelectedStudent(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setSelectedStudent(student)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">{student.roll_number}</p>
            </div>
          </div>
          {student.is_placed && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center">
              <Award className="w-3 h-3 mr-1" />
              Placed
            </span>
          )}
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Department</span>
            <span className="font-medium text-gray-900">{student.department}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">CGPA</span>
            <span className="font-medium text-gray-900">{student.cgpa != null ? `${student.cgpa}/10` : '–'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Graduation</span>
            <span className="font-medium text-gray-900">{student.graduation_year ?? '–'}</span>
          </div>
        </div>
        {student.skills && student.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {student.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                >
                  {skill.skill_name}
                </span>
              ))}
              {student.skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  +{student.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {student.email && (
            <a
              href={`mailto:${student.email}`}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {student.linkedin_url && (
            <a
              href={student.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {student.github_url && (
            <a
              href={student.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  const StudentListItem = ({ student }) => {
    const name = [student.first_name, student.last_name].filter(Boolean).join(' ') || student.roll_number;
    const initials = (student.first_name || '')[0] + (student.last_name || '')[0] || '?';
    return (
      <div
        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-300"
        onClick={() => setSelectedStudent(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setSelectedStudent(student)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                {student.is_placed && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold shrink-0">
                    Placed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {student.roll_number} • {student.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{student.cgpa != null ? student.cgpa : '–'} CGPA</p>
              <p className="text-xs text-gray-500">{student.graduation_year ?? '–'}</p>
            </div>
            <div className="flex flex-wrap gap-1 max-w-xs justify-end">
              {student.skills?.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  {skill.skill_name}
                </span>
              ))}
              {student.skills?.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">+{student.skills.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const deptList = Array.isArray(departments) ? departments : departments ? Object.keys(departments) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll number, email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {deptList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredStudents.length}</span> students
          </p>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <StudentListItem key={student.id} student={student} />
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default StudentsView;
