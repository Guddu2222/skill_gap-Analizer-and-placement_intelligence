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
  assessmentSettings: {
    durationMinutes: { type: Number, default: 20 },
    questionCount: { type: Number, default: 24 },
    passingCutoffPercentage: { type: Number, default: 60 },
    proctoringStrictness: {
      type: String,
      enum: ["standard", "strict"],
      default: "standard"
    },
    sectionalDistribution: {
      quantitative: { type: Number, default: 7 },
      logical: { type: Number, default: 7 },
      technical: { type: Number, default: 10 }
    }
  },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CampusDrive", campusDriveSchema);
