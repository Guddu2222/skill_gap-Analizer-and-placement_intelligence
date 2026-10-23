import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Users,
  Briefcase,
  Building,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  X,
  Sparkles,
  ExternalLink,
  Sliders,
  Check,
} from "lucide-react";
import axios from "axios";
import { updateApplicationEvaluation } from "../services/api";

const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const ROUND_COLORS = {
  "Technical Interview": {
    badge: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    header: "border-violet-500/30 bg-violet-950/20",
    dot: "bg-violet-400",
  },
  "HR Round": {
    badge: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    header: "border-sky-500/30 bg-sky-950/20",
    dot: "bg-sky-400",
  },
  Offered: {
    badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    header: "border-emerald-500/30 bg-emerald-950/20",
    dot: "bg-emerald-400",
  },
  Rejected: {
    badge: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    header: "border-rose-500/30 bg-rose-950/20",
    dot: "bg-rose-400",
  },
};

const RecruiterDrives = () => {
  const [drives, setDrives] = useState([]);
  const [activeDrive, setActiveDrive] = useState(null);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  // Evaluation modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalForm, setEvalForm] = useState({
    status: "Technical Interview",
    technical: 3,
    problemSolving: 3,
    systemDesign: 3,
    communication: 3,
    feedback: "",
    ctc: "",
    designation: "",
    joiningDate: "",
    offerNotes: "",
  });

  const rounds = ["Technical Interview", "HR Round", "Offered", "Rejected"];

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await apiCall("get", "/recruiter-features/drives");
      setDrives(res.data);
      if (res.data.length > 0 && !activeDrive) {
        setActiveDrive(res.data[0]);
        fetchApplications(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching recruiter drives:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (driveId) => {
    try {
      const res = await apiCall(
        "get",
        `/recruiter-features/drives/${driveId}/applications`
      );
      const apps = res.data;
      const initializedApps = {};
      rounds.forEach((round) => {
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

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
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
      [destination.droppableId]: destItems,
    });

    try {
      await apiCall(
        "put",
        `/recruiter-features/drives/${activeDrive._id}/applications/${draggableId}/status`,
        {
          status: destination.droppableId,
        }
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      fetchApplications(activeDrive._id);
    }
  };

  // Open scorecard modal
  const openEvaluationModal = (app) => {
    setSelectedApp(app);
    const sc = app.interviewScorecard || {};
    const od = app.offerDetails || {};

    setEvalForm({
      status: app.status || "Technical Interview",
      technical: sc.technical || 3,
      problemSolving: sc.problemSolving || 3,
      systemDesign: sc.systemDesign || 3,
      communication: sc.communication || 3,
      feedback: sc.feedback || "",
      ctc: od.ctc || activeDrive?.eligibility?.salary || "12 LPA",
      designation: od.designation || activeDrive?.title || "Software Engineer",
      joiningDate: od.joiningDate
        ? new Date(od.joiningDate).toISOString().split("T")[0]
        : "",
      offerNotes: od.notes || "",
    });
  };

  // Save scorecard & evaluation
  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedApp || !activeDrive) return;

    setEvalLoading(true);
    try {
      const payload = {
        status: evalForm.status,
        interviewScorecard: {
          technical: Number(evalForm.technical),
          problemSolving: Number(evalForm.problemSolving),
          systemDesign: Number(evalForm.systemDesign),
          communication: Number(evalForm.communication),
          feedback: evalForm.feedback,
          evaluator: "Lead Technical Evaluator",
        },
        offerDetails: {
          ctc: evalForm.ctc,
          designation: evalForm.designation,
          joiningDate: evalForm.joiningDate ? new Date(evalForm.joiningDate) : null,
          notes: evalForm.offerNotes,
        },
      };

      await updateApplicationEvaluation(
        activeDrive._id,
        selectedApp._id,
        payload
      );

      // Re-fetch applications
      await fetchApplications(activeDrive._id);
      setSelectedApp(null);
    } catch (err) {
      console.error("Error saving evaluation:", err);
      alert("Failed to save evaluation.");
    } finally {
      setEvalLoading(false);
    }
  };

  // Computed average score for modal
  const currentAvgScore = (
    (Number(evalForm.technical) +
      Number(evalForm.problemSolving) +
      Number(evalForm.systemDesign) +
      Number(evalForm.communication)) /
    4
  ).toFixed(1);

  if (loading) {
    return (
      <div className="flex bg-[#0c0c1d] min-h-screen font-sans items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0c0c1d] font-sans text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-cyan-600/8 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar role="recruiter" />

      <main className="flex-1 ml-64 p-8 h-screen flex flex-col relative z-10">
        <header className="mb-6 border-b border-white/8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Assigned Campus Drives
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                  Live ATS & Scorecards
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Evaluate candidates across Technical Interview, HR Round, and roll out formal offers with scorecards.
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Drives List Panel (Left) */}
          <div className="w-72 bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-3xl p-5 flex flex-col shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Active Drives ({drives.length})
            </h2>
            <div className="overflow-y-auto custom-scrollbar-dark flex-1 pr-1 space-y-2.5">
              {drives.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-10">
                  No drives assigned yet. Accepted drive requests from partner colleges will appear here.
                </div>
              ) : (
                drives.map((drive) => {
                  const isSelected = activeDrive?._id === drive._id;
                  return (
                    <div
                      key={drive._id}
                      onClick={() => handleDriveSelect(drive)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? "bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-600/10"
                          : "bg-[#121226] border-white/5 hover:border-white/10 hover:bg-[#1a1a36]"
                      }`}
                    >
                      <h3 className="font-bold text-white text-sm mb-1 truncate">
                        {drive.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{drive.college?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Min CGPA: {drive.eligibility?.minCGPA || 0}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-violet-400" : "text-slate-600"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Kanban Board (Right) */}
          <div className="flex-1 bg-[rgba(20,20,38,0.7)] backdrop-blur-xl border border-white/8 rounded-3xl p-5 flex flex-col min-w-0 shadow-xl">
            {activeDrive ? (
              <>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/8">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      {activeDrive.title}
                      <span className="text-xs text-slate-400 font-normal">
                        ({activeDrive.college?.name})
                      </span>
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Drag candidates between rounds or click any candidate card to enter technical rubric scores.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      Total Pipeline:{" "}
                      <strong className="text-white">
                        {Object.values(applications).reduce(
                          (sum, arr) => sum + (arr?.length || 0),
                          0
                        )}
                      </strong>
                    </span>
                  </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-4 overflow-x-auto pb-3 h-full custom-scrollbar-dark snap-x">
                    {rounds.map((round) => {
                      const cfg = ROUND_COLORS[round] || ROUND_COLORS["Technical Interview"];
                      const items = applications[round] || [];

                      return (
                        <div
                          key={round}
                          className="flex flex-col min-w-[300px] w-[300px] bg-[#121226]/80 rounded-2xl border border-white/8 snap-start shadow-md"
                        >
                          <div
                            className={`p-3.5 border-b rounded-t-2xl flex justify-between items-center ${cfg.header}`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}
                              />
                              <h3 className="font-bold text-sm text-white">
                                {round}
                              </h3>
                            </div>
                            <span
                              className={`text-xs py-0.5 px-2 rounded-full font-bold border ${cfg.badge}`}
                            >
                              {items.length}
                            </span>
                          </div>

                          <Droppable droppableId={round}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`flex-1 p-3 overflow-y-auto custom-scrollbar-dark transition-colors duration-200 space-y-3 ${
                                  snapshot.isDraggingOver
                                    ? "bg-violet-500/5"
                                    : ""
                                }`}
                              >
                                {items.map((app, index) => {
                                  const sc = app.interviewScorecard;
                                  const hasScorecard =
                                    sc &&
                                    (sc.technical > 0 ||
                                      sc.problemSolving > 0 ||
                                      sc.feedback);
                                  const avgScore = hasScorecard
                                    ? (
                                        (sc.technical +
                                          sc.problemSolving +
                                          sc.systemDesign +
                                          sc.communication) /
                                        4
                                      ).toFixed(1)
                                    : null;

                                  return (
                                    <Draggable
                                      key={app._id}
                                      draggableId={app._id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          onClick={() =>
                                            openEvaluationModal(app)
                                          }
                                          className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                                            snapshot.isDragging
                                              ? "bg-[#1f1f3a] border-violet-500/60 shadow-2xl rotate-2 z-50 scale-105"
                                              : "bg-[#17172f]/80 border-white/8 hover:border-violet-500/40 hover:bg-[#1e1e3b]"
                                          }`}
                                        >
                                          <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div className="font-bold text-sm text-white truncate">
                                              {app.student?.firstName}{" "}
                                              {app.student?.lastName}
                                            </div>
                                            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                                              {app.student?.cgpa} CGPA
                                            </span>
                                          </div>

                                          <div className="text-xs text-slate-400 mb-2.5">
                                            {app.student?.department}
                                          </div>

                                          {/* Skills snippet */}
                                          {app.student?.skills &&
                                            app.student.skills.length > 0 && (
                                              <div className="flex flex-wrap gap-1 mb-3">
                                                {app.student.skills
                                                  .slice(0, 3)
                                                  .map((sk, i) => (
                                                    <span
                                                      key={i}
                                                      className="text-[10px] bg-white/5 border border-white/8 text-slate-300 px-1.5 py-0.5 rounded"
                                                    >
                                                      {typeof sk === "string"
                                                        ? sk
                                                        : sk.skillName}
                                                    </span>
                                                  ))}
                                              </div>
                                            )}

                                          {/* Scorecard badge if evaluated */}
                                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                                            {hasScorecard ? (
                                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                                <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                                                Score: {avgScore}/5
                                              </span>
                                            ) : (
                                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                <Sliders className="w-3 h-3" />
                                                Click to Evaluate
                                              </span>
                                            )}

                                            {app.offerDetails?.ctc && (
                                              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                                {app.offerDetails.ctc}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                    })}
                  </div>
                </DragDropContext>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-3">
                <Users className="w-14 h-14 opacity-25" />
                <p className="text-sm">Select an active drive to view candidate pipeline</p>
              </div>
            )}
          </div>
        </div>

        {/* Evaluation & Scorecard Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-[#121226] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar-dark p-7 relative shadow-2xl">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Candidate Info Header */}
              <div className="flex items-start gap-4 mb-6 pb-5 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                  {selectedApp.student?.firstName
                    ? selectedApp.student.firstName.charAt(0)
                    : "C"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedApp.student?.firstName}{" "}
                    {selectedApp.student?.lastName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedApp.student?.email} • {selectedApp.student?.department} •{" "}
                    <span className="text-amber-400 font-semibold">
                      CGPA {selectedApp.student?.cgpa}
                    </span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-6">
                {/* Round Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Stage / Decision
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {rounds.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEvalForm({ ...evalForm, status: r })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          evalForm.status === r
                            ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30"
                            : "bg-[#0a0a16] border-white/8 text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scorecard Rubrics */}
                <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/8">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Interview Rubrics (1 - 5 Points)
                    </h3>
                    <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      Average: {currentAvgScore} / 5.0
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Technical Depth & Core Skills</span>
                        <span className="font-bold text-violet-400">
                          {evalForm.technical}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={evalForm.technical}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            technical: e.target.value,
                          })
                        }
                        className="w-full accent-violet-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Problem Solving & Algorithms</span>
                        <span className="font-bold text-violet-400">
                          {evalForm.problemSolving}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={evalForm.problemSolving}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            problemSolving: e.target.value,
                          })
                        }
                        className="w-full accent-violet-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>System Architecture & Code Quality</span>
                        <span className="font-bold text-violet-400">
                          {evalForm.systemDesign}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={evalForm.systemDesign}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            systemDesign: e.target.value,
                          })
                        }
                        className="w-full accent-violet-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Communication & Team Fit</span>
                        <span className="font-bold text-violet-400">
                          {evalForm.communication}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={evalForm.communication}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            communication: e.target.value,
                          })
                        }
                        className="w-full accent-violet-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Interview Notes / Feedback */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                    Interviewer Feedback & Observations
                  </label>
                  <textarea
                    rows="3"
                    value={evalForm.feedback}
                    onChange={(e) =>
                      setEvalForm({ ...evalForm, feedback: e.target.value })
                    }
                    placeholder="Enter technical observations, coding test performance, areas of strength, and hiring recommendations..."
                    className="w-full bg-[#0a0a16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Offer Details (Visible always, highlighted if Offered) */}
                <div
                  className={`border rounded-2xl p-5 space-y-3 transition-colors ${
                    evalForm.status === "Offered"
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : "bg-[#0a0a16] border-white/8 opacity-80"
                  }`}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Offer Package & Placement Terms
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        CTC / Package
                      </label>
                      <input
                        type="text"
                        value={evalForm.ctc}
                        onChange={(e) =>
                          setEvalForm({ ...evalForm, ctc: e.target.value })
                        }
                        placeholder="e.g. 14 LPA"
                        className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={evalForm.designation}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            designation: e.target.value,
                          })
                        }
                        placeholder="e.g. Software Engineer"
                        className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={evalForm.joiningDate}
                        onChange={(e) =>
                          setEvalForm({
                            ...evalForm,
                            joiningDate: e.target.value,
                          })
                        }
                        className="w-full bg-[#121226] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={evalLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    {evalLoading ? "Saving..." : "Save Evaluation & Update Candidate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDrives;
