import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { register } from "../../services/api";

const MinimalAuthForm = ({ role, title, icon: Icon, subtitle, namePlaceholder = "Full Name" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: role,
      };

      // Add role-specific empty fields so backend validation passes
      if (role === "college_admin") {
        payload.collegeName = formData.name.trim(); // Use name as college name initially
      }

      const data = await register(payload);

      // Navigate to email verification
      navigate("/signup/verify-email", { state: { email: formData.email } });
    } catch (err) {
      console.error("Registration Error:", err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-50 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            {Icon && <Icon className="w-8 h-8 text-cyan-400" />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        <div className="glass-abyssal rounded-2xl p-8 border border-white/10 shadow-2xl relative">
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {namePlaceholder} <span className="text-cyan-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-surface-low text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
                  placeholder={namePlaceholder}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address <span className="text-cyan-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-surface-low text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password <span className="text-cyan-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-surface-low text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password <span className="text-cyan-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-surface-low text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-xl flex justify-center items-center gap-2 mt-4 transition-all duration-300 
                ${loading 
                  ? "bg-indigo-600/50 cursor-wait opacity-70" 
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 glow-shadow-indigo hover:scale-[1.02]"}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MinimalAuthForm;
