const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  jobType: {
    type: String,
    enum: ["Full Time", "Internship", "Part Time", "Contract", "Remote"],
    default: "Full Time",
  },
  requirements: { type: [String] },
  deadline: { type: Date },
  applyUrl: { type: String },          // External application link
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],

  // ── Dynamic job tracking ────────────────────────────────────────────────────
  source: {
    type: String,
    enum: ["recruiter", "ai_generated", "adzuna", "jsearch"],
    default: "recruiter",
  },
  externalId: { type: String },        // Dedup key for external API jobs
  generatedForSkills: { type: [String] }, // AI jobs: what skills they were generated for
  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },

  // TTL: auto-expire ai_generated / external jobs after 48 hours
  // (recruiter jobs have no TTL — set expiresAt to null/undefined)
  expiresAt: { type: Date, index: { expires: 0 } },
});

// Compound index for fast dedup of external jobs
jobSchema.index({ externalId: 1, source: 1 }, { sparse: true });

// Index for fast skill-based lookup
jobSchema.index({ requirements: 1 });
jobSchema.index({ source: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
