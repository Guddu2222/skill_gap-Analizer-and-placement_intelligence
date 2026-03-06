import React, { useState, useEffect, useRef } from 'react';
import { generateMockInterview, evaluateInterviewAnswers } from '../../../services/api';
import { Loader2, Mic, MicOff, Send, ChevronRight, AlertCircle, Clock } from 'lucide-react';

const InterviewSession = ({ student, onComplete }) => {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startInterview = async () => {
      try {
        setLoading(true);
        const targetRole = student?.targetRole || 'Software Engineer';
        const res = await generateMockInterview(targetRole);
        
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
  }, [student]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
             transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
           setCurrentAnswer(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
    } else {
      if (recognition) {
        try {
          recognition.start();
          setIsRecording(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      }
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim()) {
      alert("Please provide an answer before continuing.");
      return;
    }

    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
    }

    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentQuestionIndex]._id,
        studentAnswer: currentAnswer
      }
    ];

    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit for evaluation
      await submitInterview(newAnswers);
    }
  };

  const submitInterview = async (finalAnswers) => {
    try {
      setEvaluating(true);
      const res = await evaluateInterviewAnswers(interviewId, finalAnswers);
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
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Preparing Your Interview</h3>
        <p className="text-slate-500 max-w-md">
          Our AI is analyzing your profile and skill gaps to generate personalized questions for the {student?.targetRole || 'Software Engineer'} role...
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
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
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
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Evaluating Your Answers</h3>
        <p className="text-slate-500 max-w-md bg-indigo-50 p-4 rounded-xl border border-indigo-100 mt-4">
          The AI is reviewing your responses, identifying strengths, and preparing constructive feedback along with ideal answers...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> Take your time</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
        {isRecording && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
        )}
        <div className="flex items-center gap-3 mb-6">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
            currentQuestion.category === 'Technical' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}>
            {currentQuestion.category}
          </span>
          <span className="px-3 py-1 text-xs font-bold rounded-full border bg-slate-50 text-slate-600 border-slate-200">
            {currentQuestion.difficulty}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 leading-relaxed mb-8">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Input */}
        <div className={`relative transition-all duration-300 ${isRecording ? 'ring-2 ring-red-400/50 rounded-2xl' : ''}`}>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer or click 'Record Answer' to speak..."
            className="w-full h-48 md:h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 leading-relaxed custom-scrollbar pb-16"
            spellCheck="false"
          />
          <div className="absolute bottom-4 right-4 flex gap-2 items-center">
             <button 
               onClick={toggleRecording}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${isRecording ? 'bg-red-100 text-red-600 border-red-200 animate-pulse shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
             >
               {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
               {isRecording ? 'Stop Recording' : 'Record Answer'}
             </button>
             <div className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 text-xs rounded-lg font-medium flex items-center">
               {currentAnswer.length} chars
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25"
        >
          {isLastQuestion ? (
            <>Submit Interview <Send className="w-5 h-5" /></>
          ) : (
            <>Next Question <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
