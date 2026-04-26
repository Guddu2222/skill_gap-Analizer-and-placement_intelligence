import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Play,
  ExternalLink,
  Target,
  Map as MapIcon,
  List,
  Lock,
  ArrowLeft,
  BrainCircuit,
} from "lucide-react";
import api from "../../services/api"; // Use our api utility instance configured with intercepts
import MilestoneQuizModal from "./MilestoneQuizModal";

const LearningPathTracker = ({ learningPaths, student, onUpdate, onTabChange }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [viewMode, setViewMode] = useState("roadmap");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: "bg-slate-800 text-slate-400 border border-slate-700",
      in_progress: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
      completed: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      abandoned: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    };
    return colors[status] || colors.not_started;
  };

  const updateProgress = async (pathId, progress) => {
    setUpdatingProgress(true);
    try {
      const response = await api.patch(`/skill-gap/learning-paths/${pathId}/progress`, {
        progress,
      });
      if (response.data.skillAddedToProfile) {
        showToast(`🎉 Congratulations! ${selectedPath?.skillName || 'Skill'} has been verified and added to your profile.`);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const toggleMilestone = async (pathId, milestoneIndex, completed) => {
    try {
      const response = await api.patch(
        `/skill-gap/learning-paths/${pathId}/progress`,
        {
          milestoneIndex,
          completed,
        }
      );

      // Update local state with the backend-calculated progress
      if (
        selectedPath &&
        selectedPath._id === pathId &&
        response.data.learningPath
      ) {
        setSelectedPath(response.data.learningPath);
      }

      if (response.data.skillAddedToProfile) {
        showToast(`🎉 Congratulations! ${selectedPath?.skillName || 'Skill'} has been verified and added to your profile.`);
      }

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleReschedulePath = async (pathId) => {
    try {
      const response = await api.post(
        `/skill-gap/learning-paths/${pathId}/reschedule`
      );
      if (
        selectedPath &&
        selectedPath._id === pathId &&
        response.data.learningPath
      ) {
        setSelectedPath(response.data.learningPath);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error rescheduling path:", error);
    }
  };

  const LearningPathCard = ({ path, isLocked }) => (
    <div
      className={`glass-card rounded-xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 relative ${
        isLocked ? "opacity-50 grayscale-[50%] pointer-events-none" : "cursor-pointer"
      }`}
      onClick={() => {
        if (!isLocked) setSelectedPath(path);
      }}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
          <div className="bg-slate-800 p-2 rounded-full shadow-xl text-slate-500 border border-slate-700">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              path.status === "completed"
                ? "bg-emerald-500/10"
                : path.status === "in_progress"
                ? "bg-indigo-500/10"
                : "bg-slate-800"
            }`}
          >
            <BookOpen
              className={`w-6 h-6 ${
                path.status === "completed"
                  ? "text-emerald-400"
                  : path.status === "in_progress"
                  ? "text-indigo-400"
                  : "text-slate-400"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {path.skillName}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Level: <span className="text-indigo-300 capitalize">{path.currentLevel || "none"}</span> → <span className="text-emerald-300 capitalize">{path.targetLevel}</span>
            </p>
          </div>
        </div>
        {!isLocked && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              path.status
            )}`}
          >
            {path.status.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Progress
          </span>
          <span className="text-sm font-black text-white">
            {path.progressPercentage}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              path.status === "completed"
                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                : path.status === "in_progress"
                ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "bg-slate-600"
            }`}
            style={{ width: `${path.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones Preview */}
      <div className="flex items-center space-x-2 mb-4">
        {path.milestones?.slice(0, 4).map((milestone, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              milestone.completed
                ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {milestone.completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-xs font-bold">{index + 1}</span>
            )}
          </div>
        ))}
        {path.milestones?.length > 4 && (
          <span className="text-xs text-gray-500 font-medium">
            +{path.milestones.length - 4} more
          </span>
        )}
      </div>

      {/* Resources Count */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
          {path.learningResources?.length || 0} resources
        </span>
        {path.estimatedCompletionDate && (
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center bg-white/5 px-2 py-1 rounded">
            <Clock className="w-3 h-3 mr-1.5" />
            {new Date(path.estimatedCompletionDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );

  // Group by phase logic dynamically from backend data
  const targetRole = student?.targetRole || "default";

  const groupedByPhase = useMemo(() => {
    if (!learningPaths || learningPaths.length === 0) return [];

    // 1. Group paths into buckets using phaseNumber
    const grouped = {};
    learningPaths.forEach(path => {
      // Data format fallback for old models
      const phaseNum = path.phaseNumber || 1;
      const phaseTitle = path.phaseTitle || "Core Fundamentals";
      
      if (!grouped[phaseNum]) {
        grouped[phaseNum] = {
          id: `phase_${phaseNum}`,
          number: phaseNum,
          title: phaseTitle,
          description: `Learning steps for ${phaseTitle}`,
          paths: []
        };
      }
      grouped[phaseNum].paths.push(path);
    });

    // 2. Convert to sorted array
    const buckets = Object.values(grouped).sort((a, b) => a.number - b.number);

    // 3. Calculate phase status
    let previousPhaseCompleted = true;

    return buckets.map((bucket) => {
      const allPathsCompleted =
        bucket.paths.length > 0 &&
        bucket.paths.every((p) => p.status === "completed");
      const hasPaths = bucket.paths.length > 0;

      let phaseStatus = "locked";
      if (!hasPaths) {
        phaseStatus = "empty";
      } else if (allPathsCompleted) {
        phaseStatus = "completed";
      } else if (previousPhaseCompleted) {
        phaseStatus = "active";
      }

      // If this phase is NOT completed AND it has paths, it soft-locks future phases
      if (hasPaths && !allPathsCompleted) {
        previousPhaseCompleted = false;
      }

      return {
        ...bucket,
        status: phaseStatus,
      };
    }).filter(b => b.paths.length > 0);
  }, [learningPaths]);

  if (!learningPaths || learningPaths.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/10">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No Learning Paths Yet
        </h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          Complete a skill gap analysis to get your personalized role-based learning roadmap.
        </p>
      </div>
    );
  }

  // Fallback conventional group by status
  const groupedList = {
    in_progress: learningPaths.filter((lp) => lp.status === "in_progress"),
    not_started: learningPaths.filter((lp) => lp.status === "not_started"),
    completed: learningPaths.filter((lp) => lp.status === "completed"),
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Your Learning Journey</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-[0.2em]">
            Target Role: <span className="font-black text-indigo-400">{targetRole}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTabChange && onTabChange("overview")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </button>
          
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode("roadmap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === "roadmap"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Roadmap
          </button>
          <button
            onClick={() => setViewMode("library")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === "library"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            All Skills
          </button>
          </div>
        </div>
      </div>

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] animate-fadeIn bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-300" />
          <span className="font-semibold text-sm">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full">
            <List className="w-4 h-4 opacity-0" /> {/* Placeholder for spacing */}
            <Target className="w-4 h-4 opacity-0" />
            <svg className="w-4 h-4 absolute top-1/2 translate-y-[-50%] right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {viewMode === "roadmap" ? (
        /* ROADMAP TIMELINE UI */
        <div className="relative pt-4 pb-12">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-indigo-500/50 via-emerald-500/50 to-indigo-500/50 rounded-full opacity-30" />

          <div className="space-y-12">
            {groupedByPhase.map((phase, index) => {
              const isLocked = phase.status === "locked";
              const isCompleted = phase.status === "completed";
              const isActive = phase.status === "active";

              return (
                <div key={phase.id} className="relative z-10 pl-24">
                  {/* Phase Node Indicator */}
                  <div
                    className={`absolute left-0 top-6 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl transition-all border ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20"
                        : isActive
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/30 ring-4 ring-indigo-500/10"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-8 h-8" /> : phase.number}
                  </div>

                  {/* Phase Header */}
                  <div className={`mb-8 ${isLocked ? "opacity-40" : ""}`}>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Phase {phase.number}: <span className={isActive ? "text-indigo-400" : ""}>{phase.title}</span>
                    </h3>
                    <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {phase.paths.map((path) => (
                      <LearningPathCard
                        key={path._id}
                        path={path}
                        isLocked={isLocked}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* FLAT LIBRARY VIEW (Legacy) */
        <div className="space-y-10 animate-fadeIn">
          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="relative grid grid-cols-3 gap-6 divide-x divide-white/20">
              <div className="text-center">
                <p className="text-4xl font-extrabold mb-1">{groupedList.completed.length}</p>
                <p className="text-indigo-200 font-medium tracking-wide uppercase text-sm">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold mb-1">{groupedList.in_progress.length}</p>
                <p className="text-indigo-200 font-medium tracking-wide uppercase text-sm">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold mb-1">{groupedList.not_started.length}</p>
                <p className="text-indigo-200 font-medium tracking-wide uppercase text-sm">Not Started</p>
              </div>
            </div>
          </div>

          {groupedList.in_progress.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-white mb-6 flex items-center uppercase tracking-[0.2em]">
                <Play className="w-4 h-4 mr-2 text-indigo-400 fill-indigo-400/20" />
                In Progress ({groupedList.in_progress.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedList.in_progress.map((path) => (
                  <LearningPathCard key={path._id} path={path} />
                ))}
              </div>
            </div>
          )}

          {groupedList.not_started.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-white mb-6 flex items-center uppercase tracking-[0.2em] mt-12">
                <Target className="w-4 h-4 mr-2 text-slate-400" />
                Not Started ({groupedList.not_started.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedList.not_started.map((path) => (
                  <LearningPathCard key={path._id} path={path} />
                ))}
              </div>
            </div>
          )}

          {groupedList.completed.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-white mb-6 flex items-center uppercase tracking-[0.2em] mt-12">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                Completed ({groupedList.completed.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedList.completed.map((path) => (
                  <LearningPathCard key={path._id} path={path} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPath && (
        <LearningPathDetailModal
          path={selectedPath}
          onClose={() => setSelectedPath(null)}
          onUpdateProgress={updateProgress}
          onToggleMilestone={toggleMilestone}
          onReschedulePath={handleReschedulePath}
          updating={updatingProgress}
        />
      )}
    </div>
  );
};


// Learning Path Detail Modal
const LearningPathDetailModal = ({
  path,
  onClose,
  onUpdateProgress,
  onToggleMilestone,
  onReschedulePath,
  updating,
}) => {
  const [localProgress, setLocalProgress] = useState(path.progressPercentage);

  // Sync local progress when server auto-calculates new progress from milestones
  React.useEffect(() => {
    setLocalProgress(path.progressPercentage);
  }, [path.progressPercentage]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalProgress(value);
  };

  const handleSaveProgress = () => {
    onUpdateProgress(path._id, localProgress);
  };

  const [activeQuizMilestoneIndex, setActiveQuizMilestoneIndex] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizMilestoneData, setQuizMilestoneData] = useState(null);

  const handleTakeQuiz = async (index) => {
    setGeneratingQuiz(true);
    try {
      // Create a temporary toast to show it's generating
      const response = await api.post(`/skill-gap/learning-paths/${path._id}/milestones/${index}/quiz/generate`);
      if (response.data.success) {
        setQuizMilestoneData({
          title: path.milestones[index].title,
          quiz: response.data.quiz
        });
        setActiveQuizMilestoneIndex(index);
      }
    } catch (err) {
      console.error("Failed to generate quiz", err);
      alert("Failed to generate quiz due to API limits. Please try again later.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleQuizSubmit = async (score, passed) => {
    try {
      const response = await api.post(`/skill-gap/learning-paths/${path._id}/milestones/${activeQuizMilestoneIndex}/quiz/submit`, {
        score,
        passed
      });
      if (response.data.success) {
        // We simulate a toggleMilestone if they passed so the UI updates
        if (passed && !path.milestones[activeQuizMilestoneIndex].completed) {
          onToggleMilestone(path._id, activeQuizMilestoneIndex, true);
        }
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
    } finally {
      setActiveQuizMilestoneIndex(null);
      setQuizMilestoneData(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-abyssal rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-black p-8 text-white shrink-0 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">{path.skillName}</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300 font-bold">
                Current: {path.currentLevel || "none"} → Target:{" "}
                {path.targetLevel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Control */}
          <div className="mt-8 bg-black/40 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                Update Mastery
              </span>
              <span className="text-4xl font-black text-white">
                {localProgress}%
              </span>
            </div>

            <div className="relative flex items-center mb-6 py-2">
              <style dangerouslySetInnerHTML={{__html: `
                .custom-progress-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: white;
                  box-shadow: 0 0 10px rgba(0,0,0,0.25);
                  cursor: pointer;
                  transition: transform 0.1s;
                }
                .custom-progress-slider::-webkit-slider-thumb:hover {
                  transform: scale(1.15);
                }
                .custom-progress-slider::-moz-range-thumb {
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: white;
                  cursor: pointer;
                  border: none;
                }
              `}} />
                <input
                type="range"
                min="0"
                max="100"
                value={localProgress}
                onChange={handleProgressChange}
                className="custom-progress-slider w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none bg-slate-800"
                style={{
                  background: `linear-gradient(to right, #6366f1 ${localProgress}%, #1e1b4b ${localProgress}%)`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() =>
                  setLocalProgress(Math.max(0, localProgress - 10))
                }
                className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                -10%
              </button>
              <button
                onClick={handleSaveProgress}
                disabled={updating || localProgress === path.progressPercentage}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {updating ? "Syncing..." : "Update Progress"}
              </button>
              <button
                onClick={() =>
                  setLocalProgress(Math.min(100, localProgress + 10))
                }
                className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <>
            {/* Milestones */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  Learning Milestones
                </h3>
                <button 
                  onClick={() => onReschedulePath(path._id)}
                  className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
                  title="Shift all incomplete milestones to start from today"
                >
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  Reschedule Plan
                </button>
              </div>
              <div className="space-y-3">
                {path.milestones?.map((milestone, index) => (
                  <div
                    key={index}
                    className={`border rounded-2xl p-5 transition-all mb-4 ${
                      milestone.completed
                        ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                        : "border-white/5 bg-white/2 hover:border-indigo-500/30"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() =>
                          onToggleMilestone(path._id, index, !milestone.completed)
                        }
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          milestone.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-white/20 hover:border-indigo-500"
                        }`}
                      >
                        {milestone.completed && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4
                          className={`font-bold ${
                            milestone.completed
                              ? "text-emerald-400"
                              : "text-white"
                          }`}
                        >
                          {milestone.title}
                        </h4>
                        <p
                          className={`text-xs mt-1.5 leading-relaxed ${
                            milestone.completed
                              ? "text-emerald-400/60"
                              : "text-slate-400"
                          }`}
                        >
                          {milestone.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-[10px] font-bold uppercase tracking-widest">
                          {milestone.dueDate && (
                            <span
                              className={
                                milestone.completed
                                  ? "text-emerald-500/60"
                                  : "text-slate-500"
                              }
                            >
                              <Clock className="w-3 h-3 inline mr-1.5" />
                              Due:{" "}
                              {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {milestone.completed && milestone.completedDate && (
                            <span className="text-emerald-500">
                              <CheckCircle className="w-3 h-3 inline mr-1.5" />
                              Completed:{" "}
                              {new Date(
                                milestone.completedDate,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {!milestone.completed && (
                          <div className="mt-4 flex">
                            <button
                              onClick={() => handleTakeQuiz(index)}
                              disabled={generatingQuiz}
                              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-violet-600 text-white flex items-center gap-2 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50"
                            >
                              <BrainCircuit className="w-3.5 h-3.5" />
                              {generatingQuiz && activeQuizMilestoneIndex === index ? "Generating..." : "Take Quiz to Complete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8">
                Curated Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {path.learningResources?.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl p-5 hover:border-indigo-500/40 hover:bg-white/5 transition-all group border border-white/5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                        {resource.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="px-2 py-1 bg-white/5 rounded text-indigo-300">
                        {resource.platform}
                      </span>
                      {resource.duration && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.duration}
                        </span>
                      )}
                      {resource.price && (
                        <span
                          className={`px-2 py-1 rounded ${
                            resource.price.toLowerCase() === "free"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-indigo-500/20 text-indigo-400"
                          }`}
                        >
                          {resource.price}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        </div>
      </div>
      {activeQuizMilestoneIndex !== null && quizMilestoneData && (
        <MilestoneQuizModal
          isOpen={true}
          onClose={() => setActiveQuizMilestoneIndex(null)}
          milestone={quizMilestoneData}
          onQuizSubmit={handleQuizSubmit}
        />
      )}
    </div>,
    document.body
   );
};

export default LearningPathTracker;
