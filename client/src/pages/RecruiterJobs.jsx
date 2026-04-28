import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, MapPin, Building, Briefcase, Search, Send, Clock, DollarSign } from "lucide-react";
import axios from "axios";

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const [newJobData, setNewJobData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    description: "",
    requirements: ""
  });

  useEffect(() => {
    fetchJobs();
    fetchColleges();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await apiCall("get", "/jobs/me");
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await apiCall("get", "/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJobData,
        requirements: newJobData.requirements.split(',').map(s => s.trim())
      };
      const res = await apiCall("post", "/jobs", payload);
      setJobs([res.data, ...jobs]);
      setShowCreateModal(false);
      setNewJobData({ title: "", company: "", location: "", jobType: "Full Time", salary: "", description: "", requirements: "" });
    } catch (err) {
      console.error("Error creating job:", err);
      alert("Failed to create job.");
    }
  };

  const handleInviteCollege = async (collegeId) => {
    if (!selectedJob) return;
    setInviteLoading(true);
    try {
      await apiCall("post", "/recruiter-features/drive-requests", {
        jobId: selectedJob._id,
        collegeId: collegeId
      });
      alert("Drive request sent successfully!");
      setShowInviteModal(false);
    } catch (err) {
      console.error("Error sending invite:", err);
      alert(err.response?.data?.error || "Failed to send invite.");
    } finally {
      setInviteLoading(false);
    }
  };

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-[#070d1f] font-sans text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto custom-scrollbar-dark relative z-10">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a5aac2] mb-2">Job Postings</h1>
            <p className="text-[#a5aac2] text-lg">Manage your roles and initiate campus drives.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#cc97ff] to-[#9c48ea] hover:from-[#b971ff] hover:to-[#842cd3] text-[#070d1f] font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(204,151,255,0.3)] hover:shadow-[0_0_30px_rgba(204,151,255,0.5)] transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Job Posting</span>
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#cc97ff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-[#11192e] rounded-3xl border border-[#41475b]/30">
            <Briefcase className="w-16 h-16 text-[#41475b] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No jobs posted yet</h3>
            <p className="text-[#a5aac2] mb-6">Create a job posting to start inviting colleges.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="text-[#cc97ff] font-semibold hover:text-white transition-colors"
            >
              + Create your first job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id}
                className="bg-[#11192e]/60 backdrop-blur-xl border-t border-l border-[#41475b]/30 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#171f36]/80 transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-[#dfe4fe] group-hover:text-[#cc97ff] transition-colors">{job.title}</h3>
                    <span className="bg-[#1c253e] text-[#65e1ff] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#00687a]">
                      {job.jobType}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-[#a5aac2] mb-6">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#53ddfc]" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#53ddfc]" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#53ddfc]" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-[#6f758b] font-semibold mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.slice(0, 4).map((req, idx) => (
                        <span key={idx} className="bg-[#1c253e] text-[#a5aac2] text-xs px-2.5 py-1 rounded-md border border-[#41475b]/30">
                          {req}
                        </span>
                      ))}
                      {job.requirements?.length > 4 && (
                        <span className="text-xs text-[#6f758b] flex items-center px-1">
                          +{job.requirements.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#41475b]/20 flex justify-between items-center mt-auto">
                  <div className="text-xs text-[#6f758b]">
                    <Clock className="inline w-3 h-3 mr-1" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => { setSelectedJob(job); setShowInviteModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#cc97ff]/40 text-[#cc97ff] rounded-xl hover:bg-[#cc97ff]/10 hover:border-[#cc97ff] transition-all duration-300 text-sm font-semibold"
                  >
                    <Send className="w-4 h-4" />
                    Invite Colleges
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Job Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#11192e] border border-[#41475b]/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-dark p-8 relative shadow-2xl">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 text-[#a5aac2] hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-8 text-white">Post a New Role</h2>
              
              <form onSubmit={handleCreateJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#a5aac2] mb-1">Job Title</label>
                    <input type="text" required value={newJobData.title} onChange={e => setNewJobData({...newJobData, title: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors" placeholder="e.g. Frontend Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#a5aac2] mb-1">Company</label>
                    <input type="text" required value={newJobData.company} onChange={e => setNewJobData({...newJobData, company: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors" placeholder="e.g. Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#a5aac2] mb-1">Location</label>
                    <input type="text" required value={newJobData.location} onChange={e => setNewJobData({...newJobData, location: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors" placeholder="e.g. Remote / Bangalore" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#a5aac2] mb-1">Salary / Package</label>
                    <input type="text" value={newJobData.salary} onChange={e => setNewJobData({...newJobData, salary: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors" placeholder="e.g. 15 LPA" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a5aac2] mb-1">Job Description</label>
                  <textarea required rows="4" value={newJobData.description} onChange={e => setNewJobData({...newJobData, description: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors resize-none" placeholder="Describe the role..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a5aac2] mb-1">Required Skills (Comma separated)</label>
                  <input type="text" required value={newJobData.requirements} onChange={e => setNewJobData({...newJobData, requirements: e.target.value})} className="w-full bg-[#070d1f] border border-[#41475b]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#53ddfc] transition-colors" placeholder="React, Node.js, MongoDB" />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-[#41475b]/30">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 text-[#a5aac2] hover:text-white transition-colors font-medium">Cancel</button>
                  <button type="submit" className="bg-gradient-to-r from-[#cc97ff] to-[#9c48ea] text-[#070d1f] font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(204,151,255,0.4)] transition-all">Publish Job</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite College Modal */}
        {showInviteModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#11192e] border border-[#41475b]/30 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-6 right-6 text-[#a5aac2] hover:text-white z-10"
              >
                ✕
              </button>
              
              <div className="p-8 border-b border-[#41475b]/30">
                <h2 className="text-2xl font-bold text-white mb-2">Invite College for Drive</h2>
                <p className="text-[#a5aac2]">Select a partner college to host a drive for <span className="text-[#cc97ff] font-semibold">{selectedJob.title}</span>.</p>
              </div>
              
              <div className="p-6 bg-[#0c1326] flex-1 overflow-hidden flex flex-col">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6f758b]" />
                  <input
                    type="text"
                    placeholder="Search colleges by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#11192e] border border-[#41475b]/50 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-[#53ddfc] transition-colors"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-dark space-y-3 pr-2">
                  {filteredColleges.map(college => (
                    <div key={college._id} className="bg-[#171f36] border border-[#41475b]/20 p-4 rounded-xl flex items-center justify-between hover:border-[#53ddfc]/50 transition-colors">
                      <div>
                        <h4 className="font-bold text-[#dfe4fe]">{college.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#a5aac2] mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {college.location || "Location not set"}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInviteCollege(college._id)}
                        disabled={inviteLoading}
                        className="flex items-center gap-2 bg-[#cc97ff]/10 text-[#cc97ff] border border-[#cc97ff]/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#cc97ff] hover:text-[#070d1f] transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Invite
                      </button>
                    </div>
                  ))}
                  {filteredColleges.length === 0 && (
                    <div className="text-center py-10 text-[#a5aac2]">No colleges found matching "{searchQuery}"</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterJobs;
