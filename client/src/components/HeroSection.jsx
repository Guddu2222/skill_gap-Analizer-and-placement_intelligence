import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  PlayIcon,
  CheckCircle2,
  BrainCircuit,
  BarChart3,
  Target,
  Zap,
  X,
  Cpu,
  GraduationCap,
  Briefcase,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const FEATURES = [
  { icon: BrainCircuit, label: "AI Skill Gap Analysis", color: "#6366f1", id: "ai-skill" },
  { icon: BarChart3, label: "Placement Intelligence", color: "#06b6d4", id: "placement-intel" },
  { icon: Target, label: "Smart Job Matching", color: "#8b5cf6", id: "smart-match" },
  { icon: Zap, label: "Interview Prep AI", color: "#f59e0b", id: "interview-ai" },
];

const SmartMatchModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const generatedData = [];
      // Generate 1200 data points (1000+ students)
      for (let i = 0; i < 1200; i++) {
        // Base skill score with normal distribution roughly around 40-100
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        let skillScore = Math.floor(z * 15 + 65); 
        if (skillScore > 100) skillScore = 100;
        if (skillScore < 20) skillScore = 20;

        // Job match score is correlated to skill score with some variance
        const noise = (Math.random() - 0.5) * 25;
        let matchScore = skillScore * 0.85 + 15 + noise;
        if (matchScore > 100) matchScore = 100;
        if (matchScore < 10) matchScore = 10;

        generatedData.push({
          id: i,
          skillScore: Math.floor(skillScore),
          matchScore: Math.floor(matchScore),
          density: 1 // for bubble size
        });
      }
      setData(generatedData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl aspect-[21/9] bg-[#0a0a0f] rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/10 flex flex-col p-6 md:p-10 mx-4">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20 bg-white/5 rounded-full p-2">
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <Target className="w-8 h-8 md:w-10 md:h-10 text-violet-400" />
            Smart Job Matching
          </h2>
          <p className="text-gray-400 mt-2 text-lg">AI correlation analysis of 1,200+ students: Overall Skill Proficiency vs. Job Match Accuracy.</p>
        </div>

        <div className="flex-1 w-full min-h-0 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
              <XAxis 
                type="number" 
                dataKey="skillScore" 
                name="Skill Score" 
                unit="%" 
                domain={[0, 100]}
                stroke="#ffffff40" 
                tick={{fill: '#ffffff60', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                label={{ value: 'Technical Skill Proficiency', position: 'bottom', fill: '#ffffff60', fontSize: 14 }}
              />
              <YAxis 
                type="number" 
                dataKey="matchScore" 
                name="Job Match" 
                unit="%" 
                domain={[0, 100]}
                stroke="#ffffff40" 
                tick={{fill: '#ffffff60', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                label={{ value: 'AI Job Match Probability', angle: -90, position: 'left', fill: '#ffffff60', fontSize: 14 }}
              />
              <ZAxis type="number" dataKey="density" range={[30, 30]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                formatter={(value, name) => [`${value}%`, name === 'skillScore' ? 'Skill Score' : 'Job Match']}
              />
              <Scatter name="Students" data={data} fill="#8b5cf6" fillOpacity={0.5} animationDuration={2500} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Background glow for chart */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-violet-500/10 blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
};

const PlacementGraphModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const generatedData = [];
      let totalPlacements = 1200;
      for (let i = 0; i < 500; i++) {
        totalPlacements += Math.floor(Math.random() * 5) + Math.floor(i / 50); 
        generatedData.push({
          day: i,
          placements: totalPlacements,
          offers: Math.floor(Math.random() * 15) + Math.floor(i / 100),
        });
      }
      setData(generatedData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl aspect-[21/9] bg-[#0a0a0f] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-white/10 flex flex-col p-6 md:p-10 mx-4">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20 bg-white/5 rounded-full p-2">
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
            Placement Intelligence
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Real-time simulation showing total student placements secured over a 500-day period.</p>
        </div>

        <div className="flex-1 w-full min-h-0 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#ffffff40" 
                tick={{fill: '#ffffff60', fontSize: 12}} 
                tickFormatter={(value) => `Day ${value}`} 
                minTickGap={50} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#ffffff40" 
                tick={{fill: '#ffffff60', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                labelFormatter={(label) => `Timeline: Day ${label}`}
                formatter={(value) => [`${value} Students`, 'Total Placements']}
              />
              <Area 
                type="monotone" 
                dataKey="placements" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPlacements)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Background glow for chart */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
};

const DemoModal = ({ isOpen, onClose }) => {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setScene(0);
      const timers = [
        setTimeout(() => setScene(1), 3000), // 3s
        setTimeout(() => setScene(2), 6000), // 6s
        setTimeout(() => setScene(3), 9000), // 9s
        setTimeout(() => setScene(4), 12000), // 12s
        setTimeout(() => { setScene(5); setTimeout(onClose, 2000); }, 15000) // End at 15s
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scenes = [
    { icon: BrainCircuit, title: "Skill Gap Analyzer", text: "AI-Powered Intelligence for your career.", color: "text-indigo-400" },
    { icon: Cpu, title: "Step 1: AI Skill Assessment", text: "We analyze your current technical & soft skills using advanced models.", color: "text-cyan-400" },
    { icon: GraduationCap, title: "Step 2: Gap Identification", text: "Comparing your profile with real-world industry demands.", color: "text-violet-400" },
    { icon: Target, title: "Step 3: Smart Matching", text: "Connecting you directly with the right colleges & recruiters.", color: "text-emerald-400" },
    { icon: Rocket, title: "Land Your Dream Job", text: "You are placed. Real-world placements, reimagined.", color: "text-amber-400" },
    { icon: CheckCircle2, title: "Ready?", text: "Let's get started.", color: "text-white" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <style>{`
        @keyframes demoProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .demo-progress-bar {
          animation: demoProgress 15s linear forwards;
        }
      `}</style>
      
      <div className="relative w-full max-w-5xl aspect-video bg-[#0a0a0f] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10 flex items-center justify-center mx-4">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20 bg-white/5 rounded-full p-2">
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 demo-progress-bar z-20"></div>

        {/* Scene Content */}
        {scenes.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-1000 transform
                ${scene === idx ? "opacity-100 scale-100 translate-y-0" : 
                  scene > idx ? "opacity-0 scale-110 -translate-y-10 pointer-events-none" : "opacity-0 scale-90 translate-y-10 pointer-events-none"
                }`}
            >
               <Icon className={`w-28 h-28 md:w-40 md:h-40 mb-8 ${s.color} ${scene === idx ? "animate-pulse drop-shadow-2xl" : ""}`} />
               <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 text-center tracking-tight">{s.title}</h2>
               <p className="text-lg md:text-2xl text-gray-400 text-center max-w-2xl leading-relaxed">{s.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden pt-28">
      {/* Modals */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <PlacementGraphModal isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} />
      <SmartMatchModal isOpen={isSmartMatchOpen} onClose={() => setIsSmartMatchOpen(false)} />

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

            <button 
              onClick={() => setIsDemoOpen(true)}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 backdrop-blur-md hover:border-white/20 group"
            >
              <PlayIcon className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, color, id }, i) => (
              <div
                key={i}
                onClick={() => {
                  if (id === 'placement-intel') setIsGraphOpen(true);
                  if (id === 'smart-match') setIsSmartMatchOpen(true);
                }}
                className={`glass-abyssal rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 
                           ${id === 'placement-intel' ? 'cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-2 ring-1 ring-cyan-500/30' : 
                             id === 'smart-match' ? 'cursor-pointer hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-2 ring-1 ring-violet-500/30' : 
                             'cursor-default hover:scale-105'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    boxShadow: `0 0 18px ${color}22`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <p className="text-sm font-semibold text-gray-300 leading-tight">{label}</p>
                {id === 'placement-intel' && (
                  <span className="text-[10px] uppercase tracking-widest text-cyan-400 mt-2 opacity-80 bg-cyan-500/10 px-2 py-1 rounded-md">View Graph</span>
                )}
                {id === 'smart-match' && (
                  <span className="text-[10px] uppercase tracking-widest text-violet-400 mt-2 opacity-80 bg-violet-500/10 px-2 py-1 rounded-md">View Analysis</span>
                )}
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
