const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const interviewService = require("../services/interview.service");
const MockInterview = require("../models/MockInterview");
const Student = require("../models/Student");

// Generate Mock Interview (Supports Profile Mode & Topic Drill Mode)
router.post("/generate", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const payload = {
      targetRole: req.body.targetRole || student.targetRole || "Software Engineer",
      mode: req.body.mode || "PROFILE",
      domain: req.body.domain || "Web Development",
      targetTopic: req.body.targetTopic || "",
      roundType: req.body.roundType || "Technical",
      companyStyle: req.body.companyStyle || "General",
      difficulty: req.body.difficulty || "Medium",
      questionCount: req.body.questionCount || 5,
    };

    const interview = await interviewService.generateMockInterview(
      student._id,
      payload,
    );

    res.json({
      success: true,
      message: "Mock interview generated successfully",
      interview,
    });
  } catch (error) {
    console.error("Mock interview generation error:", error);
    res.status(500).json({
      error: "Failed to generate mock interview",
      message: error.message,
    });
  }
});

// Evaluate Interview Answers & Multi-Axis Vision Metrics
router.post("/:id/evaluate", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, visionMetrics } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    const evaluatedInterview = await interviewService.evaluateInterviewAnswers(
      id,
      answers,
      visionMetrics || {},
    );

    res.json({
      success: true,
      message: "Interview evaluated successfully",
      interview: evaluatedInterview,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);
    res.status(500).json({
      error: "Failed to evaluate interview answers",
      message: error.message,
    });
  }
});

// Code Sandbox Compilation Execution Route
router.post("/compile", auth, async (req, res) => {
  try {
    const compilerService = require("../services/compiler.service");
    const { language, code, input } = req.body;

    const result = await compilerService.executeCode({ language, code, input });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: `Compilation server error: ${error.message}` });
  }
});

// Get Interviews History
router.get("/history/:studentId?", auth, async (req, res) => {
  try {
    let studentId = req.params.studentId;

    if (!studentId) {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }
      studentId = student._id;
    }

    const interviews = await MockInterview.find({ student: studentId })
      .sort({ createdAt: -1 })
      .select("-responses"); // Exclude responses to keep the list lightweight

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews history error:", error);
    res.status(500).json({ error: "Failed to fetch interviews history" });
  }
});

// Get Specific Interview Details
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await MockInterview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview details error:", error);
    res.status(500).json({ error: "Failed to fetch interview details" });
  }
});

module.exports = router;
