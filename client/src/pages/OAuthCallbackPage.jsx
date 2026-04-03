import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * OAuthCallbackPage
 * ─────────────────
 * Receives the JWT redirect from the server after Google/LinkedIn OAuth.
 * URL format: /oauth-callback?token=JWT&role=student&userId=abc123
 *
 * Uses window.location.replace() for a hard browser redirect — this is
 * the most reliable approach after OAuth, avoiding React Router race conditions.
 */
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");
    const errorParam = searchParams.get("error");

    // ── Server returned an error ─────────────────────────────────────────────
    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
      setStatus("error");
      return;
    }

    // ── No token received ────────────────────────────────────────────────────
    if (!token) {
      setErrorMsg("Authentication failed — no token was received. Please try again.");
      setStatus("error");
      return;
    }

    // ── Store auth data in localStorage ─────────────────────────────────────
    try {
      localStorage.setItem("token", token);
      if (role) localStorage.setItem("userRole", role);
      if (userId) localStorage.setItem("userId", userId);
    } catch (e) {
      setErrorMsg("Could not save session. Please allow localStorage in your browser.");
      setStatus("error");
      return;
    }

    // ── Hard redirect to the correct dashboard ───────────────────────────────
    // Using window.location.replace() instead of React Router's navigate() to
    // avoid StrictMode double-run issues and routing race conditions post-OAuth.
    const normalized = (role || "student").toLowerCase();
    let destination = "/student";
    if (normalized === "college_admin" || normalized === "college") destination = "/college";
    else if (normalized === "recruiter") destination = "/recruiter";

    // Small timeout so the loading spinner is visually shown
    setTimeout(() => {
      window.location.replace(destination);
    }, 800);
  }, []); // ← empty deps: run exactly once on mount

  // ── Error State ──────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Failed</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-7">{errorMsg}</p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Loading State ─────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.10)",
          padding: "52px 44px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Spinner — uses inline style to guarantee rendering without CSS deps */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "4px solid #dbeafe",
              borderTopColor: "#2563eb",
              animation: "sb-spin 0.9s linear infinite",
            }}
          />
          <style>{`@keyframes sb-spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        {/* Brand name */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "10px",
          }}
        >
          SkillBridge
        </h1>

        <p style={{ color: "#1f2937", fontWeight: "600", fontSize: "16px", marginBottom: "6px" }}>
          Signing you in…
        </p>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>
          Please wait, setting up your account.
        </p>

        {/* Bouncing dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "22px" }}>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#3b82f6",
                display: "inline-block",
                animation: `sb-bounce 1s ${delay}ms infinite ease-in-out`,
                opacity: 1 - delay * 0.001,
              }}
            />
          ))}
          <style>{`
            @keyframes sb-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.4; }
              50% { transform: translateY(-6px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
