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

      {/* Why SkillBridge Section */}
      <section className="py-24 relative bg-surface border-t border-gray-800/50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
              Why SkillBridge?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI Skill Analysis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Deep skill mapping predicting candidate success.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Smart Matching</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Algorithms matching cultural and technical fit.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Live Tracking</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time placement dashboards and status alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Certified Skills</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Immutable and verified technical credentials.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Placement Reports</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Data visualizations tracking hiring trends.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Interview Prep</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Personalized AI mock interviews customized for roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-indigo-900/20 border-t border-indigo-500/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-10 text-white tracking-tight">
            Ready to Transform Campus Placements?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-full bg-white text-indigo-950 font-bold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Start For Free
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-full bg-surface-lighter text-white font-bold text-lg hover:bg-gray-800 transition-colors border border-gray-700 w-full sm:w-auto"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0c10] text-gray-400 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">SkillBridge</span>
              </div>
              <p className="text-sm leading-relaxed mb-8">
                Empowering the next generation of global talent through intelligent matching and AI assessments.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-gray-800/50 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  {/* Social Icon placeholder */}
                </div>
                <div className="w-10 h-10 rounded bg-gray-800/50 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                </div>
                <div className="w-10 h-10 rounded bg-gray-800/50 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/signup/student" className="hover:text-white transition-colors">Students</Link></li>
                <li><Link to="/signup/college" className="hover:text-white transition-colors">Institutions</Link></li>
                <li><Link to="/signup/recruiter" className="hover:text-white transition-colors">Recruiters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 SkillBridge Intelligence Inc. All rights reserved.</p>
            <p>Built with the Neural Architect Engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
