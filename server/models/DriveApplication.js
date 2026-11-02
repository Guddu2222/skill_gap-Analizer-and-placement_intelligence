const mongoose = require("mongoose");

const driveApplicationSchema = new mongoose.Schema({
  drive: { type: mongoose.Schema.Types.ObjectId, ref: "CampusDrive", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    default: "Applied", // Should match one of the rounds in the CampusDrive or be "Rejected"
  },
  interviewScorecard: {
    technical: { type: Number, min: 0, max: 5, default: 0 },
    problemSolving: { type: Number, min: 0, max: 5, default: 0 },
    systemDesign: { type: Number, min: 0, max: 5, default: 0 },
    communication: { type: Number, min: 0, max: 5, default: 0 },
    feedback: { type: String, default: "" },
    evaluator: { type: String, default: "" },
    evaluatedAt: { type: Date },
  },
  offerDetails: {
    ctc: { type: String, default: "" },
    designation: { type: String, default: "" },
    joiningDate: { type: Date },
    offerLetterUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  offerResponse: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  offerRespondedAt: { type: Date },
  aptitudeScore: {
    score: { type: Number },
    total: { type: Number },
    percentage: { type: Number },
    passed: { type: Boolean },
    attemptedAt: { type: Date },
    sectionalBreakdown: {
      quantitative: { score: Number, total: Number },
      logical: { score: Number, total: Number },
      technical: { score: Number, total: Number },
    },
    tabSwitchCount: { type: Number, default: 0 },
    antiCheatFlags: { type: [String], default: [] },
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
driveApplicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("DriveApplication", driveApplicationSchema);
