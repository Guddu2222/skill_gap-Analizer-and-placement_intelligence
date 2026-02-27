import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Users, Award, TrendingUp, ChevronRight, Building2, X } from 'lucide-react';
import { fetchRecruiterColleges, fetchCollegeDetail } from '../../services/api';

const getTierStyle = (tier) => ({
  tier1: 'bg-amber-100 text-amber-800 border-amber-300',
  tier2: 'bg-blue-100 text-blue-800 border-blue-300',
  tier3: 'bg-gray-100 text-gray-700 border-gray-300',
}[tier] || 'bg-gray-100 text-gray-700 border-gray-300');

// ─── College Detail Slide-over ────────────────────────────────────────────────
const CollegeDetailPanel = ({ collegeId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCollegeDetail(collegeId)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collegeId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="mb-6 p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />)}
          </div>
        ) : detail ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{detail.college?.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {detail.college?.location}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Total Students', value: detail.statistics?.totalStudents },
                { label: 'Available Now', value: detail.statistics?.availableStudents, color: 'text-green-600' },
                { label: 'Placed', value: detail.statistics?.placedStudents },
                { label: 'Placement Rate', value: `${detail.statistics?.placementRate}%`, color: 'text-blue-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value ?? '–'}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Top Skills */}
            {detail.topSkills?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.topSkills.map(skill => (
                    <span key={skill.name} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      {skill.name} <span className="text-blue-400">({skill.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Departments */}
            {detail.departmentStats && Object.keys(detail.departmentStats).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Department Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(detail.departmentStats).map(([dept, stats]) => (
                    <div key={dept} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-sm text-gray-700 truncate flex-1">{dept}</span>
                      <div className="flex gap-3 ml-2 text-xs font-semibold">
                        <span className="text-gray-600">{stats.total} total</span>
                        <span className="text-green-600">{stats.available} available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Failed to load college details.</p>
        )}
      </div>
    </div>
  );
};

// ─── College Card ─────────────────────────────────────────────────────────────
const CollegeCard = ({ college, onSelect }) => (
  <div
    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
    onClick={() => onSelect(college.id)}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {college.logoUrl ? (
            <img src={college.logoUrl} alt={college.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Building2 className="w-7 h-7 text-blue-600" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{college.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {college.location || 'N/A'}
          </p>
        </div>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getTierStyle(college.tier)}`}>
        {college.tier?.toUpperCase() || 'N/A'}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-blue-50 rounded-xl p-3">
        <p className="text-xl font-bold text-gray-900">{college.metrics.totalStudents}</p>
        <p className="text-xs text-gray-500">Total Students</p>
      </div>
      <div className="bg-green-50 rounded-xl p-3">
        <p className="text-xl font-bold text-green-700">{college.metrics.placementRate}%</p>
        <p className="text-xs text-gray-500">Placed</p>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
      <span>Avg Pkg: <strong className="text-gray-800">₹{college.metrics.avgPackage}L</strong></span>
      <span>Highest: <strong className="text-gray-800">₹{college.metrics.highestPackage}L</strong></span>
      <span>Available: <strong className="text-green-600">{college.metrics.availableStudents}</strong></span>
    </div>

    <div className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
      View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CollegeExplorer = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', tier: '', location: '', minPlacementRate: '', minStudents: '' });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const loadColleges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecruiterColleges({ ...filters, page: 1, limit: 12 });
      setColleges(data.colleges || []);
      setPagination(data.pagination || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(loadColleges, 400);
    return () => clearTimeout(t);
  }, [loadColleges]);

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search colleges by name or location…"
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors text-sm ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            <select value={filters.tier} onChange={e => setFilters(f => ({ ...f, tier: e.target.value }))}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Tiers</option>
              <option value="tier1">Tier 1</option>
              <option value="tier2">Tier 2</option>
              <option value="tier3">Tier 3</option>
            </select>
            <input value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              placeholder="Location" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" value={filters.minPlacementRate} onChange={e => setFilters(f => ({ ...f, minPlacementRate: e.target.value }))}
              placeholder="Min Placement %" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="number" value={filters.minStudents} onChange={e => setFilters(f => ({ ...f, minStudents: e.target.value }))}
              placeholder="Min Students" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Showing <span className="font-semibold text-gray-700">{colleges.length}</span> of <span className="font-semibold text-gray-700">{pagination.total || 0}</span> colleges
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons.map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
              <div className="h-14 bg-gray-200 rounded-xl mb-4" />
              <div className="h-16 bg-gray-100 rounded-xl mb-4" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map(c => <CollegeCard key={c.id} college={c} onSelect={setSelectedCollegeId} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center shadow-md">
          <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-1">No colleges found</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      )}

      {selectedCollegeId && (
        <CollegeDetailPanel collegeId={selectedCollegeId} onClose={() => setSelectedCollegeId(null)} />
      )}
    </div>
  );
};

export default CollegeExplorer;
