const mongoose = require("mongoose");

const campusDriveSchema = new mongoose.Schema({
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  company: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date },
  eligibility: {
    minCGPA: { type: Number, default: 0 },
    departments: { type: [String], default: [] }, // Empty array means all departments eligible
    skills: { type: [String], default: [] }
  },
  rounds: {
    type: [String],
    default: ["Applied", "Aptitude Test", "Technical Interview", "HR Round", "Offered", "Rejected"]
  },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CampusDrive", campusDriveSchema);
