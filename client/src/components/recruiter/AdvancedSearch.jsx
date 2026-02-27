import React, { useState } from 'react';
import { Search, X, Code, GraduationCap, Bookmark, BookmarkCheck, Mail, Linkedin, Github, Star, Sliders } from 'lucide-react';
import { searchCandidates, saveCandidate } from '../../services/api';

const POPULAR_SKILLS = [
  'JavaScript','Python','Java','React','Node.js','SQL','MongoDB',
  'AWS','Docker','Machine Learning','C++','Angular','Kubernetes','TypeScript','Spring Boot'
];
const DEPARTMENTS = [
  'Computer Science Engineering','Information Technology',
  'Electronics & Communication','Mechanical Engineering',
  'Civil Engineering','Electrical Engineering',
];
const GRAD_YEARS = [2025, 2026, 2027, 2028];

const MatchBadge = ({ score }) => {
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      <Star className="w-3 h-3 fill-current" /> {score}% Match
    </span>
  );
};

const CandidateCard = ({ candidate, onSave }) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}` || '?';
  const name = [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || candidate.rollNumber;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(candidate._id);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
            <p className="text-xs text-gray-500">{candidate.rollNumber}</p>
            {candidate.matchScore > 0 && <MatchBadge score={candidate.matchScore} />}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`p-2 rounded-lg transition-colors ${saved ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-400'}`}
          title={saved ? 'Saved!' : 'Save candidate'}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 text-xs text-gray-600">
        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
        <span className="truncate">{candidate.college?.name || 'N/A'}</span>
        {candidate.college?.tier && (
          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold flex-shrink-0">
            {candidate.college.tier.toUpperCase()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div><p className="text-lg font-bold text-gray-900">{candidate.cgpa ?? '–'}</p><p className="text-xs text-gray-400">CGPA</p></div>
        <div><p className="text-lg font-bold text-gray-900">{candidate.graduationYear ?? '–'}</p><p className="text-xs text-gray-400">Grad Year</p></div>
        <div><p className="text-lg font-bold text-gray-900">{candidate.skills?.length ?? 0}</p><p className="text-xs text-gray-400">Skills</p></div>
      </div>

      {candidate.department && (
        <p className="text-xs text-gray-500 mb-3"><span className="font-medium text-gray-700">Dept:</span> {candidate.department}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(candidate.skills || []).slice(0, 5).map((sk, i) => (
          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
            {typeof sk === 'string' ? sk : sk.skillName}
          </span>
        ))}
        {(candidate.skills?.length || 0) > 5 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{candidate.skills.length - 5}</span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {candidate.email && (
          <a href={`mailto:${candidate.email}`} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" title="Email">
            <Mail className="w-4 h-4 text-gray-500" />
          </a>
        )}
        {candidate.linkedinUrl && (
          <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="LinkedIn">
            <Linkedin className="w-4 h-4 text-blue-600" />
          </a>
        )}
        {candidate.githubUrl && (
          <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" title="GitHub">
            <Github className="w-4 h-4 text-gray-500" />
          </a>
        )}
      </div>
    </div>
  );
};

const AdvancedSearch = () => {
  const [criteria, setCriteria] = useState({
    skills: [], departments: [], colleges: [], minCgpa: '', maxCgpa: '',
    graduationYears: [], skillProficiency: [], placementStatus: ['eligible', 'applying'],
  });
  const [skillInput, setSkillInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const addSkill = (skill) => {
    if (skill && !criteria.skills.includes(skill)) {
      setCriteria(c => ({ ...c, skills: [...c.skills, skill.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setCriteria(c => ({ ...c, skills: c.skills.filter(x => x !== s) }));

  const toggleArr = (key, val) => setCriteria(c => ({
    ...c,
    [key]: c[key].includes(val) ? c[key].filter(x => x !== val) : [...c[key], val],
  }));

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    try {
      const data = await searchCandidates(criteria);
      setResults(data.candidates || []);
      setSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (studentId) => {
    await saveCandidate(studentId);
  };

  return (
    <div className="space-y-6">
      {/* Search Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" /> Advanced Candidate Search
        </h2>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {criteria.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                <Code className="w-3 h-3" /> {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-blue-900 ml-1"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                placeholder="Type skill and press Enter…"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button onClick={() => addSkill(skillInput)} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <p className="text-xs text-gray-400 w-full mb-1">Popular:</p>
            {POPULAR_SKILLS.filter(s => !criteria.skills.includes(s)).map(s => (
              <button key={s} onClick={() => addSkill(s)}
                className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* CGPA */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CGPA Range</label>
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="10" step="0.1" value={criteria.minCgpa}
                onChange={e => setCriteria(c => ({ ...c, minCgpa: e.target.value }))}
                placeholder="Min" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <span className="text-gray-300">–</span>
              <input type="number" min="0" max="10" step="0.1" value={criteria.maxCgpa}
                onChange={e => setCriteria(c => ({ ...c, maxCgpa: e.target.value }))}
                placeholder="Max" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {DEPARTMENTS.map(d => (
                <label key={d} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
                  <input type="checkbox" checked={criteria.departments.includes(d)} onChange={() => toggleArr('departments', d)}
                    className="w-3.5 h-3.5 text-blue-600 rounded" />
                  <span className="text-gray-700">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Graduation Year</label>
            <div className="flex flex-wrap gap-2">
              {GRAD_YEARS.map(yr => (
                <button key={yr} onClick={() => toggleArr('graduationYears', yr)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${criteria.graduationYears.includes(yr) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                  {yr}
                </button>
              ))}
            </div>

            {/* Proficiency */}
            <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">Skill Proficiency</label>
            <div className="flex flex-wrap gap-2">
              {['beginner','intermediate','advanced','expert'].map(lvl => (
                <button key={lvl} onClick={() => toggleArr('skillProficiency', lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize transition-colors ${criteria.skillProficiency.includes(lvl) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-400'}`}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Searching…</span></>
          ) : (
            <><Search className="w-5 h-5" /><span>Search Candidates</span></>
          )}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {results.length > 0 ? `Found ${results.length} candidate${results.length !== 1 ? 's' : ''}` : 'No candidates match your criteria. Try widening your filters.'}
          </p>
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(c => <CandidateCard key={c._id} candidate={c} onSave={handleSave} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
