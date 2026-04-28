import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Users, Briefcase, Building, ChevronRight } from "lucide-react";
import axios from "axios";

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const RecruiterDrives = () => {
  const [drives, setDrives] = useState([]);
  const [activeDrive, setActiveDrive] = useState(null);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  // Recruiter only sees these advanced rounds
  const rounds = ["Technical Interview", "HR Round", "Offered", "Rejected"];

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await apiCall("get", "/recruiter-features/drives");
      setDrives(res.data);
      if (res.data.length > 0 && !activeDrive) {
        setActiveDrive(res.data[0]);
        fetchApplications(res.data[0]._id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recruiter drives:", err);
      setLoading(false);
    }
  };

  const fetchApplications = async (driveId) => {
    try {
      const res = await apiCall("get", `/recruiter-features/drives/${driveId}/applications`);
      const apps = res.data;
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
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = applications[source.droppableId];
    const destColumn = applications[destination.droppableId];
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];
    
    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destination.droppableId;
    destItems.splice(destination.index, 0, movedItem);

    setApplications({
      ...applications,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems
    });

    try {
      await apiCall("put", `/recruiter-features/drives/${activeDrive._id}/applications/${draggableId}/status`, {
        status: destination.droppableId
      });
    } catch (err) {
      console.error("Error updating application status:", err);
      fetchApplications(activeDrive._id);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-[#0c0c1d] min-h-screen font-sans items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0c0c1d] font-sans text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 h-screen flex flex-col relative z-10">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Briefcase className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Assigned Drives</h1>
              <p className="text-[#aba9bf] text-sm mt-1">Manage shortlisted candidates from your partner colleges.</p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 gap-6 min-h-0">
          <div className="w-80 bg-[#121223]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col">
            <h2 className="text-lg font-bold mb-4 px-2 text-white">Your Drives</h2>
            <div className="overflow-y-auto custom-scrollbar-dark flex-1 pr-2 space-y-3">
              {drives.length === 0 ? (
                <div className="text-center text-[#aba9bf] text-sm mt-10">No drives assigned to you yet.</div>
              ) : drives.map(drive => (
                <div 
                  key={drive._id}
                  onClick={() => handleDriveSelect(drive)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    activeDrive?._id === drive._id 
                      ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                      : 'bg-[#1d1d33]/50 border-white/5 hover:border-white/10 hover:bg-[#24233b]/80'
                  }`}
                >
                  <h3 className="font-bold text-white text-base mb-1 truncate">{drive.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#aba9bf] mb-2">
                    <Building className="w-4 h-4" />
                    <span className="truncate">{drive.college?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#757388]">Min CGPA: {drive.eligibility?.minCGPA}</span>
                    <ChevronRight className={`w-4 h-4 ${activeDrive?._id === drive._id ? 'text-blue-400' : 'text-[#757388]'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#121223]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col min-w-0">
            {activeDrive ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{activeDrive.title}</h2>
                    <p className="text-[#aba9bf] text-sm mt-1">Shortlisted candidates pipeline</p>
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-4 overflow-x-auto pb-4 h-full custom-scrollbar-dark snap-x">
                    {rounds.map((round) => (
                      <div key={round} className="flex flex-col min-w-[320px] w-[320px] bg-[#1d1d33]/60 rounded-2xl border border-white/5 snap-start">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#24233b]/40 rounded-t-2xl">
                          <h3 className="font-semibold text-[#e6e3fb]">{round}</h3>
                          <span className="bg-[#0c0c1d] text-[#aba9bf] text-xs py-1 px-2.5 rounded-full font-medium border border-white/10">
                            {applications[round]?.length || 0}
                          </span>
                        </div>
                        
                        <Droppable droppableId={round}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`flex-1 p-3 overflow-y-auto custom-scrollbar-dark transition-colors duration-200 ${
                                snapshot.isDraggingOver ? 'bg-blue-500/5' : ''
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
                                          ? "bg-[#24233b] border-blue-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.2)] rotate-2 z-50"
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
                                        <span className="bg-[#0c0c1d] px-2 py-1 rounded border border-white/5 text-blue-300 font-mono">
                                          CGPA: {app.student?.cgpa}
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
                <Users className="w-16 h-16 opacity-20" />
                <p>Select a drive to view the Kanban board</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDrives;
