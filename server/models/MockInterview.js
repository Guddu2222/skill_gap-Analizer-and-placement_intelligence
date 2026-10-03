const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["PROFILE", "TOPIC_DRILL"],
      default: "PROFILE",
    },
    domain: {
      type: String,
      default: "Web Development",
    },
    targetTopic: {
      type: String,
      default: "",
    },
    roundType: {
      type: String,
      enum: ["Technical", "Coding", "Behavioral"],
      default: "Technical",
    },
    companyStyle: {
      type: String,
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    questions: [
      {
        questionText: { type: String, required: true },
        category: { type: String, default: "General" },
        difficulty: { type: String, default: "Medium" },
      },
    ],
    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        studentAnswer: { type: String },
        codeSubmitted: { type: String },
        codePassed: { type: Boolean, default: false },
        aiFeedback: { type: String },
        score: { type: Number, min: 0, max: 10 },
        idealAnswer: { type: String },
        recommendedSkill: { type: String },
      },
    ],
    // 4-Axis Scores (0-100)
    scores: {
      technicalCode: { type: Number, default: 0 },
      voiceCommunication: { type: Number, default: 0 },
      postureAlignment: { type: Number, default: 100 },
      eyeContactGaze: { type: Number, default: 100 },
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
