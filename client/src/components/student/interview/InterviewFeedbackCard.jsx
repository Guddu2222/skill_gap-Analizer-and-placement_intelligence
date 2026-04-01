import React, { useState, useEffect } from "react";
import { getInterviewDetails } from "../../../services/api";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Lightbulb,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ExpandableText = ({ text, maxLength = 250 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Clean up markdown code blocks if present to make the summary cleaner
  const cleanText = text.replace(/```[a-z]*\n/gi, "").replace(/```/gi, "");

  if (cleanText.length <= maxLength) {
    return (
      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
        {cleanText}
      </p>
    );
  }

  return (
    <div>
      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
        {isExpanded ? cleanText : `${cleanText.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" /> Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" /> Read Full Explanation
          </>
        )}
      </button>
    </div>
  );
};

const InterviewFeedbackCard = ({ interviewId, onBack }) => {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getInterviewDetails(interviewId);
        if (res.success) {
          setInterview(res.interview);
        }
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">
          Loading your detailed feedback...
        </p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Failed to load interview details.</p>
        <button
          onClick={onBack}
          className="mt-4 text-indigo-600 font-medium hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Helper to map response back to corresponding question
  const getQuestionText = (questionId) => {
    const q = interview.questions.find((q) => q._id === questionId);
    return q ? q.questionText : "Unknown Question";
  };

  const getQuestionCategory = (questionId) => {
    const q = interview.questions.find((q) => q._id === questionId);
    return q ? q.category : "General";
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Interview Feedback
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Role:{" "}
              <span className="font-semibold text-indigo-600">
                {interview.targetRole}
              </span>
              • Date: {new Date(interview.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl border border-indigo-100 flex items-center gap-4">
            <div
              className={`text-4xl font-black ${interview.overallScore >= 80 ? "text-green-600" : interview.overallScore >= 60 ? "text-yellow-600" : "text-red-500"}`}
            >
              {interview.overallScore}%
            </div>
            <div className="text-sm font-medium text-slate-600">
              Overall
              <br />
              Score
            </div>
          </div>
        </div>

        {/* Responses Breakdown */}
        <div className="mt-8 space-y-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Detailed Breakdown
          </h3>

          {interview.responses.map((response, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
            >
              {/* Question Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                      {getQuestionCategory(response.questionId)}
                    </span>
                    <h4 className="text-lg font-bold text-slate-800 leading-snug">
                      {getQuestionText(response.questionId)}
                    </h4>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                    response.score >= 8
                      ? "bg-green-100 text-green-700 border-green-200"
                      : response.score >= 5
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {response.score}/10
                </div>
              </div>

              {/* Student Answer */}
              <div className="mb-5 pl-11">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Your Answer
                  </div>
                  <div className="text-slate-700 italic leading-relaxed">
                    "{response.studentAnswer}"
                  </div>
                </div>
              </div>

              {/* AI Feedback & Ideal Answer */}
              <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
                    <CheckCircle className="w-4 h-4" />
                    Ideal Answer
                  </div>
                  <div className="flex-grow">
                    <ExpandableText text={response.idealAnswer} />
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-3">
                    <Lightbulb className="w-4 h-4" />
                    Feedback
                  </div>
                  <div className="flex-grow">
                    <ExpandableText text={response.aiFeedback} />
                  </div>
                </div>
              </div>

              {/* Recommended Skill (If score <= 6) */}
              {response.recommendedSkill && (
                <div className="mt-4 pl-11">
                  <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-200 flex items-start gap-4">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-orange-800 font-bold mb-1">
                        Recommended Learning Need
                      </h5>
                      <p className="text-orange-700 text-sm">
                        Based on your answer, the AI recommends reviewing{" "}
                        <span className="font-bold underline">
                          {response.recommendedSkill}
                        </span>{" "}
                        to improve your performance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackCard;
