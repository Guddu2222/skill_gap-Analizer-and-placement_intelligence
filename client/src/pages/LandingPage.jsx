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

      {/* Trusted By Section */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a1a] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface z-10 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-0">
          <p className="text-xs font-bold text-gray-500 tracking-[0.2em] mb-8 uppercase">
            Trusted by the Neural Network of Leading Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            {/* Logos text representation */}
            <span className="text-2xl font-black text-white tracking-tighter">Google</span>
            <span className="text-2xl font-black text-white tracking-tighter">Microsoft</span>
            <span className="text-2xl font-black text-white tracking-tighter">Amazon</span>
            <span className="text-2xl font-black text-white tracking-tighter">Wipro</span>
            <span className="text-2xl font-black text-white tracking-tighter">TCS</span>
            <span className="text-2xl font-black text-white tracking-tighter">Infosys</span>
          </div>
        </div>
      </section>

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

      {/* Features Grid Section */}
      <section className="py-24 bg-[#080816] border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white">Why SkillBridge?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { icon: Zap, title: "AI Skill Analysis", desc: "Deep skill mapping predicting candidate success." },
              { icon: Target, title: "Smart Matching", desc: "Algorithms matching cultural and technical fit." },
              { icon: Activity, title: "Live Tracking", desc: "Real-time placement dashboards and status alerts." },
              { icon: ShieldCheck, title: "Certified Skills", desc: "Immutable and verified technical credentials." },
              { icon: Award, title: "Placement Reports", desc: "Data visualizations tracking hiring trends." },
              { icon: Users, title: "Interview Prep", desc: "Personalized AI mock interviews customized for roles." }
            ].map((feat, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-16 h-16 rounded-full glass-abyssal flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 transition-colors duration-300">
                  <feat.icon className="w-8 h-8 text-indigo-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-violet-900 opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Ready to Transform Campus Placements?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/signup" className="px-10 py-4 bg-white text-indigo-900 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300">
              Start For Free
            </Link>
            <button className="px-10 py-4 glass-abyssal rounded-full font-bold text-white hover:bg-white/10 transition-colors duration-300">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Dark Premium Footer */}
      <footer className="bg-[#0a0a1a] pt-20 pb-10 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
               <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-white/20" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">SkillBridge</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                Empowering the next generation of global talent through intelligent matching and AI assessments.
              </p>
              <div className="flex space-x-4 opacity-50">
                {/* Social icons placeholders */}
                <div className="w-8 h-8 rounded bg-white/10"></div>
                <div className="w-8 h-8 rounded bg-white/10"></div>
                <div className="w-8 h-8 rounded bg-white/10"></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Platform</h4>
              <ul className="space-y-4 text-gray-400 cursor-pointer">
                <li className="hover:text-indigo-400 transition-colors">Students</li>
                <li className="hover:text-indigo-400 transition-colors">Institutions</li>
                <li className="hover:text-indigo-400 transition-colors">Recruiters</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Company</h4>
              <ul className="space-y-4 text-gray-400 cursor-pointer">
                <li className="hover:text-indigo-400 transition-colors">About Us</li>
                <li className="hover:text-indigo-400 transition-colors">Careers</li>
                <li className="hover:text-indigo-400 transition-colors">Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">Legal</h4>
              <ul className="space-y-4 text-gray-400 cursor-pointer">
                <li className="hover:text-indigo-400 transition-colors">Privacy Policy</li>
                <li className="hover:text-indigo-400 transition-colors">Terms of Service</li>
                <li className="hover:text-indigo-400 transition-colors">Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 SkillBridge Intelligence Inc. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Built with the Neural Architect Engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
