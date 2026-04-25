import React from "react";
import {
  Sparkles,
  ArrowRight,
  PlayIcon,
  CheckCircle2,
  BrainCircuit,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: BrainCircuit, label: "AI Skill Gap Analysis", color: "#6366f1" },
  { icon: BarChart3, label: "Placement Intelligence", color: "#06b6d4" },
  { icon: Target, label: "Smart Job Matching", color: "#8b5cf6" },
  { icon: Zap, label: "Interview Prep AI", color: "#f59e0b" },
];

const HeroSection = () => {

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden pt-28">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] mesh-orb-1 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] mesh-orb-2 rounded-full blur-[90px] opacity-50 mix-blend-screen animate-pulse delay-700"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] mesh-orb-3 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse delay-1000"></div>
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Top Text Content - Centered */}
        <div className="flex flex-col items-center text-center mb-16 space-y-8 animate-slideUp">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold tracking-wide text-indigo-200">
              ⚡ AI-Powered Platform • Now with Gemini AI
            </span>
          </div>

          {/* Huge Main Headline */}
          <h1 className="text-6xl md:text-[80px] font-black leading-[1.05] tracking-tight text-white max-w-5xl">
            Bridge the Gap.<br />
            <span className="text-gradient-neural">Land Your Dream Job.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
            Connect students, colleges & recruiters on one intelligent platform powered by AI skill analysis. Real-world placements, reimagined for the neural age.
          </p>

          {/* Mini Checkmarks */}
          <div className="flex flex-wrap justify-center gap-6 pt-2">
            {[
              "AI Skill Gap Analysis",
              "Real-time Placement Tracking",
              "Predictive Analytics",
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-300 font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pt-6">
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full font-bold text-white shadow-xl glow-shadow-indigo transform transition-all duration-300 hover:scale-105 flex items-center space-x-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 text-base">Get Started for Free</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 backdrop-blur-md hover:border-white/20">
              <PlayIcon className="w-5 h-5 text-gray-300" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid — honest, no fake numbers */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, color }, i) => (
              <div
                key={i}
                className="glass-abyssal rounded-2xl p-6 flex flex-col items-center text-center gap-4
                           hover:scale-105 transition-transform duration-300 cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    boxShadow: `0 0 18px ${color}22`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <p className="text-sm font-semibold text-gray-300 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Subtle glow beneath cards */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20
                          bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
