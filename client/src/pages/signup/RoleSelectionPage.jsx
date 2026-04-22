import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ─── Role data ─── */
const ROLES = [
  {
    id: "student",
    label: "Student",
    tagline: "Forge Your Career Path",
    description:
      "Precision-guided AI tools designed for modern learners building tomorrow's skills.",
    path: "/signup/student",
    accentFrom: "#6366f1",
    accentTo: "#8b5cf6",
    glowColor: "rgba(99,102,241,0.25)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    features: ["AI Roadmaps", "Skill Gap Analysis", "Project Portfolios"],
  },
  {
    id: "college",
    label: "College",
    tagline: "Placement Intelligence",
    description:
      "Empower your institution with real-time placement data and industry synchronization.",
    path: "/signup/college",
    accentFrom: "#06b6d4",
    accentTo: "#3b82f6",
    glowColor: "rgba(6,182,212,0.25)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    features: ["Placement Tracking", "Batch Performance", "Industry Connect"],
  },
  {
    id: "recruiter",
    label: "Recruiter",
    tagline: "Discover Vetted Talent",
    description:
      "Predictive matching algorithms and verified skill telemetry for elite hiring.",
    path: "/signup/recruiter",
    accentFrom: "#8b5cf6",
    accentTo: "#ec4899",
    glowColor: "rgba(139,92,246,0.25)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    features: ["Smart Matching", "Direct Pipeline", "AI-Vetted Roles"],
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (role) => {
    setSelectedId(role.id);
    setTimeout(() => navigate(role.path), 320);
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }

        .role-card {
          position: relative;
          border-radius: 20px;
          padding: clamp(24px, 4vw, 36px);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      border-color 0.3s ease,
                      box-shadow 0.35s ease;
          overflow: hidden;
          animation: fadeUp 0.6s ease both;
        }
        .role-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 20px;
          background: linear-gradient(135deg, var(--from), var(--to));
          opacity: 0; transition: opacity 0.35s ease;
        }
        .role-card:hover::before,
        .role-card.selected::before { opacity: 0.07; }
        .role-card:hover,
        .role-card.selected {
          transform: translateY(-8px) scale(1.02);
        }
        .role-card .shimmer {
          position: absolute; top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          opacity: 0; pointer-events: none;
          animation: shimmerSlide 1.2s ease forwards;
        }
        .role-card:hover .shimmer { opacity: 1; }

        .feature-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          font-size: 0.75rem; color: rgba(203,213,225,0.8);
          transition: all 0.3s ease;
        }

        .cta-btn {
          width: 100%; padding: 13px;
          border: none; border-radius: 12px;
          color: #fff; font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.4px; cursor: pointer;
          background: linear-gradient(135deg, var(--from), var(--to));
          background-size: 200%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: gradientShift 4s ease infinite;
          position: relative; overflow: hidden;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--glow);
        }

        .header-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 999px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(165,180,252,0.9);
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .cards-grid { grid-template-columns: 1fr !important; max-width: 480px !important; }
        }
        @media (max-width: 480px) {
          .cards-grid { padding: 0 4px !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#060614 0%,#0c0c1d 40%,#0f0a1e 70%,#060614 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "clamp(24px,5vw,60px) clamp(16px,4vw,40px)",
        position: "relative", overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>

        {/* Ambient orbs */}
        <div style={{ position:"absolute", top:"-10%", left:"-5%", width:"50vw", height:"50vw", maxWidth:700, maxHeight:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:"45vw", height:"45vw", maxWidth:600, maxHeight:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:"40vw", height:"40vw", maxWidth:500, maxHeight:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />

        {/* Grid overlay */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", opacity:0.025,
          backgroundImage:`linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)`,
          backgroundSize:"60px 60px",
        }} />

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", marginBottom:"clamp(32px,6vw,56px)", position:"relative", zIndex:1, animation:"fadeUp 0.5s ease both" }}>
          {/* Already have account */}
          <div style={{ display:"flex", justifyContent:"flex-end", width:"100%", maxWidth:960, margin:"0 auto 24px" }}>
            <Link to="/login" style={{
              display:"inline-flex", alignItems:"center", gap:6,
              padding:"8px 18px",
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"999px", color:"rgba(203,213,225,0.8)",
              fontSize:"0.82rem", fontWeight:500, textDecoration:"none",
              transition:"all 0.3s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#e2e8f0"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(203,213,225,0.8)"; }}
            >
              Already have an account?
              <span style={{ color:"#818cf8", fontWeight:700 }}>Sign In →</span>
            </Link>
          </div>

          {/* Logo + badge */}
          <div style={{ marginBottom:16 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              width:60, height:60, borderRadius:18, marginBottom:16,
              background:"linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.25))",
              border:"1px solid rgba(99,102,241,0.35)",
              boxShadow:"0 0 30px rgba(99,102,241,0.2)",
            }}>
              <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="url(#g2)" strokeWidth="1.5" fill="rgba(99,102,241,0.2)"/>
                <path d="M14 8l-5 3v6l5 3 5-3v-6L14 8z" fill="url(#g2)"/>
                <defs>
                  <linearGradient id="g2" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1"/><stop offset="1" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="header-badge" style={{ display:"inline-flex" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s ease infinite" }}/>
              Neural Core Active
            </div>
          </div>

          <h1 style={{
            fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:900,
            color:"#f1f5f9", margin:"0 0 12px", lineHeight:1.15,
            letterSpacing:"-0.02em",
          }}>
            Choose Your{" "}
            <span style={{
              background:"linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>
              Gateway
            </span>
          </h1>
          <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:"rgba(148,163,184,0.7)", maxWidth:480, margin:"0 auto", lineHeight:1.6 }}>
            Select the path that aligns with your trajectory. Our neural engine will customize your dashboard accordingly.
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="cards-grid" style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gap:"clamp(14px,2.5vw,24px)",
          width:"100%", maxWidth:960,
          position:"relative", zIndex:1,
        }}>
          {ROLES.map((role, i) => {
            const isHovered = hoveredId === role.id;
            const isSelected = selectedId === role.id;
            return (
              <div
                key={role.id}
                className={`role-card${isSelected ? " selected" : ""}`}
                style={{
                  "--from": role.accentFrom,
                  "--to": role.accentTo,
                  "--glow": role.glowColor,
                  animationDelay: `${i * 0.12}s`,
                  borderColor: isHovered || isSelected
                    ? `rgba(${role.accentFrom.slice(1).match(/.{2}/g).map(h=>parseInt(h,16)).join(",")},0.5)`
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isHovered || isSelected
                    ? `0 20px 60px ${role.glowColor}, 0 0 0 1px ${role.accentFrom}44`
                    : "0 4px 24px rgba(0,0,0,0.4)",
                }}
                onClick={() => handleSelect(role)}
                onMouseEnter={() => setHoveredId(role.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="shimmer" />

                {/* Icon bubble */}
                <div style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  width:62, height:62, borderRadius:18, marginBottom:20,
                  background:`linear-gradient(135deg,${role.accentFrom}22,${role.accentTo}22)`,
                  border:`1px solid ${role.accentFrom}44`,
                  color: isHovered || isSelected ? role.accentFrom : "rgba(148,163,184,0.7)",
                  transition:"all 0.3s ease",
                  boxShadow: isHovered || isSelected ? `0 0 24px ${role.glowColor}` : "none",
                }}>
                  {role.icon}
                </div>

                {/* Label */}
                <div style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color: role.accentFrom, marginBottom:4, opacity: isHovered||isSelected?1:0.7, transition:"opacity 0.3s" }}>
                  {role.label}
                </div>
                <h3 style={{ fontSize:"clamp(1.1rem,2.5vw,1.3rem)", fontWeight:800, color:"#f1f5f9", margin:"0 0 10px", lineHeight:1.2 }}>
                  {role.tagline}
                </h3>
                <p style={{ fontSize:"0.85rem", color:"rgba(148,163,184,0.65)", lineHeight:1.6, margin:"0 0 20px" }}>
                  {role.description}
                </p>

                {/* Feature pills */}
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                  {role.features.map((f) => (
                    <div key={f} className="feature-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={role.accentFrom} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className="cta-btn"
                  style={{ "--from": role.accentFrom, "--to": role.accentTo, "--glow": role.glowColor }}
                  onClick={(e) => { e.stopPropagation(); handleSelect(role); }}
                >
                  {isSelected ? "Initializing..." : `Join as ${role.label} →`}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop:"clamp(32px,5vw,52px)", textAlign:"center",
          position:"relative", zIndex:1, animation:"fadeUp 0.7s 0.5s ease both",
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"10px 22px",
            background:"rgba(255,255,255,0.02)",
            border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:12, marginBottom:20,
          }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"pulse 2s ease infinite" }}/>
            <span style={{ fontSize:"0.72rem", letterSpacing:"0.12em", color:"rgba(148,163,184,0.4)", textTransform:"uppercase" }}>
              Neural Core Processing Active — Choose to Synchronize
            </span>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"8px 20px" }}>
            {["Privacy Policy","Terms of Service","AI Ethics","Support"].map((t) => (
              <a key={t} href="#" style={{ fontSize:"0.75rem", color:"rgba(148,163,184,0.35)", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="rgba(148,163,184,0.7)"}
                onMouseLeave={e=>e.target.style.color="rgba(148,163,184,0.35)"}>
                {t}
              </a>
            ))}
          </div>
          <p style={{ marginTop:12, fontSize:"0.72rem", color:"rgba(148,163,184,0.25)" }}>
            © 2025 SkillBridge Neural Systems. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
