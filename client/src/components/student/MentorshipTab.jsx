import React, { useState, useEffect } from "react";
import {
  Linkedin,
  Mail,
  GraduationCap,
  Users,
  Search,
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  X,
  MessageSquare,
  Building2,
} from "lucide-react";
import {
  getAlumniMentors,
  requestMentorshipSession,
  getMyMentorshipRequests,
} from "../../services/api";

const MentorshipTab = () => {
  const [activeTab, setActiveTab] = useState("find"); // "find" | "requests"
  const [alumniList, setAlumniList] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  
  // Search & Filter state
  const [companyFilter, setCompanyFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [bookingType, setBookingType] = useState("Mock Interview");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const companies = ["All", "Amazon", "Google", "Microsoft", "Uber", "Meta", "Goldman Sachs"];

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (companyFilter !== "All") params.company = companyFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await getAlumniMentors(params);
      if (res.success) {
        setAlumniList(res.alumni);
      }
    } catch (err) {
      console.error("Failed to load alumni mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await getMyMentorshipRequests();
      if (res.success) {
        setMyRequests(res.requests);
      }
    } catch (err) {
      console.error("Failed to load mentorship requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "find") {
      fetchMentors();
    } else {
      fetchRequests();
    }
  }, [activeTab, companyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !message.trim()) {
      alert("Please fill in both topic and message for your mentor.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await requestMentorshipSession(selectedAlumni._id, {
        requestType: bookingType,
        topic,
        message,
        preferredDate: preferredDate || null,
      });

      if (res.success) {
        setSuccessMsg(res.msg || "Mentorship request sent successfully!");
        setTimeout(() => {
          setSelectedAlumni(null);
          setSuccessMsg(null);
          setTopic("");
          setMessage("");
          setPreferredDate("");
        }, 2200);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit mentorship request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Alumni Mentorship Directory
          </h2>
          <p className="text-slate-500 text-sm">
            Connect with alumni working in top companies for 1-on-1 mock interviews and career advice.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab("find")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "find"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Find Mentors
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "requests"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Requests {myRequests.length > 0 && (
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">
                {myRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "find" ? (
        <>
          {/* Search & Company Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by mentor name, skill (e.g., React, System Design), or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </form>

            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {companies.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setCompanyFilter(comp)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    companyFilter === comp
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
              <p className="text-sm font-medium">Fetching verified alumni mentors...</p>
            </div>
          ) : alumniList.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Alumni Mentors Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for a different skill or clear company filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map((alumni) => (
                <div
                  key={alumni._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
                        {alumni.name?.charAt(0)}
                      </div>
                      {alumni.linkedInProfile && (
                        <a
                          href={alumni.linkedInProfile}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-200"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {alumni.name}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-sm mb-3">
                      {alumni.role} @ {alumni.company}
                    </p>

                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-4 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">
                        Batch of {alumni.batch} • {alumni.department}
                      </span>
                    </div>

                    {alumni.skills && alumni.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {alumni.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedAlumni(alumni)}
                    className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-indigo-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Request Mentorship
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* My Mentorship Requests View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">My Submitted Session Requests</h3>

          {requestsLoading ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading your requests...
            </div>
          ) : myRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">You haven't requested any mentorship sessions yet.</p>
              <button
                onClick={() => setActiveTab("find")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                Browse Mentors Directory
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-full border border-indigo-200">
                        {req.requestType}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base">{req.topic}</h4>
                    <p className="text-xs text-slate-500">
                      Mentor: <strong className="text-slate-700">{req.alumni?.name}</strong> ({req.alumni?.role} @ {req.alumni?.company})
                    </p>
                    <p className="text-xs text-slate-600 italic mt-1 bg-white p-2.5 rounded-lg border border-slate-200 max-w-xl">
                      "{req.message}"
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${
                        req.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : req.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      ● {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Session Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative border border-slate-100">
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                1-on-1 Mentorship Booking
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Request Session with {selectedAlumni.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedAlumni.role} @ {selectedAlumni.company} ({selectedAlumni.department})
              </p>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Session Type
                  </label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Mock Interview">Mock Interview (Technical / System Design)</option>
                    <option value="Domain Guidance">Domain Guidance & Career Roadmap</option>
                    <option value="Resume Review">Resume & Portfolio Review</option>
                    <option value="Career Referral">Employee Referral Query</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Topic / Key Objective
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., System Design & Coding Mock Interview for SDE-1"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Message for Mentor
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Introduce yourself, mention your target role, and what specific advice or mock practice you are seeking..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAlumni(null)}
                    className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-1/2 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Request <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipTab;
