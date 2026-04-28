import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Briefcase, Building, Calendar, CheckCircle, Clock, GraduationCap } from "lucide-react";
import axios from "axios";

// Helper function to handle API calls with auth token
const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const StudentDrives = () => {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drivesRes, appsRes, meRes] = await Promise.all([
        apiCall("get", "/student-features/drives"),
        apiCall("get", "/student-features/drives/applications"),
        apiCall("get", "/student-features/me"),
      ]);
      setDrives(drivesRes.data);
      setApplications(appsRes.data);
      setStudent(meRes.data.student);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student drives data:", err);
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      setApplyingTo(driveId);
      const res = await apiCall("post", `/student-features/drives/${driveId}/apply`);
      // Update applications state to reflect the new application
      setApplications([res.data, ...applications]);
    } catch (err) {
      console.error("Error applying to drive:", err);
      alert(err.response?.data?.msg || "Failed to apply");
    } finally {
      setApplyingTo(null);
    }
  };

  const getApplicationStatus = (driveId) => {
    const app = applications.find(a => a.drive?._id === driveId || a.drive === driveId);
    return app ? app.status : null;
  };

  if (loading) {
    return (
      <div className="flex bg-[#0c0c1d] min-h-screen font-sans items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0c0c1d] font-sans text-white overflow-hidden relative">
      {/* Abyssal Space Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0c0c1d] to-[#0c0c1d] pointer-events-none"></div>
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <Sidebar role="student" />
      
      <main className="flex-1 ml-64 p-8 relative z-10 flex flex-col h-screen overflow-y-auto custom-scrollbar-dark">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
            Campus Placement Drives
          </h1>
          <p className="text-[#aba9bf] text-sm tracking-wide">
            Browse and apply to active placement drives organized by your college.
          </p>
        </header>

        {drives.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-[#121223]/40 backdrop-blur-md p-12">
            <Briefcase className="w-20 h-20 text-white/10 mb-4" />
            <h2 className="text-xl font-bold text-[#e6e3fb] mb-2">No Active Drives</h2>
            <p className="text-[#aba9bf] text-center max-w-md">
              There are currently no active placement drives for your college. Check back later when your TPO creates new drives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map(drive => {
              const status = getApplicationStatus(drive._id);
              const minCgpa = drive.eligibility?.minCGPA || 0;
              const studentCgpa = student?.cgpa || 0;
              const isEligible = studentCgpa >= minCgpa;

              return (
                <div key={drive._id} className="bg-[#121223]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col hover:bg-[#1d1d33]/80 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shrink-0">
                        <Building className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white leading-tight">{drive.company}</h3>
                        <p className="text-sm text-indigo-300 font-medium">{drive.title}</p>
                      </div>
                    </div>
                    {status && (
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                        <CheckCircle className="w-3 h-3" />
                        {status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#aba9bf] mb-6 line-clamp-3 flex-1">
                    {drive.description}
                  </p>

                  <div className="space-y-3 mb-6 bg-[#0c0c1d]/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[#aba9bf]">
                        <Calendar className="w-4 h-4" />
                        <span>Posted</span>
                      </div>
                      <span className="text-white font-medium">
                        {new Date(drive.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[#aba9bf]">
                        <GraduationCap className="w-4 h-4" />
                        <span>Min CGPA</span>
                      </div>
                      <span className={`font-bold ${isEligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {minCgpa.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {!status ? (
                    isEligible ? (
                      <button
                        onClick={() => handleApply(drive._id)}
                        disabled={applyingTo === drive._id}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {applyingTo === drive._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Applying...
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-3 bg-[#24233b] border border-white/5 rounded-xl text-[#aba9bf] text-sm text-center cursor-not-allowed">
                        Not Eligible (Requires {minCgpa.toFixed(1)}+ CGPA)
                      </div>
                    )
                  ) : (
                    <div className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium text-sm text-center">
                      Application Submitted
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDrives;
