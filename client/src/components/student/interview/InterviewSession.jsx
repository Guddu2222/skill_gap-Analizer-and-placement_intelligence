import React, { useState, useEffect, useRef } from "react";
import {
  generateMockInterview,
  evaluateInterviewAnswers,
} from "../../../services/api";
import {
  Loader2,
  Mic,
  MicOff,
  Volume2,
  Code,
  Send,
  ChevronRight,
  AlertCircle,
  Clock,
  Video,
  VideoOff,
  RefreshCw,
  Camera,
} from "lucide-react";
import useVoiceInterviewer from "../../../hooks/useVoiceInterviewer";
import useVisionProctor from "../../../hooks/useVisionProctor";
import InterviewHUD from "./InterviewHUD";
import CodeSandboxModal from "./CodeSandboxModal";

const InterviewSession = ({ student, launchOptions, onComplete }) => {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [attachedCode, setAttachedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const [webcamStream, setWebcamStream] = useState(null);
  const [webcamStatus, setWebcamStatus] = useState("initializing"); // "initializing" | "active" | "denied" | "not_found" | "error"
  const [isCameraOff, setIsCameraOff] = useState(false);

  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const hasStarted = useRef(false);

  // Voice Interviewer STT / TTS hook
  const {
    isSpeaking,
    isListening,
    transcript,
    speakText,
    stopSpeaking,
    startListening,
    stopListening,
  } = useVoiceInterviewer();

  // MediaPipe Vision Proctoring hook
  const visionMetrics = useVisionProctor(videoRef, true);

  // Update answer text when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setCurrentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    }
  }, [transcript]);

  // Request & Start WebCam
  const startWebcam = async () => {
    try {
      setWebcamStatus("initializing");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setWebcamStatus("error");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      webcamStreamRef.current = stream;
      setWebcamStream(stream);
      setWebcamStatus("active");
      setIsCameraOff(false);
    } catch (err) {
      console.warn("Webcam access optional/failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setWebcamStatus("denied");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setWebcamStatus("not_found");
      } else {
        setWebcamStatus("error");
      }
    }
  };

  useEffect(() => {
    startWebcam();
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Reactively attach webcam stream whenever video element becomes available in DOM
  useEffect(() => {
    if (videoRef.current && webcamStream && !isCameraOff) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current
        .play()
        .catch((err) => console.log("Video playback interrupted:", err));
    }
  }, [webcamStream, loading, isCameraOff]);

  const toggleCamera = () => {
    if (isCameraOff) {
      setIsCameraOff(false);
      if (!webcamStream || !webcamStream.active) {
        startWebcam();
      }
    } else {
      setIsCameraOff(true);
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startInterview = async () => {
      try {
        setLoading(true);
        const options = launchOptions || {
          targetRole: student?.targetRole || "Software Engineer",
          mode: "PROFILE",
          domain: "Web Development",
        };

        const res = await generateMockInterview(options);

        if (res.success && res.interview) {
          setInterviewId(res.interview._id);
          setQuestions(res.interview.questions);
        } else {
          setError("Failed to generate interview questions. Please try again.");
        }
      } catch (err) {
        console.error("Interview generation error:", err);
        setError("An error occurred while generating the mock interview.");
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, [student, launchOptions]);

  // Read current question aloud on change
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      speakText(questions[currentQuestionIndex].questionText);
    }
  }, [currentQuestionIndex, questions, speakText]);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim() && !attachedCode.trim()) {
      alert("Please provide a text/voice response or code solution before continuing.");
      return;
    }

    if (isListening) stopListening();
    stopSpeaking();

    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentQuestionIndex]._id,
        studentAnswer: currentAnswer,
        codeSubmitted: attachedCode,
      },
    ];

    setAnswers(newAnswers);
    setCurrentAnswer("");
    setAttachedCode("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await submitInterview(newAnswers);
    }
  };

  const submitInterview = async (finalAnswers) => {
    try {
      setEvaluating(true);
      const res = await evaluateInterviewAnswers(interviewId, finalAnswers, {
        postureScore: visionMetrics.postureScore,
        eyeContactScore: visionMetrics.eyeContactScore,
      });

      if (res.success) {
        onComplete(interviewId);
      } else {
        setError("Failed to evaluate answers.");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("An error occurred during evaluation.");
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Mic className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Preparing Your AI Interview</h3>
        <p className="text-slate-500 max-w-md">
          Generating personalized questions for {launchOptions?.domain || "Web Development"}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500 w-6 h-6" />
          <h3 className="text-red-800 font-bold">Interview Setup Failed</h3>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Evaluating Multi-Modal Scorecard</h3>
        <p className="text-slate-500 max-w-md bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
          Computing technical code accuracy, voice articulation, MediaPipe posture metrics, and eye contact gaze tracking...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header & Progress */}
      <div className="flex justify-between items-center text-sm font-medium text-slate-500">
        <span>
          Question {currentQuestionIndex + 1} of {questions.length} ({launchOptions?.domain || "Web Development"})
        </span>
        <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
          <Clock className="w-4 h-4" /> Live AI Session
        </span>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Grid: Left Panel (Question & Mic), Right Panel (Vision HUD & Video) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question & Answer Cockpit */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQuestion?.category || "Technical"}
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                  {currentQuestion?.difficulty || "Medium"}
                </span>
              </div>
              <button
                onClick={() => speakText(currentQuestion?.questionText)}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                  isSpeaking ? "bg-indigo-100 text-indigo-700 border-indigo-300 animate-pulse" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {isSpeaking ? "Speaking Question..." : "Read Aloud"}
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed mb-6">
              {currentQuestion?.questionText}
            </h2>

            {/* Answer Text Area */}
            <div className="relative mb-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response or use voice recording..."
                className="w-full h-44 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 leading-relaxed"
                spellCheck="false"
              />
              <div className="absolute bottom-4 right-4 flex gap-2 items-center">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isListening
                      ? "bg-red-100 text-red-600 border-red-200 animate-pulse"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? "Listening..." : "Record Voice Answer"}
                </button>
              </div>
            </div>

            {/* Code Attachment Indicator */}
            {attachedCode && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-mono mb-4">
                <span className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  Code snippet attached ({attachedCode.length} chars)
                </span>
                <button
                  onClick={() => setIsCodeModalOpen(true)}
                  className="text-slate-400 hover:text-white underline"
                >
                  Edit Code
                </button>
              </div>
            )}

            {/* In-Browser Code Sandbox Button */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              Open Monaco Code Sandbox & Execute Code
            </button>
          </div>

          {/* Controls */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              {isLastQuestion ? (
                <>
                  Submit & Evaluate Multi-Modal <Send className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next Question <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Video & MediaPipe Vision Proctor HUD */}
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" /> Live Webcam Feed
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCamera}
                  title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  {isCameraOff ? <VideoOff className="w-3.5 h-3.5 text-rose-400" /> : <Video className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                    isCameraOff
                      ? "bg-slate-800 text-slate-400 border-slate-700"
                      : webcamStatus === "active"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : webcamStatus === "initializing"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {isCameraOff
                    ? "Camera Off"
                    : webcamStatus === "active"
                    ? "MediaPipe GPU On"
                    : webcamStatus === "initializing"
                    ? "Connecting..."
                    : webcamStatus === "denied"
                    ? "Permission Blocked"
                    : "Simulated Feed"}
                </span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-800 flex items-center justify-center">
              {webcamStatus === "active" && !isCameraOff ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : isCameraOff ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <VideoOff className="w-10 h-10 text-slate-600 mb-1" />
                  <p className="text-xs text-slate-400 font-medium">Camera is currently turned off</p>
                  <button
                    onClick={toggleCamera}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition"
                  >
                    Turn On Camera
                  </button>
                </div>
              ) : webcamStatus === "initializing" ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-1" />
                  <p className="text-xs text-slate-400">Requesting webcam access...</p>
                </div>
              ) : webcamStatus === "denied" ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <VideoOff className="w-10 h-10 text-rose-400 mb-1" />
                  <p className="text-xs text-rose-300 font-bold">Camera Permission Denied</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Please allow camera access in your browser address bar settings.
                  </p>
                  <button
                    onClick={startWebcam}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-700 transition"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Permission
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <VideoOff className="w-10 h-10 text-amber-400 mb-1" />
                  <p className="text-xs text-amber-300 font-bold">Webcam Unavailable</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    No camera device detected. Vision proctoring is running in simulation mode.
                  </p>
                  <button
                    onClick={startWebcam}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-700 transition"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Camera
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vision HUD Component */}
          <InterviewHUD
            postureScore={visionMetrics.postureScore}
            eyeContactScore={visionMetrics.eyeContactScore}
            isSlouching={visionMetrics.isSlouching}
            gazeDeviated={visionMetrics.gazeDeviated}
            warningMsg={visionMetrics.warningMsg}
          />
        </div>
      </div>

      {/* Code Sandbox Modal */}
      <CodeSandboxModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        questionText={currentQuestion?.questionText}
        onSaveCode={(code) => setAttachedCode(code)}
      />
    </div>
  );
};

export default InterviewSession;
