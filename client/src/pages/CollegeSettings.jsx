import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Settings,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { fetchCollegeProfile, updateCollegeProfile } from '../services/api';

const CollegeSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    logoUrl: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    about: '',
    tier: 'tier1',
    subscriptionPlan: 'enterprise',
    isVerified: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCollegeProfile()
      .then((data) => {
        if (data) {
          setProfile({
            name: data.name || '',
            location: data.location || '',
            logoUrl: data.logoUrl || '',
            website: data.website || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            about: data.about || '',
            tier: data.tier || 'tier1',
            subscriptionPlan: data.subscriptionPlan || 'enterprise',
            isVerified: data.isVerified ?? true,
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching college profile:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg(null);
      await updateCollegeProfile(profile);
      setStatusMsg({ type: 'success', text: 'College profile settings saved successfully!' });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      console.error('Error updating college profile:', err);
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update profile settings',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-64 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f0f1a]/85 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Institutional Profile & Settings</h1>
              <p className="text-[11px] text-slate-400">Manage collegiate branding, TPO contacts, and verification</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Institution
            </span>
          </div>
        </header>

        <div className="p-8 max-w-5xl space-y-6">
          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border animate-fade-in ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institutional Overview Card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/85 backdrop-blur-md border border-white/8 p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Institutional Identity</h2>
                      <p className="text-xs text-slate-400">Public profile presented to recruiters and corporate partners</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {profile.tier.toUpperCase()} TIER
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      College / University Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Indian Institute of Technology, Bombay"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Campus Location / City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="e.g. Mumbai, Maharashtra, India"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Official Portal / Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://www.iitb.ac.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      College Logo URL
                    </label>
                    <input
                      type="url"
                      value={profile.logoUrl}
                      onChange={(e) => setProfile({ ...profile, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Institutional Overview & Placement Legacy
                  </label>
                  <textarea
                    rows={4}
                    value={profile.about}
                    onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    placeholder="Describe your academic programs, placement achievements, and specialized industry centers..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Placement Cell & Coordination Card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#17172b]/85 backdrop-blur-md border border-white/8 p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Placement Cell (TPO) Coordination</h2>
                      <p className="text-xs text-slate-400">Official point of contact for corporate recruiters during drives</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Head TPO / Placement Official Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={profile.contactEmail}
                        onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                        placeholder="tpo@university.edu.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Placement Cell Hotline / Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.contactPhone}
                        onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                        placeholder="+91 (022) 2576-7000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f0f1a] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Telemetry & Enterprise Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Student Privacy Safeguard</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">FERPA & GDPR compliant student credential verification</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">AI Placement Intelligence</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Automated skill gap telemetry and market alignment</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <Layers className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Direct Drive Integration</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Shortlisted candidates route directly to recruiter dashboards</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollegeSettings;
