const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const auth = require("../middleware/auth");
const Student = require("../models/Student");
const { getOrRefreshJobs } = require("../services/jobSync.service");

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Jobs error:", err.message);
    res.status(500).json({
      error: "Server Error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Get jobs posted by the current user (recruiter)
router.get("/me", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Jobs error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Post a job (Recruiter/Admin)
router.post("/", auth, async (req, res) => {
  try {
    const { company, title, description, location, salary, jobType, requirements, deadline } =
      req.body;
    const newJob = new Job({
      company,
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
      deadline,
      source: "recruiter",   // Mark as real recruiter job — never auto-expires
      postedBy: req.user.userId,
    });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error("Jobs error:", err.message);
    res.status(500).json({
      error: "Server Error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ── Smart Job Opportunities ────────────────────────────────────────────────────
// GET /api/jobs/opportunities
// Returns jobs ranked by skill match for the authenticated student.
// Auto-triggers a background refresh of the job pool if stale.
router.get("/opportunities", auth, async (req, res) => {
  try {
    // 1. Load student profile
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const studentSkills = (student.skills || [])
      .map((s) => (typeof s === "string" ? s : s.skillName || "").toLowerCase().trim())
      .filter(Boolean);

    const targetRole = student.targetRole || student.targetDomain || "";

    // 2. Trigger a non-blocking background refresh so this request never waits
    //    for the AI/API call, but future requests get fresh data immediately.
    getOrRefreshJobs(studentSkills, targetRole).catch((err) =>
      console.warn("[Jobs] Background refresh error:", err.message)
    );

    // 3. Query all active jobs from DB (includes recruiter + any already-cached dynamic jobs)
    const allJobs = await Job.find({ isActive: { $ne: false } }).sort({
      source: 1,            // recruiter jobs come first
      createdAt: -1,
    });

    // 4. Fetch student's existing applications to annotate each job
    const myApplications = await Application.find({ student: student._id }).select("job status appliedAt");
    const appMap = {};
    myApplications.forEach((app) => {
      appMap[app.job.toString()] = {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
      };
    });

    // 5. Score each job against the student's skills
    const MATCH_THRESHOLD = 20;
    const opportunities = allJobs
      .map((job) => {
        const requirements = job.requirements || [];
        const appInfo = appMap[job._id.toString()] || null;

        if (requirements.length === 0) {
          return {
            ...job.toObject(),
            matchScore: 50,
            missingSkills: [],
            isApplied: !!appInfo,
            applicationStatus: appInfo ? appInfo.status : null,
            appliedAt: appInfo ? appInfo.appliedAt : null,
          };
        }

        let matchCount = 0;
        const missingSkills = [];

        requirements.forEach((reqSkill) => {
          const skillLower = reqSkill.toLowerCase().trim();
          const hasSkill = studentSkills.some(
            (s) => s.includes(skillLower) || skillLower.includes(s)
          );
          if (hasSkill) matchCount++;
          else missingSkills.push(reqSkill);
        });

        const matchScore = Math.round((matchCount / requirements.length) * 100);
        return {
          ...job.toObject(),
          matchScore,
          missingSkills,
          isApplied: !!appInfo,
          applicationStatus: appInfo ? appInfo.status : null,
          appliedAt: appInfo ? appInfo.appliedAt : null,
        };
      })
      .filter((job) => job.matchScore >= MATCH_THRESHOLD)
      .sort((a, b) => {
        // Sort: recruiter jobs first within same score range, then by score
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        if (a.source === "recruiter" && b.source !== "recruiter") return -1;
        if (b.source === "recruiter" && a.source !== "recruiter") return 1;
        return 0;
      });

    res.json({
      success: true,
      count: opportunities.length,
      opportunities,
      meta: {
        totalJobsInPool: allJobs.length,
        studentSkills: studentSkills.length,
        totalApplied: myApplications.length,
        refreshing: true, // background refresh is always triggered
      },
    });
  } catch (err) {
    console.error("Job match error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ── Apply to a Job Opportunity ────────────────────────────────────────────────
// POST /api/jobs/:id/apply
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job opportunity not found" });
    }

    // Check if already applied
    let application = await Application.findOne({
      job: job._id,
      student: student._id,
    });

    if (application) {
      return res.json({
        success: true,
        alreadyApplied: true,
        message: "You have already applied to this position.",
        application,
      });
    }

    // Create new application
    application = new Application({
      job: job._id,
      student: student._id,
      status: "applied",
      appliedAt: new Date(),
    });
    await application.save();

    // Link application to job
    if (!job.applicants) job.applicants = [];
    if (!job.applicants.some((id) => id.toString() === application._id.toString())) {
      job.applicants.push(application._id);
      await job.save();
    }

    // Link application to student
    if (!student.applications) student.applications = [];
    if (!student.applications.some((id) => id.toString() === application._id.toString())) {
      student.applications.push(application._id);
    }
    if (student.placementStatus === "eligible") {
      student.placementStatus = "applying";
    }
    await student.save();

    res.status(201).json({
      success: true,
      message: `Application submitted successfully for ${job.title} at ${job.company}!`,
      application,
    });
  } catch (err) {
    console.error("Apply job error:", err.message);
    res.status(500).json({
      error: "Failed to submit application",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ── Get All Applied Jobs for Student ──────────────────────────────────────────
// GET /api/jobs/my-applications
router.get("/my-applications", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const applications = await Application.find({ student: student._id })
      .populate("job")
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("Get my applications error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;


