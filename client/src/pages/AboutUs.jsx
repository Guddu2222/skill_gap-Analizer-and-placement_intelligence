import React from "react";
import Navbar from "../components/Navbar";
import { 
  ArrowRight, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Globe, 
  Shield 
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar theme="light" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-blue-100/50 text-blue-700 px-4 py-2 rounded-full mb-6 border border-blue-200">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">OUR STORY</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-6 leading-tight">
            Bridging the gap between <span className="text-blue-600">talent</span> and <span className="text-indigo-600">opportunity</span>
          </h1>
          <h1>My name is guddu</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            SkillBridge is the premier platform connecting students, colleges, and recruiters in a seamless ecosystem designed to revolutionize the way early-career talent is discovered and hired.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8">
            <div className="text-center p-4">
              <h3 className="text-4xl font-black text-blue-600 mb-2">500+</h3>
              <p className="text-gray-500 font-medium">Partner Colleges</p>
            </div>
            <div className="text-center p-4 border-l border-gray-100">
              <h3 className="text-4xl font-black text-indigo-600 mb-2">1M+</h3>
              <p className="text-gray-500 font-medium">Active Students</p>
            </div>
            <div className="text-center p-4 border-l border-gray-100">
              <h3 className="text-4xl font-black text-blue-600 mb-2">2,000+</h3>
              <p className="text-gray-500 font-medium">Hiring Partners</p>
            </div>
            <div className="text-center p-4 border-l border-gray-100">
              <h3 className="text-4xl font-black text-indigo-600 mb-2">95%</h3>
              <p className="text-gray-500 font-medium">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                We believe that talent is universally distributed, but opportunity is not. Our mission is to democratize access to career opportunities for students globally, regardless of their background or geography.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                By leveraging Artificial Intelligence and robust data analytics, we provide deep insights that help educators tailor their curriculums, empower students to upskill effectively, and allow recruiters to find the perfect fit seamlessly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <Target className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="text-xl font-bold mb-2">Precision</h4>
                <p className="text-gray-600 text-sm">AI-driven matching to ensure the highest quality pairing between candidates and roles.</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl md:translate-y-8">
                <Shield className="w-10 h-10 text-indigo-600 mb-4" />
                <h4 className="text-xl font-bold mb-2">Trust</h4>
                <p className="text-gray-600 text-sm">Verified skills and transparent credentials that employers can rely on securely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystems */}
      <section className="py-24 bg-gray-50/50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">One Unified Ecosystem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We serve three pillars of the recruitment life-cycle, ensuring that expectations are aligned, and friction is eliminated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Students</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A personal career command center. Students can track their skills, discover learning paths, and confidently apply to roles where they have the highest probability of success.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:-translate-y-4">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Colleges</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A digital placement cell. Educators get actionable analytics on skill gaps across batches, improving institutional placement records and corporate relations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">For Recruiters</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A rapid hiring engine. Pre-assessed talent pools and AI proctoring mean teams spend less time screening and more time having meaningful conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your hiring journey?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of users who are already experiencing the future of early-career recruitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-white text-blue-900 text-lg font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl w-full sm:w-auto">
              Get Started for Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-blue-800 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-colors border border-blue-700 w-full sm:w-auto flex items-center justify-center gap-2">
              Sign In <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 SkillBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
