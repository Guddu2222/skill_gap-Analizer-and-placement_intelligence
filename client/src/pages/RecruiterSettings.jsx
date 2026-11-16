import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NotificationDrawer from "../components/NotificationDrawer";
import {
  Settings,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import {
  fetchRecruiterProfile,
  updateRecruiterProfile,
  updateRecruiterPassword,
} from "../services/api";

const RecruiterSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    designation: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    avatar: "",
    hiringInterests: [],
    notifPrefs: {
      driveAccepted: true,
      driveRejected: true,
      newCandidate: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Notification Drawer state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchRecruiterProfile();
      if (data) {
        setProfile({
          name: data.name || "",
          email: data.email || "",
          company: data.company || "",
          designation: data.designation || "",
          phone: data.phone || "",
          location: data.location || "",
          website: data.website || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          hiringInterests: Array.isArray(data.hiringInterests)
            ? data.hiringInterests
            : ["Full Stack", "React", "Node.js", "Python"],
          notifPrefs: {
            driveAccepted: data.notifPrefs?.driveAccepted ?? true,
            driveRejected: data.notifPrefs?.driveRejected ?? true,
            newCandidate: data.notifPrefs?.newCandidate ?? false,
          },
        });
      }
    } catch (err) {
      console.error("Failed to load recruiter profile:", err);
      showToast("error", "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateRecruiterProfile(profile);
      if (res.success || res.profile) {
        showToast("success", "Profile settings saved successfully!");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      showToast(
        "error",
        err.response?.data?.error || "Failed to update profile settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordSaving(true);
      await updateRecruiterPassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      showToast("success", "Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password update error:", err);
      showToast(
        "error",
        err.response?.data?.error || "Failed to update password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const addHiringInterest = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !profile.hiringInterests.includes(trimmed)) {
      setProfile({
        ...profile,
        hiringInterests: [...profile.hiringInterests, trimmed],
      });
      setNewSkillInput("");
    }
  };

  const removeHiringInterest = (interestToRemove) => {
    setProfile({
      ...profile,
      hiringInterests: profile.hiringInterests.filter(
        (i) => i !== interestToRemove
      ),
    });
  };

  return (
    <div className="flex bg-[#0f0f1a] min-h-screen text-white font-sans overflow-hidden">
      {/* Ambient background lights */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-64 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-600/8 rounded-full blur-[140px]" />
      </div>

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto custom-scrollbar-dark relative z-10">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Recruiter Profile & Preferences
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                Account Settings
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Manage corporate identity, recruiter details, target competencies, and security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          </div>
        </header>

        {/* Toast Alert */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
              toast.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-5xl space-y-8 pb-12">
            {/* Form 1: Profile & Company Info */}
            <form
              onSubmit={handleProfileSubmit}
              className="bg-[rgba(23,23,43,0.7)] backdrop-blur-xl border border-white/8 rounded-3xl p-7 shadow-xl space-y-6"
            >
              <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                <Building className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">
                  Company & Recruiter Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Account Email (Read-only)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Google India / Atlassian"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Your Designation / Title
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.designation}
                      onChange={(e) =>
                        setProfile({ ...profile, designation: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. University Talent Acquisition Lead"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Phone / Contact
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Work Location / HQ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. Bengaluru, India"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Company Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                      className="w-full bg-[#121226] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="e.g. https://careers.google.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Company Overview & Hiring Philosophy
                  </label>
                  <textarea
                    rows="3"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="w-full bg-[#121226] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    placeholder="Brief description of engineering culture, values, and campus opportunities..."
                  />
                </div>
              </div>

              {/* Target Competencies / Hiring Interests */}
              <div className="border-t border-white/8 pt-5">
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Primary Tech Stacks & Hiring Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.hiringInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-medium"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeHiringInterest(interest)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addHiringInterest();
                      }
                    }}
                    placeholder="Add target tech stack (e.g. Golang, Kubernetes)..."
                    className="flex-1 bg-[#121226] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addHiringInterest}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="border-t border-white/8 pt-5">
                <h3 className="text-sm font-bold text-white mb-3">
                  Notification Triggers
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.notifPrefs?.driveAccepted ?? true}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          notifPrefs: {
                            ...profile.notifPrefs,
                            driveAccepted: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded bg-[#121226] border-white/20 text-violet-600 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300">
                      Notify me when a partner university accepts my campus drive invitation
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.notifPrefs?.newCandidate ?? false}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          notifPrefs: {
                            ...profile.notifPrefs,
                            newCandidate: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded bg-[#121226] border-white/20 text-violet-600 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300">
                      Alert me when new 90%+ skill match candidates appear in the talent pool
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
                </button>
              </div>
            </form>

            {/* Form 2: Security & Password Update */}
            <form
              onSubmit={handlePasswordSubmit}
              className="bg-[rgba(23,23,43,0.7)] backdrop-blur-xl border border-white/8 rounded-3xl p-7 shadow-xl space-y-6"
            >
              <div className="flex items-center gap-2.5 border-b border-white/8 pb-4">
                <Lock className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">
                  Security & Password
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#121226] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#121226] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full bg-[#121226] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/8 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>
                    {passwordSaving ? "Updating Password..." : "Update Password"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onUnreadCountChange={(c) => setUnreadCount(c)}
      />
    </div>
  );
};

export default RecruiterSettings;

