import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import studentImg from '../assets/student.png';
import collegeImg from '../assets/collage.png';
import recruiterImg from '../assets/Recruiters.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <HeroSection />

      {/* Trusted By Section */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-8">Trusted by 500+ Institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Text placeholders for logos */}
             <span className="text-xl font-bold text-gray-800">Google</span>
             <span className="text-xl font-bold text-gray-800">Microsoft</span>
             <span className="text-xl font-bold text-gray-800">Amazon</span>
             <span className="text-xl font-bold text-gray-800">Spotify</span>
             <span className="text-xl font-bold text-gray-800">Slack</span>
          </div>
        </div>
      </section>

      {/* Feature Section: 3 Ecosystems */}
      <section id="solutions" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">One Platform, Three Ecosystems</h2>
            <p className="text-gray-600">Seamlessly connecting every stakeholder in the recruitment lifecycle with purpose-built tools.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all bg-white relative overflow-hidden">
               <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img src={studentImg} alt="Student" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
               </div>
               <h3 className="text-xl font-bold mb-2">For Students</h3>
               <p className="text-gray-600 text-sm mb-4">Build your AI-verified profile, bridge skill gaps, and get matched with your dream companies.</p>
               <Link to="/signup/student" className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Sign Up as Student <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>

             {/* College Card */}
             <div className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all bg-white relative overflow-hidden">
               <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img src={collegeImg} alt="College" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
               </div>
               <h3 className="text-xl font-bold mb-2">For Colleges</h3>
               <p className="text-gray-600 text-sm mb-4">Digitize placement cells, track student progress in real-time, and improve corporate relations.</p>
               <Link to="/signup/college" className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Sign Up as College <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>

             {/* Recruiter Card */}
             <div className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all bg-white relative overflow-hidden">
               <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img src={recruiterImg} alt="Recruiter" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
               </div>
               <h3 className="text-xl font-bold mb-2">For Recruiters</h3>
               <p className="text-gray-600 text-sm mb-4">Access a pre-screened talent pool, conduct AI-proctored assessments, and hire 10x faster.</p>
               <Link to="/signup/recruiter" className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Sign Up as Recruiter <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm">© 2026 PlacementAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
