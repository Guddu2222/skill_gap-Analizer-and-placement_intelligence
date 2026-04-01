import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Target,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api"; // Assuming axios instance is configured

const OpportunitiesTab = ({ student }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        // We'll use the native fetch or api client. Assuming standard setup.
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/jobs/opportunities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch opportunities");

        const data = await res.json();
        setOpportunities(data.opportunities || []);
      } catch (err) {
        console.error("Match error:", err);
        setError("Could not load your opportunities at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [student?.skills]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">
          AI is matching your skills with open roles...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <p className="font-medium">{error}</p>
      </div>
    );

  if (opportunities.length === 0)
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col items-center justify-center">
        <Briefcase className="w-16 h-16 text-slate-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          No Match Found Yet
        </h3>
        <p className="text-slate-500 max-w-md">
          We couldn't find internships or jobs that align closely with your
          current skill profile. Keep upskilling and improving your Readiness
          Score!
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Smart Job Matches
          </h2>
          <p className="text-slate-500">
            Opportunities ranked by how well they fit your exact skill set.
          </p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-sm">
          {opportunities.length} Matches
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {opportunities.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-slate-500 font-medium">{job.company}</p>
              </div>

              {/* Match Score Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${
                  job.matchScore >= 80
                    ? "bg-emerald-100 text-emerald-700"
                    : job.matchScore >= 50
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                <Target className="w-4 h-4" />
                {job.matchScore}% Match
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400" />{" "}
                {job.location || "Remote"}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 capitalize">
                <Briefcase className="w-4 h-4 text-slate-400" />{" "}
                {job.jobType?.replace("_", " ") || "Full Time"}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <DollarSign className="w-4 h-4 text-slate-400" /> {job.salary}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements?.slice(0, 6).map((req, idx) => {
                  const isMissing = job.missingSkills?.includes(req);
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                        isMissing
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1"
                      }`}
                    >
                      {!isMissing && <CheckCircle2 className="w-3 h-3" />}
                      {req}
                    </span>
                  );
                })}
                {job.requirements?.length > 6 && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-500">
                    +{job.requirements.length - 6} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {job.deadline
                  ? `Closes ${new Date(job.deadline).toLocaleDateString()}`
                  : "Open immediately"}
              </span>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-indigo-600 transition-colors">
                Apply Now <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesTab;
