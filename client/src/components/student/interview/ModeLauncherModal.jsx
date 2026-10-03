import React, { useState } from "react";
import { Target, Layers, Sparkles, Building2, ChevronRight, X, Cpu } from "lucide-react";

const DOMAINS = [
  { id: "Web Development", name: "Web Development", desc: "React, Node.js, Express, MongoDB, REST APIs" },
  { id: "Data Science & AI", name: "Data Science & AI", desc: "Python, ML, Pandas, NumPy, Scikit-learn, PyTorch" },
  { id: "Cloud & DevOps", name: "Cloud & DevOps", desc: "Docker, Kubernetes, AWS, Terraform, CI/CD" },
  { id: "Cybersecurity", name: "Cybersecurity", desc: "OWASP Top 10, Network Security, Cryptography, Wireshark" },
  { id: "Mobile Development", name: "Mobile Development", desc: "Flutter, React Native, iOS, Android, Kotlin" },
  { id: "Software Engineering & DSA", name: "Software Engineering & DSA", desc: "C++, Java, Algorithms, System Design, Data Structures" },
];

const ModeLauncherModal = ({ isOpen, onClose, onLaunch }) => {
  const [mode, setMode] = useState("PROFILE");
  const [domain, setDomain] = useState("Web Development");
  const [targetTopic, setTargetTopic] = useState("");
  const [roundType, setRoundType] = useState("Technical");
  const [companyStyle, setCompanyStyle] = useState("General");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

  if (!isOpen) return null;

  const handleStart = () => {
    onLaunch({
      mode,
      domain,
      targetTopic,
      roundType,
      companyStyle,
      difficulty,
      questionCount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Launch AI Mock Interview
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  Stitch AI Enhanced
                </span>
              </h2>
              <p className="text-xs text-slate-400">Choose between full profile evaluation or targeted domain drills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setMode("PROFILE")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                mode === "PROFILE"
                  ? "bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className={`w-5 h-5 ${mode === "PROFILE" ? "text-indigo-400" : "text-slate-400"}`} />
                <h3 className="font-bold text-white text-sm">Mode A: Full Profile Evaluation</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-configures questions from your entire student profile, past projects, and weak skills.
              </p>
            </div>

            <div
              onClick={() => setMode("TOPIC_DRILL")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                mode === "TOPIC_DRILL"
                  ? "bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Layers className={`w-5 h-5 ${mode === "TOPIC_DRILL" ? "text-indigo-400" : "text-slate-400"}`} />
                <h3 className="font-bold text-white text-sm">Mode B: Targeted Domain Drill</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Target specific domain tracks (Web Dev, Data Science, DevOps) and specific technical topics.
              </p>
            </div>
          </div>

          {/* Domain Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Select Interview Domain
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOMAINS.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    domain === d.id
                      ? "bg-indigo-600/10 border-indigo-500 text-white"
                      : "bg-slate-950/30 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="font-semibold text-sm mb-1">{d.name}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{d.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Drill Options */}
          {mode === "TOPIC_DRILL" && (
            <div className="space-y-4 pt-2 border-t border-slate-800/60 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Specific Focus Topic (Optional)
                </label>
                <input
                  type="text"
                  value={targetTopic}
                  onChange={(e) => setTargetTopic(e.target.value)}
                  placeholder="e.g. React Hooks & Context API, SQL Indexing, Docker Networks"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Round Type</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Technical">Technical Round 1</option>
                    <option value="Coding">Coding & DSA</option>
                    <option value="Behavioral">HR / Behavioral</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company Style</label>
                  <select
                    value={companyStyle}
                    onChange={(e) => setCompanyStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General Industry</option>
                    <option value="Amazon">Amazon / Big Tech</option>
                    <option value="TCS">TCS / Enterprise</option>
                    <option value="Startup">High-Growth Startup</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {mode === "PROFILE" ? "Full Profile Context Loaded" : `Targeting: ${domain}`}
          </span>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2"
          >
            Launch Interview Session
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeLauncherModal;
