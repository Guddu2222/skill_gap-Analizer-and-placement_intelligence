import React, { useState, useEffect } from "react";
import {
  PlayCircle,
  Clock,
  CheckCircle,
  BarChart2,
  Star,
  Target,
  MessageSquare,
} from "lucide-react";
import { getInterviewHistory } from "../../../services/api";

const InterviewDashboard = ({ student, onStartInterview, onViewFeedback }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getInterviewHistory();
        if (res.success) {
          setHistory(res.interviews);
        }
      } catch (error) {
        console.error("Failed to fetch interview history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 opacity-80" />
              AI Interview Preperation
            </h2>
            <p className="text-indigo-100 max-w-xl text-lg">
              Practice specialized technical and behavioral questions tailored
              to your skill gaps and target role.
            </p>
          </div>
          <button
            onClick={onStartInterview}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl flex items-center gap-3 shrink-0"
          >
            <PlayCircle className="w-6 h-6" />
            Start Mock Interview
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Interview History
          </h3>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {history.length} Session{history.length !== 1 && "s"}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Target className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-700 mb-2">
              No Interviews Yet
            </h4>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven't completed any mock interviews. Start your first
              session to get personalized feedback and improve your skills.
            </p>
            <button
              onClick={onStartInterview}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((interview) => (
              <div
                key={interview._id}
                onClick={() =>
                  interview.status === "Completed"
                    ? onViewFeedback(interview._id)
                    : null
                }
                className={`bg-white border ${interview.status === "Completed" ? "border-indigo-100 hover:border-indigo-300 hover:shadow-md cursor-pointer" : "border-slate-200 opacity-70"} rounded-2xl p-5 transition-all group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4" />
                    {interview.targetRole}
                  </div>
                  {interview.status === "Completed" ? (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getScoreBadge(interview.overallScore)}`}
                    >
                      Score: {interview.overallScore}%
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg border bg-slate-100 text-slate-600 border-slate-200">
                      {interview.status}
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(interview.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-slate-400" />
                    {interview.questions?.length || 5} Questions
                  </div>
                </div>

                {interview.status === "Completed" && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                    View Detailed Feedback
                    <BarChart2 className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDashboard;
