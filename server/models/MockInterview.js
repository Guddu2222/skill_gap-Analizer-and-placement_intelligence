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
        aiFeedback: { type: String },
        score: { type: Number, min: 0, max: 10 },
        idealAnswer: { type: String },
        recommendedSkill: { type: String },
      },
    ],
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
