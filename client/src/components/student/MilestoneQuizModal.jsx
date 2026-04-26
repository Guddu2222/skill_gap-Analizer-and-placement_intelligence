import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Target, ArrowRight, Clock } from "lucide-react";

/**
 * MilestoneQuizModal
 * Glassmorphic modal overlay to present weekly interview questions.
 */
const MilestoneQuizModal = ({ isOpen, onClose, milestone, onQuizSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Prevent background scrolling when open
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
      // Reset state on close
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAnswers([]);
      setQuizFinished(false);
      setTimeLeft(30);
    };
  }, [isOpen]);

  // Reset timer when a new question starts
  useEffect(() => {
    if (isOpen && !quizFinished) {
      setTimeLeft(30);
    }
  }, [currentQuestionIndex, isOpen, quizFinished]);

  // Timer countdown logic
  useEffect(() => {
    if (!isOpen || isSubmitted || quizFinished) return;

    if (timeLeft <= 0) {
      // Auto-submit when time is up
      setAnswers(prev => [...prev, { questionIndex: currentQuestionIndex, isCorrect: false }]);
      setIsSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isOpen, isSubmitted, quizFinished, currentQuestionIndex]);

  if (!isOpen || !milestone || !milestone.quiz || !milestone.quiz.questions) return null;

  const questions = milestone.quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleNext = () => {
    if (!isSubmitted) {
      // Submit answer
      const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
      setAnswers([...answers, { questionIndex: currentQuestionIndex, isCorrect }]);
      setIsSubmitted(true);
    } else {
      // Move to next question or finish
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsSubmitted(false);
      } else {
        setQuizFinished(true);
      }
    }
  };

  const handleFinish = () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70; // 70% passing grade
    onQuizSubmit(score, passed);
  };

  // ── Render Finished State ──────────────────────────────────────────────────
  if (quizFinished) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 70;

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div className="absolute inset-0" onClick={onClose} />
        
        <div className="glass-abyssal rounded-3xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 border border-white/10 animate-slideUpFade">
          <div className="p-10 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-full mb-6 flex items-center justify-center ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {passed ? <CheckCircle className="w-10 h-10" /> : <Target className="w-10 h-10" />}
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {passed ? "Milestone Achieved!" : "Keep Practicing"}
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
              You scored <strong className="text-white">{score}%</strong> ({correctCount} out of {questions.length} correct).
              {passed 
                ? " Excellent work. This milestone has been marked as complete." 
                : " You need 70% to pass this milestone. Review the material and try again later."}
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[15px] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // ── Render Question State ──────────────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0f]/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-[#13131a]/90 backdrop-blur-2xl rounded-3xl w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_40px_rgba(99,102,241,0.1)] overflow-hidden relative z-10 border border-white/10 transform scale-100 animate-slideUpFade flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#191921]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#25252e] flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-indigo-400">quiz</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#f6f2fc] tracking-tight">{milestone.title}</h2>
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Knowledge Check {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isSubmitted && !quizFinished && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft <= 10 ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-white/5 border-white/10 text-indigo-300'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{timeLeft}s</span>
              </div>
            )}
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
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out" 
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
              const isSelected = selectedOption === index;
              const isCorrectAnswer = currentQuestion.correctAnswerIndex === index;
              
              let styleClass = "bg-[#1f1f27] border-white/5 text-[#acaab3] hover:bg-[#25252e] hover:border-indigo-500/30";
              
              if (isSubmitted) {
                if (isCorrectAnswer) {
                  styleClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                } else if (isSelected && !isCorrectAnswer) {
                  styleClass = "bg-rose-500/10 border-rose-500/50 text-rose-400";
                } else {
                  styleClass = "bg-[#1f1f27] border-white/5 text-[#55545c] opacity-50";
                }
              } else if (isSelected) {
                styleClass = "bg-[#5f2c91]/20 border-[#ba9eff]/50 text-[#ba9eff] shadow-[0_0_15px_rgba(186,158,255,0.1)]";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 font-medium text-[15px] ${styleClass} flex items-center justify-between group`}
                >
                  <span className="leading-relaxed pr-4">{option}</span>
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 transition-all flex items-center justify-center ${
                    isSubmitted 
                      ? (isCorrectAnswer ? 'border-emerald-500 bg-emerald-500' : (isSelected ? 'border-rose-500 bg-rose-500' : 'border-white/10'))
                      : (isSelected ? 'border-[#ba9eff] bg-[#ba9eff]' : 'border-white/20 group-hover:border-[#ba9eff]/50')
                  }`}>
                    {isSubmitted && isCorrectAnswer && <CheckCircle className="w-3 h-3 text-black" />}
                    {isSubmitted && isSelected && !isCorrectAnswer && <X className="w-3 h-3 text-black" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Alert */}
          {isSubmitted && (
            <div className={`mt-6 p-5 rounded-2xl border flex items-start gap-3 animate-slideUpFade ${
              selectedOption === currentQuestion.correctAnswerIndex 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-[#25252e] border-white/5'
            }`}>
              <div className="mt-0.5">
                {selectedOption === currentQuestion.correctAnswerIndex 
                  ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                  : <span className="material-symbols-outlined text-[#ba9eff]">lightbulb</span>
                }
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-1 ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-emerald-400' : (selectedOption === null ? 'text-rose-400' : 'text-[#f6f2fc]')}`}>
                  {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct!' : (selectedOption === null ? 'Time is up!' : 'Explanation')}
                </h4>
                <p className="text-[13px] text-[#acaab3] leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Area */}
        <div className="p-6 border-t border-white/5 bg-[#13131a] flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isSubmitted && selectedOption === null}
            className={`px-8 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-2 transition-all ${
              (!isSubmitted && selectedOption === null)
                ? 'bg-[#25252e] text-[#55545c] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ba9eff] to-[#8455ef] text-[#0e0e14] hover:shadow-[0_0_20px_rgba(186,158,255,0.4)] active:scale-95'
            }`}
          >
            {isSubmitted ? (currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question') : 'Submit Answer'}
            {isSubmitted && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default MilestoneQuizModal;
