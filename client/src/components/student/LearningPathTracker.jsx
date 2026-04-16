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
} from "lucide-react";
import api from "../../services/api"; // Use our api utility instance configured with intercepts

const LearningPathTracker = ({ learningPaths, student, onUpdate }) => {
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
      not_started: "bg-gray-100 text-gray-700",
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      abandoned: "bg-red-100 text-red-700",
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
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer relative ${
        isLocked ? "opacity-70 grayscale-[30%] pointer-events-none" : ""
      }`}
      onClick={() => {
        if (!isLocked) setSelectedPath(path);
      }}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
          <div className="bg-white p-2 rounded-full shadow-md text-gray-400">
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
                ? "bg-green-100"
                : path.status === "in_progress"
                ? "bg-blue-100"
                : "bg-indigo-50"
            }`}
          >
            <BookOpen
              className={`w-6 h-6 ${
                path.status === "completed"
                  ? "text-green-600"
                  : path.status === "in_progress"
                  ? "text-blue-600"
                  : "text-indigo-600"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {path.skillName}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Level: {path.currentLevel || "none"} → {path.targetLevel}
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
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Progress
          </span>
          <span className="text-sm font-bold text-gray-900">
            {path.progressPercentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              path.status === "completed"
                ? "bg-green-500"
                : path.status === "in_progress"
                ? "bg-blue-500"
                : "bg-indigo-400"
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              milestone.completed
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {milestone.completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
          {path.learningResources?.length || 0} resources
        </span>
        {path.estimatedCompletionDate && (
          <span className="text-xs text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
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
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-indigo-300" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No Learning Paths Yet
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Your Learning Journey</h2>
          <p className="text-sm text-slate-500">
            Target Role: <span className="font-semibold text-indigo-600">{targetRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("roadmap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "roadmap"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Roadmap
          </button>
          <button
            onClick={() => setViewMode("library")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "library"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List className="w-4 h-4" />
            All Skills
          </button>
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
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-indigo-100 rounded-full" />

          <div className="space-y-12">
            {groupedByPhase.map((phase, index) => {
              const isLocked = phase.status === "locked";
              const isCompleted = phase.status === "completed";
              const isActive = phase.status === "active";

              return (
                <div key={phase.id} className="relative z-10 pl-24">
                  {/* Phase Node Indicator */}
                  <div
                    className={`absolute left-0 top-6 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-green-500/30"
                        : isActive
                        ? "bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-indigo-100"
                        : "bg-white text-slate-400 border-2 border-slate-200"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-8 h-8" /> : phase.number}
                  </div>

                  {/* Phase Header */}
                  <div className={`mb-6 ${isLocked ? "opacity-60" : ""}`}>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Phase {phase.number}: {phase.title}
                    </h3>
                    <p className="text-slate-500 mt-1 max-w-2xl">
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
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 mr-2 text-blue-600" />
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
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-500" />
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
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
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

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{path.skillName}</h2>
              <p className="text-blue-100">
                Current: {path.currentLevel || "none"} → Target:{" "}
                {path.targetLevel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
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
          <div className="mt-8 bg-black/10 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Update Progress
              </span>
              <span className="text-3xl font-bold bg-white text-transparent bg-clip-text drop-shadow-sm">
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
                className="custom-progress-slider w-full h-2.5 rounded-full appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.95) ${localProgress}%, rgba(255,255,255,0.2) ${localProgress}%)`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() =>
                  setLocalProgress(Math.max(0, localProgress - 10))
                }
                className="flex-1 py-2.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-all active:scale-95 border border-white/5"
              >
                -10%
              </button>
              <button
                onClick={handleSaveProgress}
                disabled={updating || localProgress === path.progressPercentage}
                className="flex-[2] py-2.5 bg-white text-indigo-600 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {updating ? "Saving..." : "Save Progress"}
              </button>
              <button
                onClick={() =>
                  setLocalProgress(Math.min(100, localProgress + 10))
                }
                className="flex-1 py-2.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-all active:scale-95 border border-white/5"
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Milestones */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Learning Milestones
              </h3>
              <button 
                onClick={() => onReschedulePath(path._id)}
                className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                title="Shift all incomplete milestones to start from today"
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Reschedule Deadlines
              </button>
            </div>
            <div className="space-y-3">
              {path.milestones?.map((milestone, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    milestone.completed
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() =>
                        onToggleMilestone(path._id, index, !milestone.completed)
                      }
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        milestone.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {milestone.completed && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold ${
                          milestone.completed
                            ? "text-green-900"
                            : "text-gray-900"
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      <p
                        className={`text-sm mt-1 ${
                          milestone.completed
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        {milestone.dueDate && (
                          <span
                            className={
                              milestone.completed
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            <Clock className="w-3 h-3 inline mr-1" />
                            Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {milestone.completed && milestone.completedDate && (
                          <span className="text-green-600">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Completed:{" "}
                            {new Date(
                              milestone.completedDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {path.learningResources?.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded">
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
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
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
        </div>
      </div>
    </div>,
    document.body
   );
};

export default LearningPathTracker;
