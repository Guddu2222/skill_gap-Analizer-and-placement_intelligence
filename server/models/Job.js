const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String }, // e.g., "12 LPA"
  jobType: {
    type: String,
    default: "Full Time",
  },
  requirements: { type: [String] },
  deadline: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  createdAt: { type: Date, default: Date.now },
  source: { type: String, default: "internal" }, // "internal" | "remotive" | "campus" | "external"
  applyUrl: { type: String },
  externalId: { type: String, sparse: true },
  companyLogo: { type: String },
});

module.exports = mongoose.model("Job", jobSchema);
