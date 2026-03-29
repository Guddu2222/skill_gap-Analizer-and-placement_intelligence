import React, { useState, useEffect } from 'react';
import {
  X, User, GraduationCap, Code2, Link2, Briefcase, MapPin,
  Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { updateStudentProfile } from '../../services/api';

// ─── helpers ────────────────────────────────────────────────────────────────
const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const PROFICIENCY_COLOR = {
  beginner:     'bg-blue-100 text-blue-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-orange-100 text-orange-700',
  expert:       'bg-green-100 text-green-700',
};

const GENDER_OPTIONS = [
  { value: 'male',            label: 'Male' },
  { value: 'female',          label: 'Female' },
  { value: 'other',           label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const TABS = [
  { id: 'basic',    label: 'Basic Info',  icon: User },
  { id: 'academic', label: 'Academic',    icon: GraduationCap },
  { id: 'skills',   label: 'Skills',      icon: Code2 },
  { id: 'links',    label: 'Links',       icon: Link2 },
  { id: 'career',   label: 'Career',      icon: Briefcase },
  { id: 'address',  label: 'Address',     icon: MapPin },
];

// format ISO date → YYYY-MM-DD for <input type="date">
const toDateInput = (val) => {
  if (!val) return '';
  try { return new Date(val).toISOString().split('T')[0]; }
  catch { return ''; }
};

// ─── sub-components ─────────────────────────────────────────────────────────
const Field = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${className}`}
    {...props}
  />
);

const Select = ({ options, className = '', ...props }) => (
  <select
    className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${className}`}
    {...props}
  >
    {options.map(({ value, label }) => (
      <option key={value} value={value}>{label}</option>
    ))}
  </select>
);

// ─── main component ──────────────────────────────────────────────────────────
const ProfileEditModal = ({ student, open, onClose, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const [errors, setErrors] = useState({});

  // ── form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({});
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiencyLevel: 'intermediate' });
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');

  // populate form whenever student prop changes / modal opens
  useEffect(() => {
    if (!student || !open) return;
    setForm({
      firstName:        student.firstName        || '',
      lastName:         student.lastName         || '',
      phone:            student.phone            || '',
      dateOfBirth:      toDateInput(student.dateOfBirth),
      gender:           student.gender           || '',
      department:       student.department       || '',
      degree:           student.degree           || '',
      specialization:   student.specialization   || '',
      cgpa:             student.cgpa != null     ? String(student.cgpa) : '',
      graduationYear:   student.graduationYear   || '',
      admissionYear:    student.admissionYear    || '',
      currentSemester:  student.currentSemester  || '',
      activeBacklogs:   student.activeBacklogs   ?? 0,
      clearedBacklogs:  student.clearedBacklogs  ?? 0,
      linkedinUrl:      student.linkedinUrl      || '',
      githubUrl:        student.githubUrl        || '',
      githubUsername:   student.githubUsername   || '',
      leetcodeUrl:      student.leetcodeUrl      || '',
      leetcodeUsername: student.leetcodeUsername || '',
      portfolioUrl:     student.portfolioUrl     || '',
      targetRole:       student.targetRole       || '',
      willingToRelocate: student.willingToRelocate !== false,
      expectedSalaryMin: student.expectedSalaryMin != null ? String(student.expectedSalaryMin) : '',
      expectedSalaryMax: student.expectedSalaryMax != null ? String(student.expectedSalaryMax) : '',
      addressLine1:     student.addressLine1     || '',
      addressLine2:     student.addressLine2     || '',
      city:             student.city             || '',
      state:            student.state            || '',
      pincode:          student.pincode          || '',
      country:          student.country          || 'India',
    });
    setSkills(
      (student.skills || []).map((s) =>
        typeof s === 'string'
          ? { skillName: s, proficiencyLevel: 'intermediate' }
          : { skillName: s.skillName || '', proficiencyLevel: s.proficiencyLevel || 'intermediate' }
      )
    );
    setPreferredLocations(student.preferredLocations || []);
    setErrors({});
    setActiveTab('basic');
    setToast(null);
  }, [student, open]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // ── skill management ────────────────────────────────────────────────────
  const addSkill = () => {
    const name = newSkill.skillName.trim();
    if (!name) return;
    if (skills.some((s) => s.skillName.toLowerCase() === name.toLowerCase())) {
      setErrors((p) => ({ ...p, newSkill: 'Skill already added' }));
      return;
    }
    setSkills((prev) => [...prev, { skillName: name, proficiencyLevel: newSkill.proficiencyLevel }]);
    setNewSkill({ skillName: '', proficiencyLevel: 'intermediate' });
    setErrors((p) => { const n = { ...p }; delete n.newSkill; return n; });
  };

  const removeSkill = (idx) => setSkills((prev) => prev.filter((_, i) => i !== idx));

  const updateSkillLevel = (idx, level) =>
    setSkills((prev) => prev.map((s, i) => (i === idx ? { ...s, proficiencyLevel: level } : s)));

  // ── preferred locations ─────────────────────────────────────────────────
  const addLocation = () => {
    const loc = newLocation.trim();
    if (!loc || preferredLocations.includes(loc)) return;
    setPreferredLocations((prev) => [...prev, loc]);
    setNewLocation('');
  };
  const removeLocation = (idx) => setPreferredLocations((prev) => prev.filter((_, i) => i !== idx));

  // ── validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10))
      e.cgpa = 'CGPA must be between 0 and 10';
    if (form.graduationYear && (form.graduationYear < 2000 || form.graduationYear > 2050))
      e.graduationYear = 'Enter a valid graduation year';
    if (form.expectedSalaryMin && form.expectedSalaryMax &&
        parseFloat(form.expectedSalaryMin) > parseFloat(form.expectedSalaryMax))
      e.expectedSalaryMax = 'Max salary must be ≥ Min salary';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, skills, preferredLocations };
      const res = await updateStudentProfile(payload);
      setToast({ type: 'success', msg: 'Profile updated successfully!' });
      if (onProfileUpdate) onProfileUpdate(res.student);
      setTimeout(() => { setToast(null); onClose(); }, 1800);
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.error || 'Failed to update profile';
      setToast({ type: 'error', msg });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  // ── tab content renderers ────────────────────────────────────────────────
  const renderBasic = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="First Name">
        <Input value={form.firstName} onChange={set('firstName')} placeholder="Raj" />
      </Field>
      <Field label="Last Name">
        <Input value={form.lastName} onChange={set('lastName')} placeholder="Kumar" />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" type="tel" />
      </Field>
      <Field label="Date of Birth">
        <Input value={form.dateOfBirth} onChange={set('dateOfBirth')} type="date" />
      </Field>
      <Field label="Gender" className="sm:col-span-2">
        <Select
          value={form.gender}
          onChange={set('gender')}
          options={[{ value: '', label: '— Select —' }, ...GENDER_OPTIONS]}
        />
      </Field>
    </div>
  );

  const renderAcademic = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Department" required>
        <Input value={form.department} onChange={set('department')} placeholder="Computer Science" />
      </Field>
      <Field label="Degree">
        <Input value={form.degree} onChange={set('degree')} placeholder="B.Tech" />
      </Field>
      <Field label="Specialization">
        <Input value={form.specialization} onChange={set('specialization')} placeholder="AI & ML" />
      </Field>
      <Field label="CGPA" error={errors.cgpa}>
        <Input value={form.cgpa} onChange={set('cgpa')} type="number" step="0.01" min="0" max="10" placeholder="8.5" />
      </Field>
      <Field label="Graduation Year" error={errors.graduationYear}>
        <Input value={form.graduationYear} onChange={set('graduationYear')} type="number" placeholder="2026" />
      </Field>
      <Field label="Admission Year">
        <Input value={form.admissionYear} onChange={set('admissionYear')} type="number" placeholder="2022" />
      </Field>
      <Field label="Current Semester">
        <Input value={form.currentSemester} onChange={set('currentSemester')} type="number" min="1" max="12" placeholder="6" />
      </Field>
      <Field label="Active Backlogs">
        <Input value={form.activeBacklogs} onChange={set('activeBacklogs')} type="number" min="0" placeholder="0" />
      </Field>
      <Field label="Cleared Backlogs">
        <Input value={form.clearedBacklogs} onChange={set('clearedBacklogs')} type="number" min="0" placeholder="0" />
      </Field>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-5">
      {/* Add skill row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={newSkill.skillName}
            onChange={(e) => setNewSkill((p) => ({ ...p, skillName: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill (e.g. React, Python…)"
          />
          {errors.newSkill && <p className="text-xs text-red-500 mt-1">{errors.newSkill}</p>}
        </div>
        <select
          value={newSkill.proficiencyLevel}
          onChange={(e) => setNewSkill((p) => ({ ...p, proficiencyLevel: e.target.value }))}
          className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
        </select>
        <button
          onClick={addSkill}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Skill chips */}
      {skills.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8 border-2 border-dashed border-slate-200 rounded-xl">
          No skills added yet. Type above and press Add or Enter.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-sm font-medium text-slate-700">{skill.skillName}</span>
              <select
                value={skill.proficiencyLevel}
                onChange={(e) => updateSkillLevel(idx, e.target.value)}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 focus:outline-none cursor-pointer ${PROFICIENCY_COLOR[skill.proficiencyLevel] || 'bg-gray-100 text-gray-600'}`}
              >
                {PROFICIENCY_LEVELS.map((l) => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>
                ))}
              </select>
              <button
                onClick={() => removeSkill(idx)}
                className="w-5 h-5 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400">{skills.length} skill{skills.length !== 1 ? 's' : ''} added</p>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-5">
      <Field label="LinkedIn URL">
        <Input value={form.linkedinUrl} onChange={set('linkedinUrl')} type="url" placeholder="https://linkedin.com/in/yourname" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="GitHub URL">
          <Input value={form.githubUrl} onChange={set('githubUrl')} type="url" placeholder="https://github.com/yourname" />
        </Field>
        <Field label="GitHub Username">
          <Input value={form.githubUsername} onChange={set('githubUsername')} placeholder="e.g. octocat" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="LeetCode URL">
          <Input value={form.leetcodeUrl} onChange={set('leetcodeUrl')} type="url" placeholder="https://leetcode.com/u/yourname" />
        </Field>
        <Field label="LeetCode Username">
          <Input value={form.leetcodeUsername} onChange={set('leetcodeUsername')} placeholder="e.g. yourname" />
        </Field>
      </div>
      <Field label="Portfolio / Website">
        <Input value={form.portfolioUrl} onChange={set('portfolioUrl')} type="url" placeholder="https://yourportfolio.com" />
      </Field>
    </div>
  );

  const renderCareer = () => (
    <div className="space-y-5">
      <Field label="Target Role">
        <Input value={form.targetRole} onChange={set('targetRole')} placeholder="e.g. Full Stack Developer, Data Scientist" />
      </Field>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <input
          id="relocate"
          type="checkbox"
          checked={form.willingToRelocate}
          onChange={set('willingToRelocate')}
          className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
        />
        <label htmlFor="relocate" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          Willing to relocate for the right opportunity
        </label>
      </div>

      <Field label="Expected Salary (LPA)">
        <div className="flex gap-3">
          <Input value={form.expectedSalaryMin} onChange={set('expectedSalaryMin')} type="number" placeholder="Min (e.g. 6)" />
          <Input value={form.expectedSalaryMax} onChange={set('expectedSalaryMax')} type="number" placeholder="Max (e.g. 12)" error={errors.expectedSalaryMax} />
        </div>
        {errors.expectedSalaryMax && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.expectedSalaryMax}</p>}
      </Field>

      {/* Preferred Locations */}
      <Field label="Preferred Work Locations">
        <div className="flex gap-2 mb-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLocation()}
            placeholder="e.g. Bangalore, Mumbai"
          />
          <button
            onClick={addLocation}
            className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {preferredLocations.map((loc, idx) => (
            <span key={idx} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200">
              <MapPin className="w-3 h-3" />{loc}
              <button onClick={() => removeLocation(idx)} className="hover:text-red-500 transition-colors ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </Field>
    </div>
  );

  const renderAddress = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Address Line 1" className="sm:col-span-2">
        <Input value={form.addressLine1} onChange={set('addressLine1')} placeholder="House / Flat No., Street" />
      </Field>
      <Field label="Address Line 2" className="sm:col-span-2">
        <Input value={form.addressLine2} onChange={set('addressLine2')} placeholder="Area, Landmark (optional)" />
      </Field>
      <Field label="City">
        <Input value={form.city} onChange={set('city')} placeholder="Pune" />
      </Field>
      <Field label="State">
        <Input value={form.state} onChange={set('state')} placeholder="Maharashtra" />
      </Field>
      <Field label="Pincode">
        <Input value={form.pincode} onChange={set('pincode')} placeholder="411001" maxLength="10" />
      </Field>
      <Field label="Country">
        <Input value={form.country} onChange={set('country')} placeholder="India" />
      </Field>
    </div>
  );

  const TAB_CONTENT = {
    basic:    renderBasic,
    academic: renderAcademic,
    skills:   renderSkills,
    links:    renderLinks,
    career:   renderCareer,
    address:  renderAddress,
  };

  const currentTabIdx = TABS.findIndex((t) => t.id === activeTab);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 48px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <p className="text-indigo-200 text-sm mt-0.5">Keep your information up to date</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div className={`flex items-center gap-2 px-5 py-3 text-sm font-medium flex-shrink-0 ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-200'
                : 'bg-red-50 text-red-700 border-b border-red-200'
            }`}>
              {toast.type === 'success'
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                : <AlertCircle  className="w-4 h-4 flex-shrink-0" />
              }
              {toast.msg}
            </div>
          )}

          {/* Tab bar */}
          <div className="border-b border-slate-100 px-4 flex-shrink-0 overflow-x-auto">
            <div className="flex gap-1 min-w-max py-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {TAB_CONTENT[activeTab]?.()}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex gap-2">
              {currentTabIdx > 0 && (
                <button
                  onClick={() => setActiveTab(TABS[currentTabIdx - 1].id)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-all"
                >
                  ← Prev
                </button>
              )}
              {currentTabIdx < TABS.length - 1 && (
                <button
                  onClick={() => setActiveTab(TABS[currentTabIdx + 1].id)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-100"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditModal;
