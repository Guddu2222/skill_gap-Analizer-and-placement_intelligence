import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { Mail, ArrowRight, Loader } from "lucide-react";

const EmailVerificationPage = ({ email: propEmail }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = propEmail || location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess("");
    setError("");
    try {
      await api.post("/auth/resend-verification", { email });
      setResendSuccess("A new verification code has been sent! Check your inbox (and spam folder).");
    } catch (err) {
      setError("Failed to resend code. Please try again in a moment.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1); // Only allow 1 char
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f] relative overflow-hidden">
      {/* Premium dark aesthetic background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#191921] via-[#0e0e14] to-[#000000]"></div>
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-[#6e3bd7]/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] bg-[#c48ef9]/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>

      <div className="relative z-10 max-w-md w-full bg-[#1f1f27]/80 backdrop-blur-[20px] rounded-2xl shadow-[0_20px_40px_rgba(186,158,255,0.08)] border border-white/10 p-8 text-center">
        <div className="w-16 h-16 bg-[#ba9eff]/20 border border-[#ba9eff]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(186,158,255,0.2)]">
          <Mail className="w-8 h-8 text-[#ae8dff]" />
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Verify Your Email
        </h2>
        <p className="text-[#acaab3] mb-8 text-sm">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-[#ba9eff] mt-1 block">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#a70138]/20 border border-[#a70138] text-[#ffb2b9] rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl text-sm font-medium">
            ✅ {resendSuccess}
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-semibold text-white">Email verified successfully!</p>
            <p className="text-sm mt-1 text-emerald-400/80">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="flex justify-between gap-2 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold text-white bg-black/40 border border-white/10 rounded-xl focus:border-[#ba9eff] focus:ring-1 focus:ring-[#ba9eff] outline-none transition-all placeholder:text-white/20"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.join("").length !== 6}
              className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                loading || code.join("").length !== 6
                  ? "bg-[#25252e] text-[#acaab3] cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-br from-[#ba9eff] to-[#8455ef] text-[#39008c] shadow-[0_0_15px_rgba(186,158,255,0.4)] hover:shadow-[0_0_25px_rgba(186,158,255,0.6)] border border-[#ba9eff]/50"
              }`}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-8 text-sm text-[#acaab3]">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className={`font-semibold transition-colors ${
                resendLoading
                  ? "text-slate-500 cursor-not-allowed"
                  : "text-[#ae8dff] hover:text-white"
              }`}
            >
              {resendLoading ? "Sending..." : "Resend it"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
