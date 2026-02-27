import React, { useState, useEffect } from 'react';
import { Bookmark, Users, Mail, Linkedin, GraduationCap, RefreshCw } from 'lucide-react';
import { fetchSavedCandidates, updateCandidateStatus, unsaveCandidate } from '../../services/api';

const STATUS_OPTIONS = ['saved','contacted','interviewing','offered','hired','rejected'];
const STATUS_STYLES = {
  saved:       'bg-gray-100 text-gray-700',
  contacted:   'bg-blue-100 text-blue-700',
  interviewing:'bg-indigo-100 text-indigo-700',
  offered:     'bg-amber-100 text-amber-700',
  hired:       'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

const SavedCandidates = ({ stats }) => {
  const [data, setData] = useState({ savedCandidates: [], groupedByFolder: {}, totalSaved: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const res = await fetchSavedCandidates();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSaved(); }, []);

  const handleStatusChange = async (savedId, status) => {
    setUpdatingId(savedId);
    try {
      await updateCandidateStatus(savedId, status);
      setData(prev => ({
        ...prev,
        savedCandidates: prev.savedCandidates.map(s =>
          s._id === savedId ? { ...s, status } : s
        ),
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUnsave = async (studentId, savedId) => {
    try {
      await unsaveCandidate(studentId);
      setData(prev => ({
        ...prev,
        savedCandidates: prev.savedCandidates.filter(s => s._id !== savedId),
        totalSaved: prev.totalSaved - 1,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const folders = ['All', ...Object.keys(data.groupedByFolder)];
  const displayed = activeFolder === 'All'
    ? data.savedCandidates
    : (data.groupedByFolder[activeFolder] || []);

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse h-24" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Saved Candidates</h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{data.totalSaved}</span>
          </div>
          <button onClick={loadSaved} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Status breakdown */}
        {stats?.statusBreakdown && (
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(s => (
              stats.statusBreakdown[s] ? (
                <span key={s} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[s]}`}>
                  {s}: {stats.statusBreakdown[s]}
                </span>
              ) : null
            ))}
          </div>
        )}
      </div>

      {/* Folder tabs */}
      {folders.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {folders.map(f => (
            <button key={f} onClick={() => setActiveFolder(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeFolder === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Candidates list */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-md">
          <Users className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-600 mb-1">No saved candidates yet</h3>
          <p className="text-sm text-gray-400">Use Advanced Search or Domain Experts to discover and save candidates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(saved => {
            const s = saved.student;
            if (!s) return null;
            const name = [s.firstName, s.lastName].filter(Boolean).join(' ') || s.rollNumber;
            const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}` || '?';
            return (
              <div key={saved._id} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-5">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                    {s.cgpa && <span className="text-xs text-gray-500">CGPA: {s.cgpa}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <GraduationCap className="w-3 h-3" />
                    <span className="truncate">{s.college?.name || 'N/A'}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(s.skills || []).slice(0, 4).map((sk, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                        {typeof sk === 'string' ? sk : sk.skillName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <select
                    value={saved.status}
                    onChange={e => handleStatusChange(saved._id, e.target.value)}
                    disabled={updatingId === saved._id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${STATUS_STYLES[saved.status]}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="capitalize bg-white text-gray-800">{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    {s.email && (
                      <a href={`mailto:${s.email}`} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                      </a>
                    )}
                    {s.linkedinUrl && (
                      <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                      </a>
                    )}
                    <button
                      onClick={() => handleUnsave(s._id, saved._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedCandidates;
