import React, { useState, useCallback } from "react";
import {
  UploadCloud, CheckCircle, FileText, X, Loader2, RefreshCw, ExternalLink,
} from "lucide-react";
import axios from "axios";

const PROXY_URL = "http://localhost:5000/api/student-features/resume-view";

/**
 * ResumeUploadWidget — dark glassmorphic, matches SkillBridge Abyssal theme.
 * Props:
 *  - currentResumeUrl: string | null
 *  - onUploadSuccess: (url, completionPct) => void
 */
const ResumeUploadWidget = ({ currentResumeUrl, onUploadSuccess }) => {
  const [file, setFile]                   = useState(null);
  const [isDragActive, setIsDragActive]   = useState(false);
  const [uploadState, setUploadState]     = useState("idle"); // idle | uploading | success | error
  const [errorMessage, setErrorMessage]   = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  // Always normalise stored URL so PDFs open correctly
  const [activeUrl, setActiveUrl] = useState(currentResumeUrl);
  // "preview" = show existing resume card | "upload" = show drop-zone
  const [view, setView] = useState(currentResumeUrl ? "preview" : "upload");

  /* ── drag handlers ───────────────────────────────────────────────────────── */
  const onDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true);  }, []);
  const onDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); }, []);
  const onDragOver  = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

  const validate = (f) => {
    if (!f) return false;
    const ok = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!ok.includes(f.type)) { setErrorMessage("Please upload a PDF or Word document."); return false; }
    if (f.size > 5 * 1024 * 1024) { setErrorMessage("File must be under 5 MB."); return false; }
    return true;
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && validate(f)) { setFile(f); setErrorMessage(""); }
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && validate(f)) { setFile(f); setErrorMessage(""); }
  };

  const clearFile = () => { setFile(null); setUploadState("idle"); setErrorMessage(""); setUploadProgress(0); };

  /* ── upload ──────────────────────────────────────────────────────────────── */
  const handleUpload = async () => {
    if (!file) return;
    setUploadState("uploading");
    setErrorMessage("");

    const interval = setInterval(() =>
      setUploadProgress((p) => { if (p >= 90) { clearInterval(interval); return 90; } return p + 10; }), 200);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/student-features/upload-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data", "x-auth-token": token } },
      );
      clearInterval(interval);
      setUploadProgress(100);
      setUploadState("success");
      setActiveUrl(data.resumeUrl);

      setTimeout(() => {
        onUploadSuccess?.(data.resumeUrl, data.profileCompletionPercentage);
        setFile(null);
        setUploadState("idle");
        setUploadProgress(0);
        setView("preview");
      }, 1200);
    } catch (err) {
      clearInterval(interval);
      setUploadState("error");
      setErrorMessage(err.response?.data?.error || "Upload failed. Please try again.");
    }
  };

  /* ── helper: truncate long URL for display ───────────────────────────────── */
  const displayUrl = (url) => {
    if (!url) return "";
    try { return decodeURIComponent(url.split("/").pop()); } catch { return url; }
  };

  /* ══════════════════════════════════════════════════════════════════════════
     VIEW: Preview existing resume
  ══════════════════════════════════════════════════════════════════════════ */
  if (view === "preview" && uploadState !== "success") {
    return (
      <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        {/* glow accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
              Resume
              <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full tracking-normal normal-case">
                ✓ Uploaded
              </span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">Your resume is visible to recruiters and placement cells.</p>
          </div>
        </div>

        {/* File card with integrated actions */}
        <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-indigo-500/20 rounded-2xl transition-all mb-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-bold text-white truncate" title={displayUrl(activeUrl)}>
                {displayUrl(activeUrl)}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active • Recruiter Ready</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => setView("upload")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all group/btn"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-500" />
              Replace
            </button>
            
            {activeUrl && (
              <a
                href={`${PROXY_URL}?t=${Date.now()}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  const token = localStorage.getItem("token");
                  e.preventDefault();
                  const url = `${PROXY_URL}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
                  window.open(url, "_blank");
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 hover:text-indigo-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     VIEW: Upload / Replace form
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
            {activeUrl ? "Replace Resume" : "Upload Resume"}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {activeUrl
              ? "The new file will immediately replace your current resume."
              : "Required to apply for placements and boost profile visibility."}
          </p>
        </div>
        {/* Cancel back to preview */}
        {activeUrl && (
          <button
            onClick={() => { setView("preview"); clearFile(); }}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Success state ── */}
      {uploadState === "success" ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="text-white font-bold mb-1">{activeUrl ? "Resume Replaced!" : "Upload Successful!"}</h4>
          <p className="text-slate-400 text-sm">Your resume has been updated on your profile.</p>
        </div>
      ) : (
        <>
          {/* ── Drop-zone (no file yet) ── */}
          {!file ? (
            <div
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]"
                  : "border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.02]"
              }`}
            >
              <input type="file" id="resume-upload-dark" className="hidden" accept=".pdf,.doc,.docx" onChange={onFileChange} />
              <label htmlFor="resume-upload-dark" className="cursor-pointer flex flex-col items-center w-full">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  isDragActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500"
                }`}>
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">Drag & drop your resume here</h4>
                <p className="text-slate-500 text-xs mb-4">
                  or <span className="text-indigo-400 font-semibold hover:text-indigo-300">browse files</span>
                </p>
                <span className="text-[10px] text-slate-600 font-medium bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                  PDF, DOC, DOCX · Max 5 MB
                </span>
              </label>
            </div>
          ) : (
            /* ── File selected ── */
            <div className="bg-[#1a1a27] border border-white/5 rounded-xl p-5">
              {/* File row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {uploadState !== "uploading" && (
                  <button onClick={clearFile} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Error */}
              {uploadState === "error" && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-lg mb-4">
                  <X className="w-4 h-4 flex-shrink-0" /> {errorMessage}
                </div>
              )}

              {/* Progress bar */}
              {uploadState === "uploading" && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-indigo-400 mb-1.5">
                    <span>Uploading…</span><span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={uploadState === "uploading"}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  uploadState === "uploading"
                    ? "bg-indigo-500/30 text-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {uploadState === "uploading"
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  : <><UploadCloud className="w-4 h-4" /> {activeUrl ? "Replace Resume" : "Upload Resume"}</>
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResumeUploadWidget;
