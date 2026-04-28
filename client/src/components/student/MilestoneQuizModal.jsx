import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Target, ArrowRight, Clock, AlertCircle } from "lucide-react";

/**
 * MilestoneQuizModal
 * Glassmorphic modal overlay to present weekly interview questions.
 */
const MilestoneQuizModal = ({ isOpen, onClose, milestone, onQuizSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(null);
  const [timeUp, setTimeUp] = useState(false);

  // Prevent background scrolling and initialize state
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    const qCount = milestone?.quiz?.questions?.length || 0;
    setGlobalTimeLeft(qCount * 30); // 30 seconds per question total
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(qCount).fill(null));
    setQuizFinished(false);
    setReviewMode(false);
    setTimeUp(false);
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [isOpen, milestone]);

  // Global Timer
  useEffect(() => {
    if (!isOpen || quizFinished || globalTimeLeft === null) return;

    if (globalTimeLeft <= 0) {
      setTimeUp(true);
      setQuizFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setGlobalTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [globalTimeLeft, isOpen, quizFinished]);

  if (!isOpen || !milestone || !milestone.quiz || !milestone.quiz.questions) return null;

  const questions = milestone.quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = index;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleFinish = () => {
    const correctCount = userAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correctAnswerIndex ? 1 : 0), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70; // 70% passing grade
    onQuizSubmit(score, passed);
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Render Review Mode ─────────────────────────────────────────────────────
  if (reviewMode) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0f]/80 backdrop-blur-md animate-fadeIn">
        <div className="absolute inset-0" onClick={onClose} />
        
        <div className="bg-[#13131a]/95 backdrop-blur-3xl rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_40px_rgba(99,102,241,0.15)] relative z-10 border border-white/10 flex flex-col animate-slideUpFade">
          
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#191921]/80">
            <div>
              <h2 className="text-2xl font-bold text-[#f6f2fc] tracking-tight">Quiz Review</h2>
              <p className="text-sm text-indigo-300 font-medium mt-1">{milestone.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
              >
                Done Reviewing
              </button>
              <button onClick={onClose} className="p-2 text-[#acaab3] hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
            {questions.map((q, qIndex) => {
              const uAns = userAnswers[qIndex];
              const isCorrect = uAns === q.correctAnswerIndex;
              const isUnattempted = uAns === null;

              return (
                <div key={qIndex} className="bg-[#191921]/50 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#f6f2fc] leading-snug flex-1 pr-4">
                      <span className="text-indigo-400 mr-2">{qIndex + 1}.</span>
                      {q.question}
                    </h3>
                    {isCorrect ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">Correct</span>
                    ) : isUnattempted ? (
                      <span className="px-3 py-1 bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">Unattempted</span>
                    ) : (
                      <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">Incorrect</span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {q.options.map((opt, optIndex) => {
                      const isCorrectOpt = optIndex === q.correctAnswerIndex;
                      const isSelectedOpt = optIndex === uAns;
                      
                      let style = "bg-[#1f1f27] border-white/5 text-[#acaab3] opacity-60";
                      let icon = null;

                      if (isCorrectOpt) {
                        style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium";
                        icon = <CheckCircle className="w-4 h-4" />;
                      } else if (isSelectedOpt && !isCorrectOpt) {
                        style = "bg-rose-500/10 border-rose-500/50 text-rose-400 font-medium";
                        icon = <X className="w-4 h-4" />;
                      }

                      return (
                        <div key={optIndex} className={`w-full text-left p-4 rounded-xl border flex items-center justify-between text-[14.5px] ${style}`}>
                          <span>{opt}</span>
                          {icon && <div>{icon}</div>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-indigo-400 mt-0.5">lightbulb</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-indigo-400">Explanation</h4>
                      <p className="text-[13px] text-indigo-200/70 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ── Render Finished State ──────────────────────────────────────────────────
  if (quizFinished) {
    const correctCount = userAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correctAnswerIndex ? 1 : 0), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
        <div className="absolute inset-0" onClick={onClose} />
        
        <div className="glass-abyssal rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 border border-white/10 animate-slideUpFade">
          <div className="p-10 flex flex-col items-center text-center">
            {timeUp && (
              <div className="mb-6 px-4 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Time's Up!
              </div>
            )}
            <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center ${passed ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]'}`}>
              {passed ? <CheckCircle className="w-12 h-12" /> : <Target className="w-12 h-12" />}
            </div>
            
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              {passed ? "Milestone Achieved!" : "Keep Practicing"}
            </h2>
            <div className="text-6xl font-black my-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
              {score}%
            </div>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              You answered <strong className="text-white">{correctCount}</strong> out of <strong className="text-white">{questions.length}</strong> correctly.
              {passed 
                ? " Excellent work! This milestone has been marked as complete." 
                : " You need 70% to pass this milestone. Review your answers and try again later."}
            </p>

            <div className="w-full flex gap-4">
              <button
                onClick={() => setReviewMode(true)}
                className="flex-1 py-4 px-6 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[15px] hover:bg-white/10 transition-all active:scale-95"
              >
                Review Answers
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[15px] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ── Render Active Quiz ─────────────────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0f]/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-[#13131a]/95 backdrop-blur-3xl rounded-3xl w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_40px_rgba(99,102,241,0.15)] overflow-hidden relative z-10 border border-white/10 animate-slideUpFade flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#191921]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#25252e] flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-indigo-400">quiz</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f6f2fc] tracking-tight">{milestone.title}</h2>
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${globalTimeLeft <= 60 ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-white/5 border-white/10 text-[#f6f2fc]'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{formatTime(globalTimeLeft)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#acaab3] hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#13131a]">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 ease-out" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-8 pb-10 flex-1">
          <h3 className="text-[1.35rem] font-bold text-[#f6f2fc] leading-snug mb-8">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswers[currentQuestionIndex] === index;
              const styleClass = isSelected 
                ? "bg-[#5f2c91]/30 border-[#ba9eff]/50 text-[#f6f2fc] shadow-[0_0_20px_rgba(186,158,255,0.15)]"
                : "bg-[#1f1f27] border-white/5 text-[#acaab3] hover:bg-[#25252e] hover:border-indigo-500/30";

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 font-medium text-[15px] ${styleClass} flex items-center justify-between group`}
                >
                  <span className="leading-relaxed pr-4">{option}</span>
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 transition-all flex items-center justify-center ${
                    isSelected ? 'border-[#ba9eff] bg-[#ba9eff]' : 'border-white/20 group-hover:border-[#ba9eff]/50'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#13131a]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-6 border-t border-white/5 bg-[#13131a] flex justify-between items-center">
          <div className="text-sm font-medium text-[#acaab3]">
            {userAnswers.filter(a => a !== null).length} of {questions.length} answered
          </div>
          <button
            onClick={handleNext}
            className={`px-8 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2 transition-all ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gradient-to-r from-[#ba9eff] to-[#8455ef] text-[#0e0e14] hover:shadow-[0_0_20px_rgba(186,158,255,0.4)] active:scale-95'
                : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            {currentQuestionIndex !== questions.length - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default MilestoneQuizModal;
