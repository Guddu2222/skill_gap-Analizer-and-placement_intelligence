
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CollegeDashboard from './pages/CollegeDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SkillIntelligence from './pages/SkillIntelligence';
import AlumniNetwork from './pages/AlumniNetwork';
import InterviewPrep from './pages/InterviewPrep';
import RecruiterCRM from './pages/RecruiterCRM';
import SmartShortlist from './pages/SmartShortlist';

// Signup Pages
import RoleSelectionPage from './pages/signup/RoleSelectionPage';
import StudentSignup from './pages/signup/StudentSignup';
import CollegeSignup from './pages/signup/CollegeSignup';
import RecruiterSignup from './pages/signup/RecruiterSignup';
import EmailVerificationPage from './pages/signup/EmailVerificationPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Signup Routes */}
        <Route path="/signup" element={<RoleSelectionPage />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/signup/college" element={<CollegeSignup />} />
        <Route path="/signup/recruiter" element={<RecruiterSignup />} />
        <Route path="/signup/verify-email" element={<EmailVerificationPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/college" element={<CollegeDashboard />} />
        <Route path="/college/recruiters" element={<RecruiterCRM />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/smart-shortlist" element={<SmartShortlist />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/skills" element={<SkillIntelligence />} />
        <Route path="/student/alumni" element={<AlumniNetwork />} />
        <Route path="/student/interviews" element={<InterviewPrep />} />
      </Routes>
    </Router>
  );
};

export default App;
