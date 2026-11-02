import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Award,
  Zap,
  Check,
  X,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  FileCheck,
  DollarSign,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  ChevronLeft,
  PieChart,
  BookOpen,
  Camera,
  CameraOff,
  Eye,
  UserCheck,
  Users,
  Activity,
  Maximize2,
  Minimize2,
} from "lucide-react";
import axios from "axios";
import useVisionProctor from "../hooks/useVisionProctor";
import {
  respondToJobOffer,
  fetchAptitudeQuestions,
  submitAptitudeAssessment,
} from "../services/api";

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

  // Offer modal / action state
  const [offerActionLoading, setOfferActionLoading] = useState(false);

  // Dynamic Aptitude Assessment state
  const [activeTestApp, setActiveTestApp] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins default
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Anti-cheat & Tab-switch state
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const warningDismissTimeout = useRef(null);

  // Webcam & MediaPipe AI Vision Proctor state
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const [webcamStatus, setWebcamStatus] = useState("inactive"); // "initializing" | "active" | "denied" | "not_found" | "error" | "inactive"
  const [isCameraMinimized, setIsCameraMinimized] = useState(false);
  const proctorLogsRef = useRef({
    postureSamples: [],
    eyeContactSamples: [],
    multipleFaceCount: 0,
    faceMissingCount: 0,
  });
  const lastVisionStateRef = useRef({ hadMultiple: false, wasMissing: false });

  // Hook into MediaPipe Vision Proctor
  const isProctorActive = !!activeTestApp && !testResult && webcamStatus === "active";
  const visionMetrics = useVisionProctor(videoRef, isProctorActive);

  // Start webcam feed
  const startWebcam = async () => {
    try {
      setWebcamStatus("initializing");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setWebcamStatus("not_found");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: "user" },
        audio: false,
      });
      webcamStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn("Video play error:", e));
      }
      setWebcamStatus("active");
    } catch (err) {
      console.warn("Webcam activation error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setWebcamStatus("denied");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setWebcamStatus("not_found");
      } else {
        setWebcamStatus("error");
      }
    }
  };

  // Stop webcam feed
  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setWebcamStatus("inactive");
  };

  // Ensure video element rebinds stream if mounted
  useEffect(() => {
    if (webcamStreamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = webcamStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [webcamStatus, activeTestApp, isCameraMinimized]);

  // Clean up webcam stream on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Live Vision Proctoring Sampling & Multi-Person / Face Missing Detection
  useEffect(() => {
    if (!isProctorActive || !visionMetrics.isReady) return;

    if (visionMetrics.postureScore > 0) {
      proctorLogsRef.current.postureSamples.push(visionMetrics.postureScore);
    }
    if (visionMetrics.eyeContactScore > 0) {
      proctorLogsRef.current.eyeContactSamples.push(visionMetrics.eyeContactScore);
    }

    // Edge-triggered Multiple Face Detection (anti-cheat strike)
    if (visionMetrics.multiplePersonsDetected) {
      if (!lastVisionStateRef.current.hadMultiple) {
        lastVisionStateRef.current.hadMultiple = true;
        proctorLogsRef.current.multipleFaceCount += 1;
        const currentCount = proctorLogsRef.current.multipleFaceCount;

        if (currentCount >= 5) {
          handleAutoSubmitTest(
            tabSwitchCount,
            "Disqualified: Repeated multiple faces detected in webcam feed"
          );
        } else {
          setShowWarningModal(true);
        }
      }
    } else {
      lastVisionStateRef.current.hadMultiple = false;
    }

    // Edge-triggered Candidate Missing Detection
    if (!visionMetrics.hasCandidate) {
      if (!lastVisionStateRef.current.wasMissing) {
        lastVisionStateRef.current.wasMissing = true;
        proctorLogsRef.current.faceMissingCount += 1;
      }
    } else {
      lastVisionStateRef.current.wasMissing = false;
    }
  }, [visionMetrics, isProctorActive]);

  useEffect(() => {
    fetchData();
  }, []);

  // Timer countdown for assessment
  useEffect(() => {
    let timer;
    if (activeTestApp && !testResult && !testLoading && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitTest(tabSwitchCount, "Time expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTestApp, testResult, testLoading, timeLeft, tabSwitchCount]);

  // Anti-Cheat Tab Switching & Window Blur Monitor
  useEffect(() => {
    if (!activeTestApp || testResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount >= 4) {
            handleAutoSubmitTest(
              nextCount,
              "Disqualified: Repeated browser tab switches detected"
            );
          } else {
            setShowWarningModal(true);
            if (warningDismissTimeout.current) {
              clearTimeout(warningDismissTimeout.current);
            }
            warningDismissTimeout.current = setTimeout(() => {
              setShowWarningModal(false);
            }, 6000);
          }
          return nextCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (warningDismissTimeout.current) {
        clearTimeout(warningDismissTimeout.current);
      }
    };
  }, [activeTestApp, testResult, questions]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drivesRes, appsRes, meRes] = await Promise.all([
        apiCall("get", "/student-features/drives"),
        apiCall("get", "/student-features/drives/applications"),
        apiCall("get", "/student-features/me"),
      ]);
      setDrives(drivesRes.data || []);
      setApplications(appsRes.data || []);
      setStudent(meRes.data?.student || null);
    } catch (err) {
      console.error("Error fetching student drives data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      setApplyingTo(driveId);
      const res = await apiCall("post", `/student-features/drives/${driveId}/apply`);
      setApplications([res.data, ...applications]);
      await fetchData();
    } catch (err) {
      console.error("Error applying to drive:", err);
      alert(err.response?.data?.msg || "Failed to apply");
    } finally {
      setApplyingTo(null);
    }
  };

  const getApplication = (driveId) => {
    return applications.find(
      (a) => a.drive?._id === driveId || a.drive === driveId
    );
  };

  // Offer Response Handler
  const handleOfferResponse = async (appId, decision) => {
    if (
      !window.confirm(
        decision === "accept"
          ? "Are you sure you want to accept this job offer? This will mark you as placed and notify your college placement cell."
          : "Are you sure you want to decline this job offer?"
      )
    ) {
      return;
    }

    try {
      setOfferActionLoading(true);
      await respondToJobOffer(appId, decision);
      alert(
        decision === "accept"
          ? "🎉 Congratulations! You have accepted the job offer. Your profile has been updated to Placed."
          : "Offer response recorded."
      );
      await fetchData();
    } catch (err) {
      console.error("Error responding to offer:", err);
      alert("Failed to record offer response.");
    } finally {
      setOfferActionLoading(false);
    }
  };

  // Launch Dynamic Assessment
  const startAptitudeTest = async (app) => {
    setActiveTestApp(app);
    setTestLoading(true);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTabSwitchCount(0);
    setShowWarningModal(false);
    setTestResult(null);
    setIsCameraMinimized(false);

    // Reset vision proctoring metrics accumulator
    proctorLogsRef.current = {
      postureSamples: [],
      eyeContactSamples: [],
      multipleFaceCount: 0,
      faceMissingCount: 0,
    };
    lastVisionStateRef.current = { hadMultiple: false, wasMissing: false };

    // Request webcam feed
    startWebcam();

    try {
      const res = await fetchAptitudeQuestions(app._id);
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setSections(res.sections || []);
        setTimeLeft((res.timeLimitMinutes || 20) * 60);
      } else {
        alert("Failed to load questions. Please try again.");
        closeTestModal();
      }
    } catch (err) {
      console.error("Error loading aptitude questions:", err);
      alert(err.response?.data?.error || "Failed to start assessment.");
      closeTestModal();
    } finally {
      setTestLoading(false);
    }
  };

  const closeTestModal = () => {
    stopWebcam();
    setActiveTestApp(null);
    setTestResult(null);
    setQuestions([]);
    setSelectedAnswers({});
  };

  const selectAnswer = (qKey, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qKey]: optionIndex,
    }));
  };

  const handleAutoSubmitTest = async (currentTabSwitches = tabSwitchCount, flagReason = "") => {
    if (!activeTestApp || testSubmitting) return;
    setTestSubmitting(true);

    try {
      const flags = [];
      if (flagReason) flags.push(flagReason);

      const pLogs = proctorLogsRef.current;
      const avgPosture =
        pLogs.postureSamples.length > 0
          ? Math.round(
              pLogs.postureSamples.reduce((a, b) => a + b, 0) /
                pLogs.postureSamples.length
            )
          : webcamStatus === "active"
          ? 92
          : 0;
      const avgEyeContact =
        pLogs.eyeContactSamples.length > 0
          ? Math.round(
              pLogs.eyeContactSamples.reduce((a, b) => a + b, 0) /
                pLogs.eyeContactSamples.length
            )
          : webcamStatus === "active"
          ? 88
          : 0;

      const proctoringPayload = {
        avgPostureScore: avgPosture,
        avgEyeContactScore: avgEyeContact,
        multipleFaceEvents: pLogs.multipleFaceCount,
        faceMissingEvents: pLogs.faceMissingCount,
        webcamStatus,
      };

      const res = await submitAptitudeAssessment(activeTestApp._id, {
        answers: selectedAnswers,
        tabSwitchCount: currentTabSwitches,
        antiCheatFlags: flags,
        proctoringMetrics: proctoringPayload,
      });

      setTestResult({
        score: res.score,
        total: res.total,
        percentage: res.percentage,
        passed: res.passed,
        disqualifiedByCheating: res.disqualifiedByCheating,
        sectionalBreakdown: res.sectionalBreakdown,
        proctoringMetrics: proctoringPayload,
        reviewDetails: res.reviewDetails || [],
      });

      await fetchData();
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Failed to submit assessment.");
    } finally {
      setTestSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Active offers filter
  const activeOffers = applications.filter(
    (app) => app.status === "Offered" && app.offerResponse !== "declined"
  );

  // Current question data
  const currentQ = questions[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  if (loading) {
    return (
      <div className="flex bg-[#0c0c1d] min-h-screen font-sans items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0c0c1d] font-sans text-white overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-cyan-600/8 rounded-full blur-[140px]" />
      </div>

      <Sidebar role="student" />

      <main className="flex-1 ml-64 p-8 relative z-10 flex flex-col h-screen overflow-y-auto custom-scrollbar-dark">
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Campus Placement Drives
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                Student Portal
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Explore partner campus drives, take dynamic proctored aptitude tests, and respond to verified job offers.
            </p>
          </div>

          {student?.isPlaced && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Placed at {student.placementPackage ? `₹ ${student.placementPackage} LPA` : "Hired"}</span>
            </div>
          )}
        </header>

        {/* ACTIVE JOB OFFERS BANNER */}
        {activeOffers.length > 0 && (
          <div className="mb-8 space-y-4">
            {activeOffers.map((offer) => {
              const isAccepted = offer.offerResponse === "accepted";

              return (
                <div
                  key={offer._id}
                  className={`backdrop-blur-xl border rounded-3xl p-6 transition-all shadow-2xl relative overflow-hidden ${
                    isAccepted
                      ? "bg-gradient-to-r from-emerald-950/40 via-[#121226] to-[#121226] border-emerald-500/50"
                      : "bg-gradient-to-r from-violet-950/50 via-[#14142a] to-[#14142a] border-violet-500/50 shadow-violet-600/15"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        {offer.drive?.company ? offer.drive.company.charAt(0) : "O"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isAccepted ? "Offer Accepted" : "Official Placement Offer"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {offer.drive?.company}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                          {offer.offerDetails?.designation || offer.drive?.title || "Software Development Engineer"}
                        </h2>
                        <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
                          {offer.offerDetails?.ctc && (
                            <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              <DollarSign className="w-3.5 h-3.5" />
                              Package: {offer.offerDetails.ctc}
                            </span>
                          )}
                          {offer.offerDetails?.joiningDate && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />
                              Joining: {new Date(offer.offerDetails.joiningDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      {isAccepted ? (
                        <div className="px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Offer Confirmed & Recorded
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOfferResponse(offer._id, "decline")}
                            disabled={offerActionLoading}
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleOfferResponse(offer._id, "accept")}
                            disabled={offerActionLoading}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Accept Job Offer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DRIVES GRID */}
        {drives.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-[rgba(20,20,38,0.4)] backdrop-blur-md p-12">
            <Briefcase className="w-16 h-16 text-slate-600 mb-3" />
            <h2 className="text-base font-bold text-white mb-1">
              No Active Placement Drives
            </h2>
            <p className="text-xs text-slate-400 text-center max-w-sm">
              There are currently no active placement drives for your college. Check back later when your campus placement cell launches new drives.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => {
              const app = getApplication(drive._id);
              const status = app ? app.status : null;
              const minCgpa = drive.eligibility?.minCGPA || 0;
              const studentCgpa = student?.cgpa || 0;
              const isEligible = studentCgpa >= minCgpa;
              const isAptitudeStage = status === "Aptitude Test";

              return (
                <div
                  key={drive._id}
                  className="bg-[rgba(20,20,38,0.7)] border border-white/8 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between hover:border-violet-500/40 transition-all duration-300 shadow-xl group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                          <Building className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white leading-tight group-hover:text-violet-300 transition-colors">
                            {drive.company}
                          </h3>
                          <p className="text-xs text-violet-300 font-medium">
                            {drive.title}
                          </p>
                        </div>
                      </div>

                      {status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                            status === "Offered"
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                              : status === "Technical Interview"
                              ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                              : status === "Aptitude Test"
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                              : status === "Rejected"
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                              : "bg-sky-500/20 border-sky-500/40 text-sky-300"
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-5 line-clamp-3">
                      {drive.description}
                    </p>

                    <div className="space-y-2 mb-5 bg-[#121226] p-3.5 rounded-2xl border border-white/5 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Posted On</span>
                        </div>
                        <span className="text-white font-medium">
                          {new Date(drive.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                          <span>Min CGPA Cutoff</span>
                        </div>
                        <span
                          className={`font-bold ${
                            isEligible ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {minCgpa.toFixed(1)}
                        </span>
                      </div>

                      {app?.aptitudeScore && (
                        <div className="flex items-center justify-between text-slate-400 pt-1.5 border-t border-white/5">
                          <span>Aptitude Score</span>
                          <span
                            className={`font-bold ${
                              app.aptitudeScore.passed
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {app.aptitudeScore.percentage}% (
                            {app.aptitudeScore.passed ? "Passed" : "Failed"})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button Row */}
                  <div className="pt-2">
                    {!status ? (
                      isEligible ? (
                        <button
                          onClick={() => handleApply(drive._id)}
                          disabled={applyingTo === drive._id}
                          className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-white font-semibold text-xs shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {applyingTo === drive._id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Applying...
                            </>
                          ) : (
                            "Apply Now"
                          )}
                        </button>
                      ) : (
                        <div className="w-full py-2.5 bg-white/5 border border-white/8 rounded-xl text-slate-500 text-xs text-center cursor-not-allowed">
                          Ineligible ({minCgpa.toFixed(1)}+ CGPA Required)
                        </div>
                      )
                    ) : isAptitudeStage ? (
                      <button
                        onClick={() => startAptitudeTest(app)}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white text-white" />
                        Take Dynamic Aptitude Assessment
                      </button>
                    ) : status === "Offered" ? (
                      <div className="w-full py-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold text-xs text-center">
                        Offer Extended! Review Banner Above
                      </div>
                    ) : (
                      <div className="w-full py-2.5 bg-white/5 border border-white/8 rounded-xl text-slate-400 font-medium text-xs text-center">
                        Stage: {status}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DYNAMIC APTITUDE ASSESSMENT MODAL */}
        {activeTestApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#121226] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar-dark p-7 relative shadow-2xl flex flex-col">
              {/* TAB SWITCH WARNING OVERLAY */}
              {showWarningModal && !testResult && (
                <div className="absolute top-4 left-4 right-4 z-40 bg-rose-950/90 border border-rose-500 text-rose-200 px-4 py-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center justify-between animate-bounce">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-300">
                        Anti-Cheat Alert: Tab Switch Detected ({tabSwitchCount}/3 Warnings)
                      </p>
                      <p className="text-[11px] text-rose-200/90">
                        Navigating away from this window is strictly monitored. 4 tab switches will cause immediate test termination and disqualification.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWarningModal(false)}
                    className="p-1 rounded-lg hover:bg-rose-900/50 text-rose-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {testLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400">
                    Generating dynamic 24-question test session from MongoDB QuestionBank...
                  </p>
                </div>
              ) : !testResult ? (
                <>
                  {/* Test Top Navigation */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                        Dynamic Campus Placement Assessment
                      </h2>
                      <p className="text-xs text-slate-400">
                        {activeTestApp.drive?.company} • {activeTestApp.drive?.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {tabSwitchCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-xl">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Tab Switches: {tabSwitchCount}/3
                        </span>
                      )}

                      {/* Timer */}
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-xs border ${
                          timeLeft < 300
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse"
                            : "bg-amber-500/15 border-amber-500/30 text-amber-300"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{formatTimer(timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  {/* MediaPipe AI Vision Proctor HUD */}
                  <div className="bg-[#070714] border border-white/10 rounded-2xl p-3.5 shadow-xl mb-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              webcamStatus === "active"
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                          ></span>
                          <span
                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                              webcamStatus === "active"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          ></span>
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-violet-400" />
                          MediaPipe AI Vision Proctor
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {webcamStatus === "active" ? "60 FPS Stream" : "Standby"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {webcamStatus === "active" && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                              visionMetrics.multiplePersonsDetected
                                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                                : !visionMetrics.hasCandidate
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                                : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            }`}
                          >
                            {visionMetrics.multiplePersonsDetected ? (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> Multi-Face Alert!
                              </span>
                            ) : !visionMetrics.hasCandidate ? (
                              <span className="flex items-center gap-1">
                                <CameraOff className="w-3 h-3" /> Candidate Absent
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> 1 Face Verified
                              </span>
                            )}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsCameraMinimized((prev) => !prev)}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title={isCameraMinimized ? "Expand Camera HUD" : "Minimize Camera HUD"}
                        >
                          {isCameraMinimized ? (
                            <Maximize2 className="w-3.5 h-3.5" />
                          ) : (
                            <Minimize2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {!isCameraMinimized && (
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        {/* Video Canvas Container */}
                        <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 flex items-center justify-center">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${
                              webcamStatus !== "active" ? "hidden" : ""
                            } ${
                              visionMetrics.multiplePersonsDetected
                                ? "ring-2 ring-rose-500"
                                : !visionMetrics.hasCandidate
                                ? "ring-2 ring-amber-500"
                                : "ring-1 ring-emerald-500/50"
                            }`}
                            style={{ transform: "scaleX(-1)" }}
                          />

                          {webcamStatus !== "active" && (
                            <div className="p-3 text-center flex flex-col items-center gap-1.5">
                              <CameraOff className="w-6 h-6 text-slate-500" />
                              <span className="text-[10px] text-slate-400 leading-tight">
                                {webcamStatus === "initializing"
                                  ? "Connecting webcam..."
                                  : webcamStatus === "denied"
                                  ? "Camera permission denied"
                                  : "Webcam not detected"}
                              </span>
                              {webcamStatus !== "initializing" && (
                                <button
                                  type="button"
                                  onClick={startWebcam}
                                  className="mt-1 px-2.5 py-0.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-[10px] text-white font-medium transition-all"
                                >
                                  Retry
                                </button>
                              )}
                            </div>
                          )}

                          {webcamStatus === "active" && visionMetrics.isReady && (
                            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[9px] px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-slate-300">
                              <span className="flex items-center gap-1">
                                <Eye className="w-2.5 h-2.5 text-cyan-400" />
                                {visionMetrics.eyeContactScore}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="w-2.5 h-2.5 text-emerald-400" />
                                {visionMetrics.postureScore}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Live AI Gauges & Status Messages */}
                        <div className="flex-1 w-full space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                              <div className="text-[10px] text-slate-400 mb-0.5">
                                Eye Gaze Alignment
                              </div>
                              <div className="text-sm font-bold text-white flex items-center justify-between">
                                <span>{visionMetrics.eyeContactScore || 90}%</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                    visionMetrics.gazeDeviated
                                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                      : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                  }`}
                                >
                                  {visionMetrics.gazeDeviated
                                    ? "Looking Away"
                                    : "Focused"}
                                </span>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                              <div className="text-[10px] text-slate-400 mb-0.5">
                                Posture & Head Yaw
                              </div>
                              <div className="text-sm font-bold text-white flex items-center justify-between">
                                <span>{visionMetrics.postureScore || 95}%</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                    visionMetrics.isSlouching
                                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                      : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                  }`}
                                >
                                  {visionMetrics.isSlouching
                                    ? "Head Tilted"
                                    : "Upright"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {visionMetrics.warningMsg && (
                            <div
                              className={`p-2 rounded-xl text-[11px] font-medium flex items-center gap-1.5 ${
                                visionMetrics.multiplePersonsDetected
                                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300 animate-pulse"
                                  : !visionMetrics.hasCandidate
                                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                                  : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{visionMetrics.warningMsg}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section Badges */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                    {sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 whitespace-nowrap"
                      >
                        {sec.name} ({sec.count} Qs)
                      </span>
                    ))}
                  </div>

                  {/* Progress Indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>
                        Question {currentQIndex + 1} of {questions.length} • Answered:{" "}
                        <strong className="text-violet-400">{answeredCount}</strong>/{questions.length}
                      </span>
                      <span className="text-violet-300 font-semibold text-xs px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/25">
                        {currentQ?.category}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-300"
                        style={{
                          width: `${((currentQIndex + 1) / questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Box */}
                  {currentQ && (
                    <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-5 mb-5 flex-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                        <span className="uppercase tracking-wider font-semibold">
                          Difficulty: {currentQ.difficulty || "medium"}
                        </span>
                        <span className="text-slate-400">ID: #{currentQIndex + 1}</span>
                      </div>

                      <h3 className="text-sm font-semibold text-white mb-4 leading-relaxed">
                        {currentQ.question}
                      </h3>

                      <div className="space-y-2.5">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[currentQ.id] === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => selectAnswer(currentQ.id, optIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-violet-600/25 border-violet-500 text-white shadow-md shadow-violet-600/20"
                                  : "bg-[#121226] border-white/8 text-slate-300 hover:border-white/20 hover:bg-white/5"
                              }`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-violet-400 bg-violet-500"
                                    : "border-slate-600"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Question Quick-Jump Grid */}
                  <div className="mb-5 bg-[#0a0a16] border border-white/5 p-3 rounded-xl">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                      Questions Palette (Jump to Question)
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar-dark">
                      {questions.map((q, idx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        const isCurrent = currentQIndex === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentQIndex(idx)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                              isCurrent
                                ? "ring-2 ring-violet-400 bg-violet-600 text-white"
                                : isAnswered
                                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                                : "bg-white/5 text-slate-400 hover:bg-white/10"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {currentQIndex < questions.length - 1 ? (
                        <button
                          onClick={() =>
                            setCurrentQIndex((prev) =>
                              Math.min(questions.length - 1, prev + 1)
                            )
                          }
                          className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/25 cursor-pointer flex items-center gap-1.5"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleAutoSubmitTest()}
                        disabled={testSubmitting}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {testSubmitting ? "Submitting..." : `Finish & Submit (${answeredCount}/${questions.length})`}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Assessment Result & Sectional Breakdown View */
                <div className="py-4 space-y-5">
                  <div
                    className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                      testResult.passed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    {testResult.passed ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {testResult.passed
                        ? "Aptitude Round Cleared! 🎉"
                        : testResult.disqualifiedByCheating
                        ? "Disqualified: Anti-Cheat Violation"
                        : "Assessment Cutoff Not Met"}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {testResult.passed
                        ? "Congratulations! You exceeded the 60% qualification cutoff and your application has been automatically advanced to the Technical Interview stage."
                        : testResult.disqualifiedByCheating
                        ? "Your test was terminated early because excessive window tab switches were logged by the anti-cheat monitor."
                        : "You scored below the 60% qualification cutoff required for this campus placement drive."}
                    </p>
                  </div>

                  {/* Main Score Pill */}
                  <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-4 max-w-sm mx-auto text-center">
                    <div className="text-3xl font-extrabold text-white mb-0.5">
                      {testResult.percentage}%
                    </div>
                    <p className="text-xs text-slate-400">
                      {testResult.score} out of {testResult.total} Correct Answers
                    </p>
                  </div>

                  {/* Sectional Performance Breakdown */}
                  {testResult.sectionalBreakdown && (
                    <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <PieChart className="w-4 h-4 text-violet-400" /> Sectional Competency Breakdown
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                          <p className="text-xs text-slate-400">Quantitative</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            {testResult.sectionalBreakdown.quantitative.score} /{" "}
                            {testResult.sectionalBreakdown.quantitative.total}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                          <p className="text-xs text-slate-400">Logical Reasoning</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            {testResult.sectionalBreakdown.logical.score} /{" "}
                            {testResult.sectionalBreakdown.logical.total}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                          <p className="text-xs text-slate-400">Core CS & Technical</p>
                          <p className="text-lg font-bold text-white mt-0.5">
                            {testResult.sectionalBreakdown.technical.score} /{" "}
                            {testResult.sectionalBreakdown.technical.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Vision Proctoring Report */}
                  <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      MediaPipe AI Vision Proctoring Dossier
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center">
                      <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Webcam Stream
                        </p>
                        <p className="text-xs font-bold text-emerald-400 mt-1 capitalize flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {webcamStatus === "active" ? "Verified Active" : webcamStatus}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Avg Eye Alignment
                        </p>
                        <p className="text-sm font-bold text-white mt-1 flex items-center justify-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          {testResult.proctoringMetrics?.avgEyeContactScore || 90}%
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Avg Posture Index
                        </p>
                        <p className="text-sm font-bold text-white mt-1 flex items-center justify-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-violet-400" />
                          {testResult.proctoringMetrics?.avgPostureScore || 95}%
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#121226] border border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Multi-Face Flags
                        </p>
                        <p
                          className={`text-sm font-bold mt-1 ${
                            (testResult.proctoringMetrics?.multipleFaceEvents || 0) > 0
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {testResult.proctoringMetrics?.multipleFaceEvents || 0} Incident
                          {(testResult.proctoringMetrics?.multipleFaceEvents || 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Answers Drawer */}
                  {testResult.reviewDetails && testResult.reviewDetails.length > 0 && (
                    <div className="bg-[#0a0a16] border border-white/8 rounded-2xl p-4 max-h-56 overflow-y-auto custom-scrollbar-dark space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-cyan-400" /> Answer Explanations & Key
                      </h4>

                      {testResult.reviewDetails.slice(0, 10).map((r, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-[#121226] border border-white/5 text-xs space-y-1"
                        >
                          <p className="font-semibold text-white">
                            {i + 1}. {r.question}
                          </p>
                          <div className="flex items-center gap-4 text-[11px]">
                            <span className={r.isCorrect ? "text-emerald-400" : "text-rose-400"}>
                              Your Answer: {r.userAnswer}
                            </span>
                            {!r.isCorrect && (
                              <span className="text-emerald-400">
                                Correct: {r.correctAnswer}
                              </span>
                            )}
                          </div>
                          {r.explanation && (
                            <p className="text-[10px] text-slate-400 italic">
                              Why: {r.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <button
                      onClick={closeTestModal}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                    >
                      Return to Drives Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDrives;
