import React from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  Building2,
  Award,
  ArrowRight,
  PlayIcon,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "50K+", label: "Students Placed" },
    { icon: Award, value: "94.8%", label: "Placement Rate" },
    { icon: Building2, value: "500+", label: "Institutions" },
    { icon: TrendingUp, value: "100+", label: "Companies" },
  ];

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

        {/* Dashboard Mockup Center Floating */}
        <div className="relative mx-auto mt-16 max-w-5xl animate-float">
          <div className="relative glass-abyssal rounded-[2.5rem] p-4 sm:p-8 transform perspective-1000 rotate-x-2">
            {/* Top Bar Fake */}
            <div className="flex items-center space-x-3 mb-8 px-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80"></div>
              <div className="ml-4 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-400 tracker-widest">
                SKILLBRIDGE ACTIVE INTELLIGENCE
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column Stats */}
              <div className="col-span-1 space-y-6">
                {stats.slice(0,2).map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl">
                    <stat.icon className="w-8 h-8 text-indigo-400 mb-4" />
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
                
                {/* Floating Avatars Panel */}
                <div className="glass-panel p-6 rounded-2xl">
                  <p className="text-sm font-medium text-gray-400 mb-4">Latest Matches</p>
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[#121223] bg-gradient-to-tr from-indigo-500 to-cyan-500 shadow-lg"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#121223] bg-gradient-to-tr from-violet-500 to-pink-500 shadow-lg"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#121223] bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#121223] bg-surface flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-gray-300">+99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chart Area */}
              <div className="col-span-2 glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-end">
                 {/* Decorative gradient behind chart */}
                 <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
                 
                 <div className="absolute top-8 left-8">
                    <p className="text-2xl font-bold text-white">Skill Growth Vector</p>
                    <p className="text-sm text-gray-400">Platform-wide progression</p>
                 </div>

                 {/* Bar Chart Mockup */}
                 <div className="relative flex items-end justify-between h-48 sm:h-64 mt-16 space-x-2 z-10 w-full px-2">
                    {[30, 45, 60, 50, 75, 90, 85].map((height, idx) => (
                      <div key={idx} className="w-1/6 flex flex-col items-center space-y-4 group">
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-600/50 to-cyan-400/80 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-cyan-300 animate-growUp"
                          style={{ height: `${height}%`, animationDelay: `${idx * 150}ms` }}
                        ></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
