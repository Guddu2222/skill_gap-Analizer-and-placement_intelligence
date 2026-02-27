import React, { useState, useEffect } from 'react';
import { Code, Database, Cloud, TrendingUp, Award, Bookmark } from 'lucide-react';
import { fetchDomainExperts, saveCandidate } from '../../services/api';

const DOMAINS = [
  { id: 'software-engineering', name: 'Software Engineering', icon: Code, gradient: 'from-blue-500 to-blue-600', desc: 'Full-stack, Frontend, Backend' },
  { id: 'data-science', name: 'Data Science & ML', icon: TrendingUp, gradient: 'from-purple-500 to-purple-600', desc: 'ML Engineers, Data Analysts' },
  { id: 'cloud-devops', name: 'Cloud & DevOps', icon: Cloud, gradient: 'from-green-500 to-green-600', desc: 'Cloud Architects, DevOps' },
  { id: 'database', name: 'Database & Systems', icon: Database, gradient: 'from-orange-500 to-orange-600', desc: 'DBAs, System Engineers' },
];

const ExpertCard = ({ expert, onSave }) => {
  const [saved, setSaved] = useState(false);
  const initials = `${expert.firstName?.[0] || ''}${expert.lastName?.[0] || ''}` || '?';
  const name = [expert.firstName, expert.lastName].filter(Boolean).join(' ') || expert.rollNumber;

  const handleSave = async () => {
    await onSave(expert._id);
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
            <p className="text-xs text-gray-500 truncate max-w-[160px]">{expert.college?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-500 mb-0.5">
            <Award className="w-4 h-4" />
            <span className="font-bold text-gray-900">{expert.domainExpertiseScore}</span>
          </div>
          <p className="text-xs text-gray-400">Score</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-blue-50 rounded-lg py-2">
          <p className="font-bold text-gray-900">{expert.cgpa ?? '–'}</p>
          <p className="text-xs text-gray-400">CGPA</p>
        </div>
        <div className="bg-purple-50 rounded-lg py-2">
          <p className="font-bold text-gray-900">{expert.domainSkillsCount}</p>
          <p className="text-xs text-gray-400">Skills</p>
        </div>
        <div className="bg-green-50 rounded-lg py-2">
          <p className="font-bold text-gray-900">{expert.graduationYear ?? '–'}</p>
          <p className="text-xs text-gray-400">Grad</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(expert.skills || []).slice(0, 5).map((sk, i) => (
          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
            {typeof sk === 'string' ? sk : sk.skillName}
          </span>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saved}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
      >
        <Bookmark className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Candidate'}
      </button>
    </div>
  );
};

const DomainExperts = () => {
  const [domain, setDomain] = useState('software-engineering');
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchDomainExperts(domain)
      .then(data => setExperts(data.candidates || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [domain]);

  const handleSave = async (studentId) => {
    await saveCandidate(studentId);
  };

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      {/* Domain selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DOMAINS.map(({ id, name, icon: Icon, gradient, desc }) => (
          <button
            key={id}
            onClick={() => setDomain(id)}
            className={`p-5 rounded-2xl text-left transition-all duration-200 ${domain === id ? `bg-gradient-to-br ${gradient} text-white shadow-xl scale-[1.03]` : 'bg-white text-gray-700 hover:shadow-lg border border-gray-100'}`}
          >
            <Icon className={`w-7 h-7 mb-3 ${domain === id ? 'text-white' : 'text-gray-500'}`} />
            <p className="font-bold text-sm mb-1">{name}</p>
            <p className={`text-xs ${domain === id ? 'text-white/80' : 'text-gray-400'}`}>{desc}</p>
          </button>
        ))}
      </div>

      {/* Experts grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">
            Top {DOMAINS.find(d => d.id === domain)?.name} Experts
          </h2>
          <span className="text-sm text-gray-400">{experts.length} found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-16 bg-gray-100 rounded-xl mb-4" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map(e => <ExpertCard key={e._id} expert={e} onSave={handleSave} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <p className="text-gray-400 text-sm">No experts found for this domain yet. Add more student profiles to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainExperts;
