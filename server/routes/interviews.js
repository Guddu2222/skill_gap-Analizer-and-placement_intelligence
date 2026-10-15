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

const InterviewExperience = require("../models/InterviewExperience");

// GET /api/interviews/experiences — List community interview experiences with filters & initial seed if empty
router.get("/experiences", auth, async (req, res) => {
  try {
    const { company, difficulty, outcome, search, limit = 50 } = req.query;
    const query = {};

    if (company && company !== "All") {
      query.company = new RegExp(company, "i");
    }
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }
    if (outcome && outcome !== "All") {
      query.outcome = outcome;
    }
    if (search) {
      query.$or = [
        { company: new RegExp(search, "i") },
        { role: new RegExp(search, "i") },
        { "rounds.questions": new RegExp(search, "i") },
        { tips: new RegExp(search, "i") },
      ];
    }

    let count = await InterviewExperience.countDocuments();
    if (count === 0) {
      // Seed curated high-value initial interview experiences matching top placements
      await InterviewExperience.insertMany([
        {
          company: "Google",
          role: "Software Development Engineer I",
          studentName: "Vikramaditya Rao",
          batch: 2024,
          department: "Computer Science & Engineering",
          packageOffered: "32.0 LPA",
          difficulty: "Hard",
          outcome: "Selected",
          verified: true,
          upvotes: 142,
          rounds: [
            {
              roundName: "Round 1: Online Assessment",
              questions: [
                "Array partitioning with dynamic sliding window",
                "Tree serialization and deserialization with constraints",
              ],
              description: "HackerEarth 90-minute assessment. 2 Medium-Hard algorithmic questions.",
            },
            {
              roundName: "Round 2: DSA & Graph Algorithms",
              questions: [
                "Binary tree maximum path sum with weighted node paths",
                "Shortest path in weighted DAG with negative edge avoidance",
              ],
              description: "Google Meet technical screen on shared doc without auto-complete.",
            },
            {
              roundName: "Round 3: System Design & Caching",
              questions: [
                "Design a distributed rate limiter with Token Bucket algorithm in Redis",
                "Handling clock drift across multi-region Redis clusters",
              ],
              description: "High-level architecture interview with Staff Engineer.",
            },
            {
              roundName: "Round 4: Googliness & Leadership",
              questions: [
                "Tell me about a time you strongly disagreed with an architecture decision",
                "How do you prioritize tech debt vs feature delivery in crunch deadlines?",
              ],
              description: "Behavioral and cultural alignment with Engineering Director.",
            },
          ],
          tips: "Focus deeply on concurrency edge cases in system design. Clarify ambiguous constraints before writing code.",
        },
        {
          company: "Atlassian",
          role: "Backend Engineer",
          studentName: "Priya Sharma",
          batch: 2025,
          department: "Computer Science & Engineering",
          packageOffered: "24.0 LPA",
          difficulty: "Hard",
          outcome: "Selected",
          verified: true,
          upvotes: 98,
          rounds: [
            {
              roundName: "Round 1: Online Assessment",
              questions: ["Bitwise operations and Trie matching", "Dynamic Programming knapsack variant"],
              description: "Clean code structure and unit test coverage evaluated.",
            },
            {
              roundName: "Round 2: Coding & Concurrency",
              questions: ["Implement thread-safe LRU Cache with TTL expiry", "Producer-Consumer queue in Java"],
              description: "Live coding on CoderPad with focus on clean concurrency primitives.",
            },
            {
              roundName: "Round 3: System Architecture",
              questions: ["Kafka partition ordering pitfalls", "Design resilient Jira notification webhooks pipeline"],
              description: "Distributed message queues and idempotency mechanisms.",
            },
            {
              roundName: "Round 4: Values & Culture",
              questions: ["Open company, no bullshit value exploration", "Navigating team conflicts constructively"],
              description: "Team fit and behavioral scenarios.",
            },
          ],
          tips: "Write unit tests on code sandbox first before submitting. Atlassian heavily grades automated test coverage.",
        },
        {
          company: "Microsoft",
          role: "Cloud Solution Architect",
          studentName: "Rohan Verma",
          batch: 2025,
          department: "Information Technology",
          packageOffered: "28.5 LPA",
          difficulty: "Medium",
          outcome: "Selected",
          verified: true,
          upvotes: 76,
          rounds: [
            {
              roundName: "Round 1: Cognitive & Cloud OA",
              questions: ["Azure networking and subnetting", "REST API design & idempotency"],
              description: "Online assessment covering cloud foundations and algorithms.",
            },
            {
              roundName: "Round 2: Networking & K8s Deep Dive",
              questions: ["Kubernetes ingress routing and service mesh", "TCP/IP handshake latency optimization"],
              description: "In-depth cloud infrastructure and deployment architectures.",
            },
            {
              roundName: "Round 3: High-Level Architecture",
              questions: ["Multi-region failover architecture with Cosmos DB", "Disaster recovery RTO/RPO trade-offs"],
              description: "Case study presentation to Senior Cloud Architect.",
            },
          ],
          tips: "Master Azure/AWS architectural whitepapers. Know your database sharding and consistency models.",
        },
        {
          company: "Amazon",
          role: "Software Development Engineer I",
          studentName: "Siddharth N.",
          batch: 2024,
          department: "Computer Science & Engineering",
          packageOffered: "28.0 LPA",
          difficulty: "Hard",
          outcome: "Rejected",
          verified: true,
          upvotes: 64,
          rounds: [
            {
              roundName: "Round 1: Online Assessment",
              questions: ["Amazon Work Simulation", "Count Number of Substrings With Exactly K Distinct Characters"],
              description: "Debug round + 2 coding questions + LP survey.",
            },
            {
              roundName: "Round 2: DSA & Problem Solving",
              questions: ["Course Schedule II (Topological Sort)", "Rotten Oranges (Multi-source BFS)"],
              description: "Cleared with optimal complexity explanations.",
            },
            {
              roundName: "Round 3: Bar Raiser & Hard DP",
              questions: ["Optimal Account Balancing (NP-Hard DP with Bitmask)", "Customer Obsession conflict"],
              description: "Struggled on state transitions for 3-way balance settlement under time pressure.",
            },
          ],
          tips: "Prepare Amazon Leadership Principles with STAR format metrics. Practice Bitmask DP for Bar Raiser rounds.",
        },
      ]);
    }

    const experiences = await InterviewExperience.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    res.json({
      success: true,
      count: experiences.length,
      experiences,
    });
  } catch (err) {
    console.error("Error fetching interview experiences:", err);
    res.status(500).json({ error: "Failed to fetch interview experiences" });
  }
});

// POST /api/interviews/experiences — Share new interview experience
router.post("/experiences", auth, async (req, res) => {
  try {
    const {
      company,
      role,
      studentName,
      batch,
      department,
      packageOffered,
      difficulty,
      rounds,
      outcome,
      tips,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: "Company and Role are required fields" });
    }

    const newExp = new InterviewExperience({
      company,
      role,
      studentName: studentName || "Anonymous Scholar",
      batch: parseInt(batch, 10) || new Date().getFullYear(),
      department: department || "Computer Science & Engineering",
      packageOffered: packageOffered || "",
      difficulty: difficulty || "Medium",
      rounds: Array.isArray(rounds) ? rounds : [],
      outcome: outcome || "Selected",
      tips: tips || "",
      verified: true,
      upvotes: 1,
    });

    const saved = await newExp.save();
    res.status(201).json({
      success: true,
      message: "Interview experience published successfully",
      experience: saved,
    });
  } catch (err) {
    console.error("Error sharing interview experience:", err);
    res.status(500).json({ error: "Failed to save interview experience" });
  }
});

// POST /api/interviews/experiences/:id/upvote — Upvote an experience
router.post("/experiences/:id/upvote", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InterviewExperience.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json({ success: true, upvotes: updated.upvotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote experience" });
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
