import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Search, Calendar, Users, Briefcase, GraduationCap, Building } from "lucide-react";
import axios from "axios";

// Helper function to handle API calls with auth token
const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const CampusDrives = () => {
  const [drives, setDrives] = useState([]);
  const [activeDrive, setActiveDrive] = useState(null);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  const rounds = ["Applied", "Aptitude Test", "Technical Interview", "HR Round", "Offered", "Rejected"];

  useEffect(() => {
    fetchDrives();
    fetchRecruiters();
    fetchIncomingRequests();
  }, []);

  const fetchIncomingRequests = async () => {
    try {
      const res = await apiCall("get", "/college-features/drive-requests");
      setIncomingRequests(res.data);
    } catch (err) {
      console.error("Error fetching incoming requests:", err);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const res = await apiCall("put", `/college-features/drive-requests/${requestId}/accept`);
      // Drive is created automatically, fetch drives again
      fetchDrives();
      fetchIncomingRequests();
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    } finally {
      setAcceptingId(null);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const res = await apiCall("get", "/college-features/recruiters");
      setRecruiters(res.data);
    } catch (err) {
      console.error("Error fetching recruiters:", err);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await apiCall("get", "/campus-drives");
      setDrives(res.data);
      if (res.data.length > 0 && !activeDrive) {
        setActiveDrive(res.data[0]);
        fetchApplications(res.data[0]._id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching drives:", err);
      setLoading(false);
    }
  };

  const fetchApplications = async (driveId) => {
    try {
      const res = await apiCall("get", `/campus-drives/${driveId}/applications`);
      // Initialize all rounds with empty array if they don't exist
      const apps = res.data.applications;
      const initializedApps = {};
      rounds.forEach(round => {
        initializedApps[round] = apps[round] || [];
      });
      setApplications(initializedApps);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const handleDriveSelect = (drive) => {
    setActiveDrive(drive);
    fetchApplications(drive._id);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = applications[source.droppableId];
    const finishColumn = applications[destination.droppableId];

    // Moving within the same column
    if (startColumn === finishColumn) {
      const newColumn = Array.from(startColumn);
      const [movedApp] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, movedApp);

      setApplications({
        ...applications,
        [source.droppableId]: newColumn,
      });
      return;
    }

    // Moving to a different column
    const startAppList = Array.from(startColumn);
    const [movedApp] = startAppList.splice(source.index, 1);
    
    const finishAppList = Array.from(finishColumn);
    
    // Optimistic UI update
    movedApp.status = destination.droppableId;
    finishAppList.splice(destination.index, 0, movedApp);

    setApplications({
      ...applications,
      [source.droppableId]: startAppList,
      [destination.droppableId]: finishAppList,
    });

    // API Call
    try {
      await apiCall("put", `/campus-drives/${activeDrive._id}/applications/${draggableId}/status`, {
        status: destination.droppableId
      });
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert on error could be implemented here
    }
  };

  const [newDriveData, setNewDriveData] = useState({
    company: "",
    title: "",
    description: "",
    minCGPA: 0,
    recruiter: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        company: newDriveData.company,
        title: newDriveData.title,
        description: newDriveData.description,
        eligibility: { minCGPA: Number(newDriveData.minCGPA) }
      };
      if (newDriveData.recruiter) {
        payload.recruiter = newDriveData.recruiter;
      }
      const res = await apiCall("post", "/campus-drives", payload);
      setDrives([res.data, ...drives]);
      if (!activeDrive) {
        setActiveDrive(res.data);
        fetchApplications(res.data._id);
      }
      setShowCreateModal(false);
      setNewDriveData({ company: "", title: "", description: "", minCGPA: 0, recruiter: "" });
    } catch (err) {
      console.error("Error creating drive:", err);
      // Could set an error state to show in UI here
    } finally {
      setSubmitting(false);
    }
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

      <Sidebar role="college" />
      
      <main className="flex-1 ml-64 p-8 relative z-10 flex flex-col h-screen">
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
              Campus Drives
            </h1>
            <p className="text-[#aba9bf] text-sm tracking-wide">
              Manage placement workflows and track student progress.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full text-white font-semibold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Drive
          </button>
        </header>

        {/* Incoming Requests Section */}
        {incomingRequests.length > 0 && (
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Incoming Drive Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomingRequests.map(req => (
                <div key={req._id} className="bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{req.job?.title}</h3>
                      <p className="text-sm text-indigo-300">{req.job?.company}</p>
                    </div>
                    <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-500/30">
                      Invite
                    </span>
                  </div>
                  <div className="text-xs text-[#aba9bf] mb-4 space-y-1">
                    <p><strong>Recruiter:</strong> {req.recruiter?.name}</p>
                    <p><strong>Location:</strong> {req.job?.location}</p>
                    <p><strong>Type:</strong> {req.job?.jobType}</p>
                  </div>
                  <button 
                    onClick={() => handleAcceptRequest(req._id)}
                    disabled={acceptingId === req._id}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {acceptingId === req._id ? "Accepting..." : "Accept & Create Drive"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
          {/* Drives List Sidebar */}
          <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar-dark pr-2">
            {drives.map(drive => (
              <div
                key={drive._id}
                onClick={() => handleDriveSelect(drive)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
                  activeDrive?._id === drive._id
                    ? "bg-[#24233b]/80 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                    : "bg-[#121223]/60 border-white/5 hover:bg-[#1d1d33]/80 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white text-lg leading-tight">{drive.company}</h3>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md font-bold ${
                    drive.status === 'active' ? 'bg-indigo-500/20 text-indigo-300' :
                    drive.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {drive.status}
                  </span>
                </div>
                <p className="text-sm text-[#aba9bf] mb-4 truncate">{drive.title}</p>
                <div className="flex items-center gap-4 text-xs text-[#aba9bf]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {new Date(drive.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                    {drive.eligibility?.minCGPA || 0}+ CGPA
                  </div>
                </div>
              </div>
            ))}
            {drives.length === 0 && (
              <div className="text-center p-8 text-[#aba9bf] border border-dashed border-white/10 rounded-2xl">
                No drives found. Create one to get started.
              </div>
            )}
          </div>

          {/* Kanban Board Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#121223]/40 border border-white/5 rounded-3xl backdrop-blur-md p-6 overflow-hidden">
            {activeDrive ? (
              <>
                <div className="mb-6 flex justify-between items-end shrink-0">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <Building className="w-6 h-6 text-indigo-400" />
                      {activeDrive.company} - {activeDrive.title}
                    </h2>
                    <p className="text-[#aba9bf] text-sm max-w-2xl line-clamp-2">
                      {activeDrive.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {/* Placeholder for Add Student Button */}
                    <button className="px-4 py-2 bg-[#24233b] hover:bg-[#302b63] border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      Add Candidate
                    </button>
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-4 overflow-x-auto pb-4 h-full custom-scrollbar-dark items-start">
                    {rounds.map(round => (
                      <div key={round} className="w-80 shrink-0 flex flex-col h-full max-h-full">
                        <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-[#e6e3fb]">
                            {round}
                          </h3>
                          <span className="text-xs font-semibold bg-[#24233b] text-[#aba9bf] px-2 py-0.5 rounded-full">
                            {applications[round]?.length || 0}
                          </span>
                        </div>
                        
                        <Droppable droppableId={round}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 rounded-2xl p-2 transition-colors duration-200 overflow-y-auto custom-scrollbar-dark ${
                                snapshot.isDraggingOver ? "bg-[#1d1d33]/80 border border-indigo-500/30" : "bg-[#18182b]/50 border border-transparent"
                              }`}
                            >
                              {applications[round]?.map((app, index) => (
                                <Draggable key={app._id} draggableId={app._id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`mb-3 p-4 rounded-xl border backdrop-blur-md transition-all ${
                                        snapshot.isDragging
                                          ? "bg-[#24233b] border-indigo-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.2)] rotate-2 z-50"
                                          : "bg-[#1d1d33]/80 border-white/5 hover:border-white/10 hover:bg-[#24233b]"
                                      }`}
                                    >
                                      <div className="font-semibold text-[#e6e3fb] mb-1">
                                        {app.student?.firstName} {app.student?.lastName}
                                      </div>
                                      <div className="text-xs text-[#aba9bf] mb-3">
                                        {app.student?.department} • {app.student?.rollNumber}
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="bg-[#0c0c1d] px-2 py-1 rounded border border-white/5 text-indigo-300 font-mono">
                                          CGPA: {app.student?.cgpa}
                                        </span>
                                        <span className="text-[#757388]">
                                          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#aba9bf] flex-col gap-4">
                <Briefcase className="w-16 h-16 opacity-20" />
                <p>Select a drive to view the Kanban board</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Drive Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1d1d33] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Drive</h2>
            
            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#aba9bf] mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newDriveData.company}
                  onChange={(e) => setNewDriveData({...newDriveData, company: e.target.value})}
                  className="w-full bg-[#121223] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g. Google"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#aba9bf] mb-1">Drive Title</label>
                <input
                  type="text"
                  required
                  value={newDriveData.title}
                  onChange={(e) => setNewDriveData({...newDriveData, title: e.target.value})}
                  className="w-full bg-[#121223] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="e.g. Software Engineer Hiring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aba9bf] mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newDriveData.description}
                  onChange={(e) => setNewDriveData({...newDriveData, description: e.target.value})}
                  className="w-full bg-[#121223] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  placeholder="Details about the role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aba9bf] mb-1">Min CGPA Required</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={newDriveData.minCGPA}
                  onChange={(e) => setNewDriveData({...newDriveData, minCGPA: e.target.value})}
                  className="w-full bg-[#121223] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aba9bf] mb-1">Assign Recruiter (Optional)</label>
                <select
                  value={newDriveData.recruiter}
                  onChange={(e) => setNewDriveData({...newDriveData, recruiter: e.target.value})}
                  className="w-full bg-[#121223] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">-- Select Recruiter --</option>
                  {recruiters.map(r => (
                    <option key={r._id} value={r._id}>{r.name} ({r.company || "No Company"})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="px-5 py-2.5 text-[#aba9bf] hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-medium hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : "Create Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusDrives;
