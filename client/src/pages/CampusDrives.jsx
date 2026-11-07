import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Plus,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  CheckCircle2,
  Loader2,
  Settings2,
  Clock,
  ShieldCheck,
  BarChart3,
  Save,
} from "lucide-react";
import axios from "axios";

// ─── helpers ────────────────────────────────────────────────────────────────
const apiCall = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  return axios({ method, url: `/api${url}`, data, headers });
};

const ROUNDS = [
  "Applied",
  "Aptitude Test",
  "Technical Interview",
  "HR Round",
  "Offered",
  "Rejected",
];

const ROUND_COLORS = {
  Applied:               { header: "text-slate-300",   badge: "bg-slate-700/50 text-slate-300 border-slate-600/40",   drag: "bg-indigo-900/30 border-indigo-500/30" },
  "Aptitude Test":       { header: "text-amber-300",   badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",   drag: "bg-amber-900/20 border-amber-500/30" },
  "Technical Interview": { header: "text-violet-300",  badge: "bg-violet-500/15 text-violet-300 border-violet-500/30", drag: "bg-violet-900/20 border-violet-500/30" },
  "HR Round":            { header: "text-sky-300",     badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",         drag: "bg-sky-900/20 border-sky-500/30" },
  Offered:               { header: "text-emerald-300", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", drag: "bg-emerald-900/20 border-emerald-500/30" },
  Rejected:              { header: "text-rose-300",    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",       drag: "bg-rose-900/20 border-rose-500/30" },
};

const STATUS_CFG = {
  upcoming:  { label: "Upcoming",  cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  active:    { label: "Active",    cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  completed: { label: "Completed", cls: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

// ─── component ───────────────────────────────────────────────────────────────
const CampusDrives = () => {
  const [drives, setDrives]             = useState([]);
  const [activeDrive, setActiveDrive]   = useState(null);
  const [applications, setApplications] = useState({});
  const [loading, setLoading]           = useState(true);
  const [showPanel, setShowPanel]       = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [recruiters, setRecruiters]     = useState([]);
  const [incomingReqs, setIncomingReqs] = useState([]);
  const [acceptingId, setAcceptingId]   = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [formData, setFormData]         = useState({ company: "", title: "", description: "", minCGPA: 0, recruiter: "" });

  // Assessment Settings modal
  const [showAssessModal, setShowAssessModal] = useState(false);
  const [assessSaving, setAssessSaving]       = useState(false);
  const [assessForm, setAssessForm] = useState({
    questionCount:           10,
    durationMinutes:         20,
    passingCutoffPercentage: 60,
    proctoringStrictness:    "standard",
  });

  const boardRef = useRef(null);
  const colRefs  = useRef({});

  const scrollBoard = (dir) =>
    boardRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });

  const scrollToRound = (r) =>
    colRefs.current[r]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

  useEffect(() => {
    fetchDrives();
    fetchRecruiters();
    fetchIncomingReqs();
  }, []);

  // ── incoming requests ──
  const fetchIncomingReqs = async () => {
    try {
      const res = await apiCall("get", "/college-features/drive-requests");
      setIncomingReqs(res.data);
    } catch (e) { console.error(e); }
  };

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      await apiCall("put", `/college-features/drive-requests/${id}/accept`);
      fetchDrives();
      fetchIncomingReqs();
    } catch (e) { console.error(e); alert("Failed to accept."); }
    finally { setAcceptingId(null); }
  };

  const fetchRecruiters = async () => {
    try {
      const res = await apiCall("get", "/college-features/recruiters");
      setRecruiters(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchDrives = async () => {
    try {
      const res = await apiCall("get", "/campus-drives");
      setDrives(res.data);
      if (res.data.length > 0 && !activeDrive) {
        setActiveDrive(res.data[0]);
        await fetchApplications(res.data[0]._id);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchApplications = async (driveId) => {
    try {
      const res = await apiCall("get", `/campus-drives/${driveId}/applications`);
      const apps = res.data.applications;
      const init = {};
      ROUNDS.forEach(r => (init[r] = apps[r] || []));
      setApplications(init);
    } catch (e) { console.error(e); }
  };

  const handleSelectDrive = (drive) => {
    setActiveDrive(drive);
    fetchApplications(drive._id);
  };

  // ── drag & drop ──
  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const srcCol  = Array.from(applications[source.droppableId]);
    const dstCol  = source.droppableId === destination.droppableId
      ? srcCol
      : Array.from(applications[destination.droppableId]);
    const [moved] = srcCol.splice(source.index, 1);
    moved.status  = destination.droppableId;
    dstCol.splice(destination.index, 0, moved);

    setApplications(prev => ({
      ...prev,
      [source.droppableId]:      srcCol,
      [destination.droppableId]: dstCol,
    }));

    try {
      await apiCall("put", `/campus-drives/${activeDrive._id}/applications/${draggableId}/status`, {
        status: destination.droppableId,
      });
    } catch (e) { console.error(e); }
  };

  // ── assessment settings ──
  const openAssessModal = () => {
    const s = activeDrive?.assessmentSettings || {};
    setAssessForm({
      questionCount:           s.questionCount           ?? 10,
      durationMinutes:         s.durationMinutes         ?? 20,
      passingCutoffPercentage: s.passingCutoffPercentage ?? 60,
      proctoringStrictness:    s.proctoringStrictness    ?? "standard",
    });
    setShowAssessModal(true);
  };

  const handleSaveAssess = async (e) => {
    e.preventDefault();
    if (!activeDrive) return;
    setAssessSaving(true);
    try {
      const res = await apiCall("put", `/campus-drives/${activeDrive._id}/assessment-settings`, assessForm);
      setActiveDrive(prev => ({ ...prev, assessmentSettings: res.data.assessmentSettings }));
      setDrives(prev => prev.map(d => d._id === activeDrive._id ? { ...d, assessmentSettings: res.data.assessmentSettings } : d));
      setShowAssessModal(false);
    } catch (e) { console.error(e); alert("Failed to save assessment settings."); }
    finally { setAssessSaving(false); }
  };

  // ── create drive ──
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        company:     formData.company,
        title:       formData.title,
        description: formData.description,
        eligibility: { minCGPA: Number(formData.minCGPA) },
        ...(formData.recruiter ? { recruiter: formData.recruiter } : {}),
      };
      const res = await apiCall("post", "/campus-drives", payload);
      const next = [res.data, ...drives];
      setDrives(next);
      if (!activeDrive) { setActiveDrive(res.data); fetchApplications(res.data._id); }
      setShowModal(false);
      setFormData({ company: "", title: "", description: "", minCGPA: 0, recruiter: "" });
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a16] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading campus drives&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a16] font-sans text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <Sidebar role="college" />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden relative z-10">

        {/* ── Page Header ── */}
        <div className="px-6 pt-6 pb-4 shrink-0 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Campus Drives</h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage placement workflows and track student progress</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Drive
            </button>
          </div>
        </div>

        {/* ── Incoming Requests Banner ── */}
        {incomingReqs.length > 0 && (
          <div className="px-6 py-3 shrink-0">
            <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-2xl p-4">
              <h2 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Incoming Drive Requests ({incomingReqs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {incomingReqs.map(req => (
                  <div key={req._id} className="bg-[#16162a] border border-white/8 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white text-sm">{req.job?.title}</p>
                        <p className="text-xs text-indigo-300">{req.job?.company}</p>
                      </div>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-bold uppercase">Invite</span>
                    </div>
                    <p className="text-xs text-slate-400">By {req.recruiter?.name} &middot; {req.job?.location}</p>
                    <button
                      onClick={() => handleAccept(req._id)}
                      disabled={acceptingId === req._id}
                      className="mt-1 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {acceptingId === req._id
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Accepting&hellip;</>
                        : <><CheckCircle2 className="w-3.5 h-3.5" /> Accept &amp; Create Drive</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Two-Panel Area ── */}
        <div className="flex flex-1 gap-4 px-6 pb-6 pt-4 min-h-0 overflow-hidden">

          {/* LEFT PANEL — Drives List */}
          {showPanel && (
            <div className="w-[260px] shrink-0 flex flex-col bg-[#11111f] border border-white/6 rounded-2xl overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-white/6 shrink-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Active Drives</span>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-1 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
                    title="Collapse panel"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  {drives.length} drive{drives.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar-dark">
                {drives.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <Briefcase className="w-10 h-10 text-slate-700 mb-3" />
                    <p className="text-slate-500 text-xs">No drives yet.</p>
                    <p className="text-slate-600 text-[11px] mt-1">Create one to get started.</p>
                  </div>
                )}
                {drives.map(drive => {
                  const sc = STATUS_CFG[drive.status] || STATUS_CFG.upcoming;
                  const isActive = activeDrive?._id === drive._id;
                  return (
                    <button
                      key={drive._id}
                      onClick={() => handleSelectDrive(drive)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-[#1e1b38] border-violet-500/40 shadow-lg shadow-violet-500/10"
                          : "bg-[#16162a] border-white/5 hover:bg-[#1c1c30] hover:border-white/10"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-gradient-to-b from-violet-500 to-indigo-500 rounded-r-full" />
                      )}
                      <div className="flex items-start justify-between gap-2 mb-1.5 pl-1">
                        <p className="font-bold text-white text-sm leading-tight">{drive.company}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase shrink-0 ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-2.5 pl-1">{drive.title}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pl-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {fmtDate(drive.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {drive.eligibility?.minCGPA || 0}+ CGPA
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT PANEL — Kanban Board */}
          <div className="flex-1 flex flex-col bg-[#11111f] border border-white/6 rounded-2xl overflow-hidden min-w-0">
            {activeDrive ? (
              <>
                {/* Board Top Bar */}
                <div className="px-5 py-3.5 border-b border-white/6 shrink-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {!showPanel && (
                      <button
                        onClick={() => setShowPanel(true)}
                        className="p-1.5 rounded-lg border border-white/8 hover:bg-white/8 text-slate-400 hover:text-white transition-colors shrink-0"
                        title="Show drives panel"
                      >
                        <PanelLeftOpen className="w-4 h-4" />
                      </button>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-lg">
                      {activeDrive.company?.[0]?.toUpperCase() || "D"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-white text-sm leading-tight truncate">
                        {activeDrive.company} &mdash; {activeDrive.title}
                      </h2>
                      {activeDrive.description && (
                        <p className="text-[11px] text-slate-500 truncate max-w-sm">{activeDrive.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {showPanel && (
                      <button
                        onClick={() => setShowPanel(false)}
                        className="px-3 py-1.5 rounded-xl border border-white/8 hover:bg-white/8 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Wide View
                      </button>
                    )}
                    <button
                      onClick={openAssessModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all active:scale-95"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Assessment Settings
                    </button>
                    <Link
                      to="/college/shortlist"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-500/20 active:scale-95"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Add / Shortlist Students
                    </Link>
                  </div>

                </div>

                {/* Stage Quick-Nav */}
                <div className="px-5 py-2.5 border-b border-white/5 shrink-0 flex items-center gap-2">
                  <button onClick={() => scrollBoard("left")} className="p-1 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-0.5">
                    {ROUNDS.map(r => {
                      const c = ROUND_COLORS[r];
                      const count = applications[r]?.length || 0;
                      return (
                        <button
                          key={r}
                          onClick={() => scrollToRound(r)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap transition-all hover:opacity-80 ${c.badge}`}
                        >
                          {r}
                          <span className="bg-white/10 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => scrollBoard("right")} className="p-1 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <div
                    ref={boardRef}
                    className="flex flex-1 gap-3 overflow-x-auto px-4 py-4 custom-scrollbar-dark items-start scroll-smooth"
                    style={{ minHeight: 0 }}
                  >
                    {ROUNDS.map(round => {
                      const c = ROUND_COLORS[round];
                      const cards = applications[round] || [];
                      return (
                        <div
                          key={round}
                          ref={el => (colRefs.current[round] = el)}
                          className="w-[256px] shrink-0 flex flex-col"
                          style={{ minHeight: "100%" }}
                        >
                          <div className="flex items-center justify-between mb-2.5 px-1">
                            <h3 className={`text-[11px] font-black uppercase tracking-widest ${c.header}`}>{round}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>{cards.length}</span>
                          </div>

                          <Droppable droppableId={round}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 rounded-xl p-2 transition-all duration-200 overflow-y-auto custom-scrollbar-dark border ${
                                  snapshot.isDraggingOver
                                    ? `${c.drag} shadow-inner`
                                    : "bg-[#0f0f1d]/60 border-white/5"
                                }`}
                                style={{ minHeight: 220 }}
                              >
                                {cards.length === 0 && !snapshot.isDraggingOver && (
                                  <div className="h-24 flex flex-col items-center justify-center border border-dashed border-white/8 rounded-lg text-center">
                                    <p className="text-slate-500 text-[11px] font-medium">Empty stage</p>
                                    <p className="text-slate-600 text-[10px] mt-0.5">Drag cards here</p>
                                  </div>
                                )}

                                {cards.map((app, idx) => (
                                  <Draggable key={app._id} draggableId={app._id} index={idx}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`mb-2.5 p-3.5 rounded-xl border transition-all duration-150 select-none ${
                                          snapshot.isDragging
                                            ? "bg-[#1e1b38] border-violet-500/50 shadow-2xl shadow-black/60 rotate-1 scale-105 z-50"
                                            : "bg-[#16162a] border-white/6 hover:border-white/12 hover:bg-[#1c1c30] cursor-grab"
                                        }`}
                                      >
                                        <p className="font-bold text-white text-sm leading-tight mb-0.5">
                                          {app.student?.firstName} {app.student?.lastName}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mb-3 truncate">
                                          {app.student?.department} &middot; {app.student?.rollNumber || "\u2014"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg">
                                            {app.student?.cgpa}
                                          </span>
                                          <span className="text-[11px] text-slate-600 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {fmtDate(app.appliedAt)}
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
                      );
                    })}
                  </div>
                </DragDropContext>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <p className="text-white font-semibold">No drive selected</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {drives.length > 0
                      ? "Select a drive from the left panel."
                      : "Create your first campus drive to get started."}
                  </p>
                </div>
                {drives.length === 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Drive
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Assessment Settings Modal ── */}
      {showAssessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#14142a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl shadow-black/60">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Settings2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Assessment Settings</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">{activeDrive?.company} — {activeDrive?.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssessModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAssess} className="px-6 py-5 space-y-5">
              {/* Row 1: Questions & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                    <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                    Number of Questions
                  </label>
                  <input
                    type="number" min="5" max="50" required
                    value={assessForm.questionCount}
                    onChange={e => setAssessForm({ ...assessForm, questionCount: Number(e.target.value) })}
                    className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
                  />
                  <p className="text-[10px] text-slate-600 mt-1">Recommended: 10–20 questions</p>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number" min="5" max="120" required
                    value={assessForm.durationMinutes}
                    onChange={e => setAssessForm({ ...assessForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
                  />
                  <p className="text-[10px] text-slate-600 mt-1">Recommended: 20–45 min</p>
                </div>
              </div>

              {/* Passing Cutoff */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Passing Cutoff — <span className="text-emerald-300 font-bold ml-1">{assessForm.passingCutoffPercentage}%</span>
                </label>
                <input
                  type="range" min="30" max="90" step="5"
                  value={assessForm.passingCutoffPercentage}
                  onChange={e => setAssessForm({ ...assessForm, passingCutoffPercentage: Number(e.target.value) })}
                  className="w-full h-2 rounded-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>30% (lenient)</span><span>60% (standard)</span><span>90% (strict)</span>
                </div>
              </div>

              {/* Proctoring Strictness */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Proctoring Strictness
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "standard", label: "Standard",  desc: "Up to 3 tab switches allowed",     color: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
                    { val: "strict",   label: "Strict",    desc: "Max 1 tab switch, strict face ID",  color: "border-rose-500/40 bg-rose-500/10 text-rose-300" },
                  ].map(({ val, label, desc, color }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAssessForm({ ...assessForm, proctoringStrictness: val })}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                        assessForm.proctoringStrictness === val
                          ? color + " shadow-md"
                          : "border-white/8 bg-white/3 text-slate-400 hover:border-white/15"
                      }`}
                    >
                      <div className="font-bold text-sm mb-0.5">{label}</div>
                      <div className="text-[10px] opacity-80">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info callout */}
              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl px-4 py-3 text-[11px] text-indigo-300">
                ⚡ Settings apply to the next aptitude test session for this drive. Existing submitted tests are unaffected.
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAssessModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/8 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assessSaving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {assessSaving
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                    : <><Save className="w-4 h-4" />Save Settings</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#14142a] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl shadow-black/60">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create New Drive</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {[
                { label: "Company Name", key: "company", placeholder: "e.g. Google",           type: "text" },
                { label: "Drive Title",  key: "title",   placeholder: "e.g. SDE Hiring 2025",  type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about the role and responsibilities&hellip;"
                  className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Min CGPA Required</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.minCGPA}
                  onChange={e => setFormData({ ...formData, minCGPA: e.target.value })}
                  className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Assign Recruiter <span className="text-slate-600 font-normal">(optional)</span>
                </label>
                <select
                  value={formData.recruiter}
                  onChange={e => setFormData({ ...formData, recruiter: e.target.value })}
                  className="w-full bg-[#0f0f22] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition appearance-none"
                >
                  <option value="">&mdash; Select recruiter &mdash;</option>
                  {recruiters.map(r => (
                    <option key={r._id} value={r._id}>{r.name} ({r.company || "No company"})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/8 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold transition shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating&hellip;</>
                    : "Create Drive"}
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
