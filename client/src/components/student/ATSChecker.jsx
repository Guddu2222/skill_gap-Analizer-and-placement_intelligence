import React, { useState } from "react";
import { analyzeATS } from "../../services/api";
import { FileText, CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function ATSChecker() {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await analyzeATS(jobDescription);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError("Failed to parse ATS data.");
      }
    } catch (err) {
      setError(err.message || "An error occurred checking ATS compatibility.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper to determine score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200 outline-emerald-500/20";
    if (score >= 50) return "bg-amber-50 border-amber-200 outline-amber-500/20";
    return "bg-red-50 border-red-200 outline-red-500/20";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#0071e3]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">ATS Reality Check</h2>
          <p className="text-sm text-slate-500">Compare your profile against a live job description.</p>
        </div>
      </div>

      {!result && !analyzing && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all resize-none placeholder-slate-400"
              placeholder="Paste the target Job Description (JD) here (e.g. from LinkedIn, Indeed, etc.)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
            {error && (
              <p className="absolute bottom-4 left-4 text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim()}
            className="w-full py-3 bg-[#0071e3] hover:bg-[#005cbb] text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Scan JD against my Profile
          </button>
        </div>
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin" />
          <p className="text-slate-600 font-medium animate-pulse">Running ATS extraction algorithms...</p>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`col-span-1 border rounded-2xl p-6 flex flex-col items-center justify-center outline outline-4 outline-offset-0 ${getScoreBg(result.matchScore)}`}>
              <div className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                Match Score
              </div>
              <div className={`text-6xl font-black tracking-tighter ${getScoreColor(result.matchScore)}`}>
                {result.matchScore}<span className="text-3xl">%</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
              <div className="min-w-[40px] h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-800 font-bold mb-2">Strategy Advice</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{result.actionableAdvice}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Matched Keywords */}
            <div>
              <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ATS Matched Checkpoints
              </h3>
              {result.matchedKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No core match points found.</p>
              )}
            </div>

            {/* Missing Keywords */}
            <div>
              <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                Missing Critical Keywords
              </h3>
              {result.missingKeywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Perfect match! No missing keywords.</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                setResult(null);
                setJobDescription("");
              }}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Analyze Another JD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
