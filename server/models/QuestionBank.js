const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Quantitative Aptitude",
        "Logical Reasoning",
        "Technical (Core CS)",
        "Technical (Programming & DSA)",
        "Technical (Web & Systems)",
        "Verbal & Comprehension",
      ],
      required: true,
      index: true,
    },
    domain: {
      type: String,
      default: "general", // "general", "software-engineering", "data-science", "web-development"
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length >= 2,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    explanation: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionBank", questionBankSchema);
