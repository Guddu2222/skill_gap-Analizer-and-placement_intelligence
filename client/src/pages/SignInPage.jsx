import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import api from "../services/api";

/* ── Floating particle background ── */
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      background:
        "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
      animation: "floatParticle linear infinite",
      ...style,
    }}
  />
);

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  width: Math.random() * 4 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 12,
  top: Math.random() * 100,
}));

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setNeedsVerification(false);

    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email";
    if (formData.password.length < 6) newErrors.password = "Password is too short";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userId", response.data.user.id);
        const role = response.data.user.role.toLowerCase();
        if (role === "student") navigate("/student");
        else if (role === "college" || role === "college_admin") navigate("/college");
        else if (role === "recruiter") navigate("/recruiter");
        else navigate("/");
      } else {
        setGeneralError("Invalid email or password");
      }
    } catch (error) {
      if (error.response?.data?.isVerified === false) setNeedsVerification(true);
      setGeneralError(
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => { window.location.href = "http://localhost:5000/api/auth/google"; };
  const handleLinkedInLogin = () => { window.location.href = "http://localhost:5000/api/auth/linkedin"; };

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(139,92,246,0.15); }
          50% { box-shadow: 0 0 35px rgba(99,102,241,0.5), 0 0 70px rgba(139,92,246,0.25); }
        }
        @keyframes slideInUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .signin-card { animation: slideInUp 0.7s ease-out both; }
        .input-field {
          width: 100%; padding: 14px 14px 14px 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #e2e8f0;
          font-size: 0.95rem; outline: none;
          transition: all 0.3s ease;
        }
        .input-field::placeholder { color: rgba(148,163,184,0.5); }
        .input-field:focus {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1);
        }
        .input-field.error { border-color: rgba(239,68,68,0.6); }
        .btn-primary {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
          background-size: 200% 200%;
          border: none; border-radius: 12px; color: #fff;
          font-size: 1rem; font-weight: 700; letter-spacing: 0.5px;
          cursor: pointer; transition: all 0.3s ease;
          animation: gradientShift 4s ease infinite;
          position: relative; overflow: hidden;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99,102,241,0.4);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-social {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px; padding: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #cbd5e1;
          font-size: 0.875rem; font-weight: 500;
          cursor: pointer; transition: all 0.3s ease;
        }
        .btn-social:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
          animation: scanline 6s linear infinite; pointer-events: none;
        }
      `}</style>

      <div style={{
        minHeight: "100vh", minWidth: "100vw",
        background: "linear-gradient(135deg, #060614 0%, #0c0c1d 40%, #0f0a1e 70%, #060614 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", position: "relative", overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {/* Ambient orbs */}
        <div style={{ position:"absolute", top:"10%", left:"5%", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"5%", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* Particles */}
        {PARTICLES.map((p) => (
          <Particle key={p.id} style={{
            width: p.width + "px", height: p.width + "px",
            left: p.left + "%", top: p.top + "%",
            animationDelay: p.delay + "s", animationDuration: p.duration + "s",
          }} />
        ))}

        {/* Grid overlay */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", opacity:0.03,
          backgroundImage:`linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize:"60px 60px",
        }} />

        {/* Main card */}
        <div className="signin-card" style={{
          width:"100%", maxWidth:"460px",
          background:"rgba(255,255,255,0.03)",
          backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"24px", padding:"clamp(28px,5vw,44px)",
          boxShadow:"0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          position:"relative", overflow:"hidden",
        }}>
          <div className="scanline" />

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            {/* Logo mark - Clickable to Home */}
            <Link to="/" style={{ textDecoration: "none", display: "inline-block", cursor: "pointer", transition: "transform 0.2s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width:"56px", height:"56px", borderRadius:"16px", marginBottom:"16px",
                margin: "0 auto 16px auto",
                background:"linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
                border:"1px solid rgba(99,102,241,0.4)",
                boxShadow:"0 0 30px rgba(99,102,241,0.2)",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="url(#g1)" strokeWidth="1.5" fill="rgba(99,102,241,0.2)" />
                  <path d="M14 8l-5 3v6l5 3 5-3v-6L14 8z" fill="url(#g1)" />
                  <defs>
                    <linearGradient id="g1" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ fontSize:"0.7rem", letterSpacing:"0.25em", color:"rgba(99,102,241,0.8)", textTransform:"uppercase", fontWeight:600, marginBottom:"8px" }}>
                SkillBridge Intelligence
              </div>
            </Link>
            <h1 style={{ fontSize:"clamp(1.6rem,4vw,2rem)", fontWeight:800, color:"#f1f5f9", margin:"0 0 6px" }}>
              Welcome Back
            </h1>
            <p style={{ color:"rgba(148,163,184,0.7)", fontSize:"0.9rem", margin:0 }}>
              Re-enter the intelligence corridor
            </p>
          </div>

          {/* Error banner */}
          {generalError && (
            <div style={{
              marginBottom:"20px", padding:"12px 16px",
              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:"12px", display:"flex", alignItems:"flex-start",
              gap:"10px", flexWrap:"wrap",
            }}>
              <AlertCircle size={16} style={{ color:"#f87171", flexShrink:0, marginTop:2 }} />
              <p style={{ color:"#fca5a5", fontSize:"0.85rem", flex:1, margin:0 }}>{generalError}</p>
              {needsVerification && (
                <button
                  onClick={() => navigate("/signup/verify-email", { state: { email: formData.email } })}
                  style={{
                    padding:"6px 14px", background:"rgba(239,68,68,0.7)",
                    border:"none", borderRadius:"8px", color:"#fff",
                    fontSize:"0.75rem", fontWeight:700, cursor:"pointer",
                  }}
                >
                  Verify Email
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            {/* Email */}
            <div>
              <label style={{ display:"block", fontSize:"0.8rem", fontWeight:600, color:"rgba(148,163,184,0.9)", marginBottom:"8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>
                Email Address
              </label>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  className={`input-field${errors.email ? " error" : ""}`}
                  placeholder="your@email.com" required
                />
              </div>
              {errors.email && <p style={{ marginTop:6, fontSize:"0.8rem", color:"#f87171", display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={13}/>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display:"block", fontSize:"0.8rem", fontWeight:600, color:"rgba(148,163,184,0.9)", marginBottom:"8px", letterSpacing:"0.05em", textTransform:"uppercase" }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", opacity:0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  className={`input-field${errors.password ? " error" : ""}`}
                  style={{ paddingRight:48 }}
                  placeholder="Enter your password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(148,163,184,0.6)", display:"flex", padding:0 }}>
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {errors.password && <p style={{ marginTop:6, fontSize:"0.8rem", color:"#f87171", display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={13}/>{errors.password}</p>}
            </div>

            {/* Remember & Forgot */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <input type="checkbox" checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  style={{ accentColor:"#6366f1", width:15, height:15 }}
                />
                <span style={{ fontSize:"0.85rem", color:"rgba(148,163,184,0.8)" }}>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ fontSize:"0.85rem", color:"#818cf8", textDecoration:"none", fontWeight:600 }}
                onMouseEnter={e=>e.target.style.color="#a5b4fc"} onMouseLeave={e=>e.target.style.color="#818cf8"}>
                Forgot Key?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Loader size={18} style={{ animation:"spin 1s linear infinite" }}/>
                  Authenticating...
                </span>
              ) : "Access Intelligence Hub →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
            <span style={{ fontSize:"0.75rem", color:"rgba(148,163,184,0.5)", letterSpacing:"0.1em" }}>OR CONTINUE WITH</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
          </div>

          {/* Social */}
          <div style={{ display:"flex", gap:12 }}>
            <button type="button" onClick={handleGoogleLogin} className="btn-social">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" onClick={handleLinkedInLogin} className="btn-social">
              <svg width="18" height="18" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Footer link */}
          <p style={{ textAlign:"center", marginTop:"24px", fontSize:"0.875rem", color:"rgba(148,163,184,0.6)" }}>
            New to SkillBridge?{" "}
            <Link to="/signup" style={{ color:"#818cf8", fontWeight:700, textDecoration:"none" }}
              onMouseEnter={e=>e.target.style.color="#a5b4fc"} onMouseLeave={e=>e.target.style.color="#818cf8"}>
              Request Access →
            </Link>
          </p>

          {/* Bottom status bar */}
          <div style={{
            marginTop:"28px", paddingTop:"18px",
            borderTop:"1px solid rgba(255,255,255,0.06)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px rgba(34,197,94,0.8)", animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontSize:"0.7rem", color:"rgba(148,163,184,0.4)", letterSpacing:"0.1em" }}>NEURAL CORE ACTIVE</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </>
  );
};

export default SignInPage;
