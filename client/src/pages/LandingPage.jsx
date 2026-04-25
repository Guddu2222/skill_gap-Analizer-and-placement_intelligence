import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { ArrowRight, GraduationCap, Building, Briefcase, Zap, ShieldCheck, Activity, Target, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface font-sans text-gray-300 selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />

      {/* Removed fake company logos — will add real partnerships when earned */}

      {/* Feature Section: 3 Ecosystems */}
      <section id="solutions" className="py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
              One Platform. <br/>
              <span className="text-gradient-neural">Three Ecosystems.</span>
            </h2>
            <p className="text-lg text-gray-400">
              Purpose-built tools designed perfectly for every stakeholder in the placement lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="group glass-abyssal p-8 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <GraduationCap className="w-24 h-24 text-violet-400" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-8 relative z-10">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">For Students</h3>
              <p className="text-gray-400 leading-relaxed mb-8 relative z-10">
                Build your AI-verified profile, bridge specific skill gaps, take proactive assessments, and get directly matched with your dream companies.
              </p>
              <Link
                to="/signup/student"
                className="inline-flex items-center font-semibold text-violet-400 group-hover:text-violet-300 transition-colors relative z-10"
              >
                Sign Up as Student <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* College Card */}
            <div className="group glass-abyssal p-8 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Building className="w-24 h-24 text-cyan-400" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-8 relative z-10">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">For Colleges</h3>
              <p className="text-gray-400 leading-relaxed mb-8 relative z-10">
                Digitize placement cells, track vital student progress in real-time, generate smart reports, and significantly improve corporate relations.
              </p>
              <Link
                to="/signup/college"
                className="inline-flex items-center font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors relative z-10"
              >
                Sign Up as College <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Recruiter Card */}
            <div className="group glass-abyssal p-8 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-24 h-24 text-amber-400" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-8 relative z-10">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">For Recruiters</h3>
              <p className="text-gray-400 leading-relaxed mb-8 relative z-10">
                Access a massive pre-screened talent pool, conduct AI-proctored technical assessments, and hire verified talent 10x faster.
              </p>
              <Link
                to="/signup/recruiter"
                className="inline-flex items-center font-semibold text-amber-500 group-hover:text-amber-400 transition-colors relative z-10"
              >
                Sign Up as Recruiter <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 SkillBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
