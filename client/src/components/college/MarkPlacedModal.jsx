import React, { useState } from 'react';
import {
  X,
  Award,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const MarkPlacedModal = ({ student, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !student) return null;

  const [company, setCompany] = useState(student.placedCompany || student.placed_company || '');
  const [role, setRole] = useState(student.jobRole || 'Software Development Engineer');
  const [packageLpa, setPackageLpa] = useState(student.placementPackage || student.placement_package || '');
  const [offerType, setOfferType] = useState(student.offerType || 'Dream');
  const [offerDate, setOfferDate] = useState(new Date().toISOString().split('T')[0]);
  const [isVerified, setIsVerified] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const studentName =
    [student.firstName || student.first_name, student.lastName || student.last_name]
      .filter(Boolean)
      .join(' ') || 'Student';

  const initials =
    ((student.firstName || student.first_name || '')[0] || '') +
    ((student.lastName || student.last_name || '')[0] || 'S');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim()) {
      setError('Please provide the hiring enterprise name.');
      return;
    }
    if (!packageLpa || parseFloat(packageLpa) <= 0) {
      setError('Please enter a valid CTC package in LPA.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const studentId = student._id || student.id;
      const payload = {
        placementStatus: 'placed',
        isPlaced: true,
        placedCompany: company.trim(),
        placementPackage: parseFloat(packageLpa),
        jobRole: role.trim(),
        offerType,
        offerDate,
      };

      const res = await api.patch(`/college-features/students/${studentId}/placement`, payload);

      if (onSuccess) {
        onSuccess(res.data?.student || payload);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update placement record:', err);
      setError(err.response?.data?.error || 'Failed to update placement record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#141426] border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(124,58,237,0.15)] text-[#e3e0f1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-violet-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b border-white/8 bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Mark Student as Placed
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Offer Clearance
                </span>
              </h3>
              <p className="text-xs text-slate-400">Official Campus Placement Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Dossier Capsule */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {initials.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{studentName}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.rollNumber || student.roll_number || 'N/A'} • {student.department}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
                {student.cgpa != null ? `${student.cgpa} CGPA` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hiring Company */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Hiring Enterprise *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google India, TCS, Infosys"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            {/* CTC Package */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                CTC Package (INR LPA) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={packageLpa}
                  onChange={(e) => setPackageLpa(e.target.value)}
                  placeholder="e.g. 14.5"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Role */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Designation / Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SDE-1, Cloud Associate"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            {/* Offer Tier */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Offer Tier Category
              </label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Super Dream">Super Dream (≥ 20 LPA)</option>
                <option value="Dream">Dream (10 - 20 LPA)</option>
                <option value="Regular">Regular (&lt; 10 LPA)</option>
                <option value="Internship+PPO">Internship + PPO</option>
              </select>
            </div>
          </div>

          {/* Offer Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Offer Acceptance / Clearance Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={offerDate}
                onChange={(e) => setOfferDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#121224] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Verification Checkbox */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 cursor-pointer hover:bg-white/[0.04] transition-all">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-[#121224] text-violet-600 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified & Official Offer Confirmed
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically updates college placement percentage, averages, and student dossier.
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Confirm & Issue Placement Clearance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkPlacedModal;
