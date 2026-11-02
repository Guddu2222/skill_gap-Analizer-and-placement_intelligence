const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const College = require("../models/College");
const Job = require("../models/Job");
const Alumni = require("../models/Alumni");
const MentorshipBooking = require("../models/MentorshipBooking");
const InterviewExperience = require("../models/InterviewExperience");
const CampusDrive = require("../models/CampusDrive");
const DriveApplication = require("../models/DriveApplication");
const Notification = require("../models/Notification");
const QuestionBank = require("../models/QuestionBank");
const { SEED_QUESTIONS } = require("../utils/seedQuestionBank");
const auth = require("../middleware/auth");
const { upload, uploadImage } = require("../config/cloudinary");

// Upload Resume
router.post(
  "/upload-resume",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      // req.file.path will contain the Cloudinary URL
      student.resumeUrl = req.file.path;

      // The profileCompletionPercentage is auto-recalculated by the pre-save hook on Student model
      await student.save();

      res.json({
        msg: "Resume uploaded successfully",
        resumeUrl: student.resumeUrl,
        profileCompletionPercentage: student.profileCompletionPercentage,
      });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ error: "Failed to upload resume" });
    }
  },
);

// ── Resume View ────────────────────────────────────────────────────────────────
// Retrieves the authenticated student's resume URL from DB and redirects the
// browser directly to the Cloudinary CDN URL. This avoids unreliable server-side
// streaming and lets the browser handle the PDF natively.
router.get("/resume-view", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student || !student.resumeUrl) {
      return res.status(404).json({ error: "No resume found for this account." });
    }

    let url = student.resumeUrl;

    // Cloudinary raw uploads are served at /raw/upload/. If the old record
    // used /image/upload/ (uploaded before the resource_type fix), try /raw/ first.
    if (url.includes("/image/upload/")) {
      url = url.replace("/image/upload/", "/raw/upload/");
    }

    console.log(`[Resume View] Redirecting to: ${url}`);

    // 302 redirect — the browser opens the Cloudinary PDF URL directly.
    // No server-side streaming needed; Cloudinary handles delivery.
    return res.redirect(302, url);
  } catch (err) {
    console.error("[Resume View] Error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error retrieving resume." });
    }
  }
});

// Upload Profile Picture
router.post(
  "/upload-profile-picture",
  auth,
  uploadImage.single("profilePicture"),
  async (req, res) => {
    try {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) {
        return res.status(404).json({ msg: "Student not found" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No image uploaded" });
      }

      // req.file.path will contain the Cloudinary URL
      student.profilePicture = req.file.path;

      // The profileCompletionPercentage is auto-recalculated by the pre-save hook on Student model
      await student.save();

      res.json({
        msg: "Profile picture uploaded successfully",
        profilePicture: student.profilePicture,
        profileCompletionPercentage: student.profileCompletionPercentage,
      });
    } catch (err) {
      console.error("Profile Picture Upload Error:", err);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  },
);
router.get("/me", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId })
      .populate("user", "-password")
      .populate("college", "name location tier");

    if (!student) {
      return res.status(404).json({ msg: "Student profile not found" });
    }

    // Calculate Placement Readiness Score
    const SkillGapAnalysis = require("../models/SkillGapAnalysis");
    const latestAnalysis = await SkillGapAnalysis.findOne({
      student: student._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    let placementReadinessScore = 0;
    let components = {
      profile: student.profileCompletionPercentage,
      skillGap: 0,
      resume: student.resumeUrl ? 100 : 0,
    };

    if (latestAnalysis) {
      components.skillGap = latestAnalysis.overallReadinessScore || 0;
      // Formula: 40% skills, 40% profile completion, 20% resume presence
      placementReadinessScore = Math.round(
        components.skillGap * 0.4 +
          components.profile * 0.4 +
          components.resume * 0.2,
      );
    } else {
      placementReadinessScore = Math.round(
        components.profile * 0.7 + components.resume * 0.3,
      );
    }

    const studentData = student.toObject();
    studentData.placementReadinessScore = placementReadinessScore;
    studentData.readinessComponents = components;

    res.json({ student: studentData });
  } catch (err) {
    console.error("Fetch student profile error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get Student Skill Gap Analysis
router.get("/skill-gap", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ msg: "Student not found" });

    // Mock logic for gap analysis based on target role
    // In a real app, this would query a skills database mapping roles to skills
    const roleSkills = {
      "Full Stack Developer": ["React", "Node.js", "MongoDB", "System Design"],
      "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics"],
      SDE: ["DSA", "Java/C++", "System Design", "OS"],
    };

    const targetRole = student.targetRole || "Full Stack Developer"; // Default
    const requiredSkills = roleSkills[targetRole] || ["Communication"];
    const studentSkills = student.skills || [];

    const gaps = requiredSkills.filter(
      (skill) => !studentSkills.includes(skill),
    );
    const matchScore = Math.round(
      ((requiredSkills.length - gaps.length) / requiredSkills.length) * 100,
    );

    res.json({
      targetRole,
      matchScore,
      missingSkills: gaps,
      acquiredSkills: studentSkills.filter((skill) =>
        requiredSkills.includes(skill),
      ),
    });
  } catch (err) {
    console.error("Student features error:", err.message);
    res
      .status(500)
      .json({
        error: "Server Error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
  }
});

// Get Recommended & Filterable Alumni Mentors
router.get("/alumni", auth, async (req, res) => {
  try {
    const { company, skill, search } = req.query;
    const query = { isMentor: true };

    if (company && company !== "All") {
      query.company = new RegExp(company, "i");
    }
    if (skill) {
      query.skills = { $in: [new RegExp(skill, "i")] };
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
        { role: new RegExp(search, "i") },
      ];
    }

    const alumni = await Alumni.find(query).sort({ batch: -1 }).lean();
    res.json({ success: true, alumni });
  } catch (err) {
    console.error("Student features alumni error:", err.message);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Request Mentorship Session with Alumni
router.post("/alumni/:id/request", auth, async (req, res) => {
  try {
    const alumniId = req.params.id;
    const { requestType, topic, message, preferredDate } = req.body;

    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ error: "Student profile not found" });

    const alumni = await Alumni.findById(alumniId);
    if (!alumni) return res.status(404).json({ error: "Alumni mentor not found" });

    const booking = new MentorshipBooking({
      student: student._id,
      alumni: alumniId,
      requestType: requestType || "Mock Interview",
      topic,
      message,
      preferredDate: preferredDate || null,
      status: "pending",
    });

    await booking.save();
    res.status(201).json({
      success: true,
      booking,
      msg: `Mentorship request sent successfully to ${alumni.name}!`,
    });
  } catch (err) {
    console.error("Mentorship request error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get Student's Mentorship Requests History
router.get("/mentorship/my-requests", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ error: "Student profile not found" });

    const requests = await MentorshipBooking.find({ student: student._id })
      .populate("alumni", "name company role email linkedInProfile department batch")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    console.error("Fetch mentorship requests error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get Interview Experiences
router.get("/interviews", auth, async (req, res) => {
  try {
    const { company } = req.query;
    const query = {};
    if (company) query.company = new RegExp(company, "i");

    const experiences = await InterviewExperience.find(query).sort({
      createdAt: -1,
    });
    res.json(experiences);
  } catch (err) {
    console.error("Student features error:", err.message);
    res
      .status(500)
      .json({
        error: "Server Error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
  }
});

// Update Student Profile
router.put("/update-profile", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ msg: "Student profile not found" });
    }

    const {
      // Basic Info
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      // Academic Info
      college, // Added
      rollNumber, // Added
      collegeRollNumber, // Added
      department,
      degree,
      specialization,
      cgpa,
      graduationYear,
      admissionYear,
      currentSemester,
      activeBacklogs,
      clearedBacklogs,
      // Skills
      skills,
      // Links
      linkedinUrl,
      githubUrl,
      githubUsername,
      leetcodeUrl,
      leetcodeUsername,
      portfolioUrl,
      // Career Preferences
      targetRole,
      dreamCompanies, // Added
      willingToRelocate,
      preferredLocations,
      expectedSalaryMin,
      expectedSalaryMax,
      placementStatus,
      visibilityPreferences,
      // Address
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    // Basic Info
    if (firstName !== undefined) student.firstName = String(firstName).trim();
    if (lastName !== undefined) student.lastName = String(lastName).trim();
    if (phone !== undefined) student.phone = String(phone).trim();
    if (dateOfBirth !== undefined)
      student.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    if (gender !== undefined) student.gender = gender;

    // College Handling
    if (college !== undefined) {
      if (typeof college === "string" && college.trim().length >= 2) {
        const cleanCollegeName = college.trim();
        let collegeDoc = await College.findOne({
          name: new RegExp(
            "^" + cleanCollegeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$",
            "i",
          ),
        });

        if (!collegeDoc) {
          try {
            collegeDoc = new College({
              name: cleanCollegeName,
              isVerified: false,
            });
            await collegeDoc.save();
          } catch (err) {
            console.error("Error auto-creating college", err);
          }
        }

        if (collegeDoc) {
          student.college = collegeDoc._id;
        }
      } else if (college === null || college === "") {
        student.college = undefined;
      }
    }

    // Academic Info
    if (rollNumber !== undefined) student.rollNumber = String(rollNumber).trim();
    if (collegeRollNumber !== undefined)
      student.collegeRollNumber = String(collegeRollNumber).trim();
    if (department !== undefined)
      student.department = String(department).trim();
    if (degree !== undefined) student.degree = String(degree).trim();
    if (specialization !== undefined)
      student.specialization = String(specialization).trim();
    if (cgpa !== undefined)
      student.cgpa = cgpa !== "" ? parseFloat(cgpa) : undefined;
    if (graduationYear !== undefined) {
      const yr = parseInt(graduationYear, 10);
      student.graduationYear = yr;
      student.year = yr;
    }
    if (admissionYear !== undefined)
      student.admissionYear = parseInt(admissionYear, 10);
    if (currentSemester !== undefined)
      student.currentSemester = parseInt(currentSemester, 10);
    if (activeBacklogs !== undefined)
      student.activeBacklogs = parseInt(activeBacklogs, 10) || 0;
    if (clearedBacklogs !== undefined)
      student.clearedBacklogs = parseInt(clearedBacklogs, 10) || 0;

    // Skills – normalize to {skillName, proficiencyLevel}
    if (Array.isArray(skills)) {
      student.skills = skills
        .filter(
          (s) => s && (typeof s === "string" ? s.trim() : s.skillName?.trim()),
        )
        .map((s) =>
          typeof s === "string"
            ? { skillName: s.trim(), proficiencyLevel: "intermediate" }
            : {
                skillName: String(s.skillName || "").trim(),
                proficiencyLevel: s.proficiencyLevel || "intermediate",
              },
        );
    }

    // Links
    if (linkedinUrl !== undefined)
      student.linkedinUrl = String(linkedinUrl).trim();
    if (githubUrl !== undefined) student.githubUrl = String(githubUrl).trim();
    if (githubUsername !== undefined)
      student.githubUsername = String(githubUsername).trim();
    if (leetcodeUrl !== undefined)
      student.leetcodeUrl = String(leetcodeUrl).trim();
    if (leetcodeUsername !== undefined)
      student.leetcodeUsername = String(leetcodeUsername).trim();
    if (portfolioUrl !== undefined)
      student.portfolioUrl = String(portfolioUrl).trim();

    // Career
    if (targetRole !== undefined)
      student.targetRole = String(targetRole).trim();
    if (Array.isArray(dreamCompanies)) student.dreamCompanies = dreamCompanies;
    if (willingToRelocate !== undefined)
      student.willingToRelocate = Boolean(willingToRelocate);
    if (Array.isArray(preferredLocations))
      student.preferredLocations = preferredLocations;
    if (expectedSalaryMin !== undefined)
      student.expectedSalaryMin =
        expectedSalaryMin !== "" ? parseFloat(expectedSalaryMin) : undefined;
    if (expectedSalaryMax !== undefined)
      student.expectedSalaryMax =
        expectedSalaryMax !== "" ? parseFloat(expectedSalaryMax) : undefined;

    if (placementStatus !== undefined) student.placementStatus = placementStatus;
    if (visibilityPreferences !== undefined) {
      if (!student.visibilityPreferences) student.visibilityPreferences = {};
      if (visibilityPreferences.showPlacementScore !== undefined)
        student.visibilityPreferences.showPlacementScore = Boolean(visibilityPreferences.showPlacementScore);
      if (visibilityPreferences.showLearningPaths !== undefined)
        student.visibilityPreferences.showLearningPaths = Boolean(visibilityPreferences.showLearningPaths);
      if (visibilityPreferences.showCgpa !== undefined)
        student.visibilityPreferences.showCgpa = Boolean(visibilityPreferences.showCgpa);
    }

    // Address
    if (addressLine1 !== undefined)
      student.addressLine1 = String(addressLine1).trim();
    if (addressLine2 !== undefined)
      student.addressLine2 = String(addressLine2).trim();
    if (city !== undefined) student.city = String(city).trim();
    if (state !== undefined) student.state = String(state).trim();
    if (pincode !== undefined) student.pincode = String(pincode).trim();
    if (country !== undefined) student.country = String(country).trim();

    await student.save();

    // Return fresh populated student
    const updated = await Student.findById(student._id)
      .populate("user", "-password")
      .populate("college", "name location tier");

    res.json({ msg: "Profile updated successfully", student: updated });
  } catch (err) {
    console.error("Update profile error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((v) => v.message);
      return res.status(400).json({ msg: messages.join(" | ") });
    }
    res.status(500).json({ error: "Server Error" });
  }
});

// ── Campus Drives (Student side) ─────────────────────────────────────────────

// Get all active/upcoming drives for the student's college
router.get("/drives", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student || !student.college) {
      return res.status(404).json({ msg: "Student or associated college not found" });
    }

    const drives = await CampusDrive.find({
      college: student.college,
      status: { $in: ["active", "upcoming"] },
    }).sort({ createdAt: -1 });

    res.json(drives);
  } catch (err) {
    console.error("Error fetching campus drives:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all applications for the student
router.get("/drives/applications", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const applications = await DriveApplication.find({ student: student._id })
      .populate("drive", "company title date status eligibility rounds")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching student applications:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Apply to a specific drive
router.post("/drives/:id/apply", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const drive = await CampusDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ msg: "Drive not found" });

    // Validate college
    if (drive.college.toString() !== student.college.toString()) {
      return res.status(403).json({ msg: "You can only apply to drives from your college" });
    }

    // Validate CGPA eligibility
    const requiredCgpa = drive.eligibility?.minCGPA || 0;
    const studentCgpa = student.cgpa || 0;
    if (studentCgpa < requiredCgpa) {
      return res.status(400).json({ msg: `You need a minimum CGPA of ${requiredCgpa} to apply.` });
    }

    // Check for existing application
    const existingApp = await DriveApplication.findOne({
      drive: drive._id,
      student: student._id,
    });
    if (existingApp) {
      return res.status(400).json({ msg: "You have already applied to this drive" });
    }

    const newApp = new DriveApplication({
      drive: drive._id,
      student: student._id,
      status: "Applied",
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error("Error applying to drive:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Student responds to an offer ("accept" or "decline")
router.put("/drives/applications/:appId/offer-response", auth, async (req, res) => {
  try {
    const { decision } = req.body; // "accept" | "decline"
    if (!["accept", "decline"].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision. Must be 'accept' or 'decline'." });
    }

    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const application = await DriveApplication.findOne({
      _id: req.params.appId,
      student: student._id,
    }).populate("drive");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "Offered") {
      return res.status(400).json({ error: "Can only respond to applications in 'Offered' stage." });
    }

    application.offerResponse = decision === "accept" ? "accepted" : "declined";
    application.offerRespondedAt = new Date();
    application.updatedAt = new Date();

    if (decision === "accept") {
      // Update student placed status & package
      const studentUpdates = { isPlaced: true, placementStatus: "placed" };
      if (application.offerDetails?.ctc) {
        const numMatch = application.offerDetails.ctc.match(/[\d.]+/);
        if (numMatch) studentUpdates.placementPackage = parseFloat(numMatch[0]);
      }
      await Student.findByIdAndUpdate(student._id, { $set: studentUpdates });

      // Notify recruiter if present
      if (application.drive?.recruiter) {
        await Notification.create({
          recipient: application.drive.recruiter,
          recipientRole: "recruiter",
          title: "Offer Accepted! 🎉",
          message: `${student.firstName || "A candidate"} ${student.lastName || ""} has officially accepted your offer for ${application.drive.title} (${application.drive.company})!`,
          category: "placement",
          link: "/recruiter/drives",
        });
      }
    } else {
      application.status = "Rejected";

      // Notify recruiter
      if (application.drive?.recruiter) {
        await Notification.create({
          recipient: application.drive.recruiter,
          recipientRole: "recruiter",
          title: "Offer Declined",
          message: `${student.firstName || "A candidate"} ${student.lastName || ""} has declined the offer for ${application.drive.title}.`,
          category: "placement",
          link: "/recruiter/drives",
        });
      }
    }

    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    console.error("Error updating offer response:", err);
    res.status(500).json({ error: "Failed to process offer response" });
  }
});

// Dynamic Aptitude Assessment Generator (Randomized subset per candidate)
router.get("/drives/applications/:appId/aptitude-questions", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const application = await DriveApplication.findOne({
      _id: req.params.appId,
      student: student._id,
    }).populate("drive");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "Aptitude Test") {
      return res.status(400).json({ error: "Application is not in Aptitude Test stage." });
    }

    // Attempt to pull questions from MongoDB QuestionBank; fallback to SEED_QUESTIONS
    let pool = await QuestionBank.find().lean();
    if (!pool || pool.length === 0) {
      pool = SEED_QUESTIONS;
    }

    // Partition into sections
    const quantPool = pool.filter((q) => q.category === "Quantitative Aptitude");
    const logicalPool = pool.filter((q) => q.category === "Logical Reasoning");
    const techPool = pool.filter((q) =>
      q.category.includes("Technical") || q.category.includes("Web")
    );

    // Shuffle helper
    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    // Sample 7 Quant, 7 Logical, 10 Technical => 24 questions total
    const sampledQuant = shuffle(quantPool.length >= 7 ? quantPool : pool).slice(0, 7);
    const sampledLogical = shuffle(logicalPool.length >= 7 ? logicalPool : pool).slice(0, 7);
    const sampledTech = shuffle(techPool.length >= 10 ? techPool : pool).slice(0, 10);

    const combinedQuestions = [...sampledQuant, ...sampledLogical, ...sampledTech];

    // Strip out correctOptionIndex and explanation to prevent inspect-element cheating
    const secureQuestions = combinedQuestions.map((q, idx) => ({
      id: q._id ? q._id.toString() : `q_${idx}`,
      index: idx,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
    }));

    res.json({
      success: true,
      totalQuestions: secureQuestions.length,
      timeLimitMinutes: 20, // 20 minutes for 24 questions
      questions: secureQuestions,
      sections: [
        { name: "Quantitative Aptitude", count: sampledQuant.length },
        { name: "Logical Reasoning", count: sampledLogical.length },
        { name: "Core Technical & CS", count: sampledTech.length },
      ],
    });
  } catch (err) {
    console.error("Error generating dynamic aptitude test:", err);
    res.status(500).json({ error: "Failed to generate assessment questions" });
  }
});

// Student takes & submits Aptitude Test with Sectional Grading & Anti-Cheat validation
router.post("/drives/applications/:appId/submit-aptitude", auth, async (req, res) => {
  try {
    const {
      answers = {},
      tabSwitchCount = 0,
      antiCheatFlags = [],
      proctoringMetrics = {},
    } = req.body;
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const application = await DriveApplication.findOne({
      _id: req.params.appId,
      student: student._id,
    }).populate("drive");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Load full question bank with answer keys
    let pool = await QuestionBank.find().lean();
    if (!pool || pool.length === 0) {
      pool = SEED_QUESTIONS;
    }

    // Create lookup by string ID or question text
    const poolMap = new Map();
    pool.forEach((q, idx) => {
      if (q._id) poolMap.set(q._id.toString(), q);
      poolMap.set(`q_${idx}`, q);
      poolMap.set(q.question.trim(), q);
    });

    let totalScore = 0;
    let totalEvaluated = 0;
    const sectionalScores = {
      quantitative: { score: 0, total: 0 },
      logical: { score: 0, total: 0 },
      technical: { score: 0, total: 0 },
    };

    const reviewDetails = [];

    // Evaluate answers
    Object.entries(answers).forEach(([qKey, selectedOptionIdx]) => {
      const qDoc = poolMap.get(qKey);
      if (!qDoc) return;

      totalEvaluated++;
      const isCorrect = Number(selectedOptionIdx) === qDoc.correctOptionIndex;
      if (isCorrect) totalScore++;

      // Section classification
      if (qDoc.category.includes("Quant")) {
        sectionalScores.quantitative.total++;
        if (isCorrect) sectionalScores.quantitative.score++;
      } else if (qDoc.category.includes("Logic")) {
        sectionalScores.logical.total++;
        if (isCorrect) sectionalScores.logical.score++;
      } else {
        sectionalScores.technical.total++;
        if (isCorrect) sectionalScores.technical.score++;
      }

      reviewDetails.push({
        question: qDoc.question,
        category: qDoc.category,
        userAnswer: qDoc.options[selectedOptionIdx] || "Unanswered",
        correctAnswer: qDoc.options[qDoc.correctOptionIndex],
        isCorrect,
        explanation: qDoc.explanation || "",
      });
    });

    // In case no answers were answered or sparse submission
    const finalTotal = totalEvaluated > 0 ? totalEvaluated : 24;
    const percentage = Math.round((totalScore / finalTotal) * 100);

    const safeProctoring = {
      avgPostureScore: Number(proctoringMetrics.avgPostureScore) || 0,
      avgEyeContactScore: Number(proctoringMetrics.avgEyeContactScore) || 0,
      multipleFaceEvents: Number(proctoringMetrics.multipleFaceEvents) || 0,
      faceMissingEvents: Number(proctoringMetrics.faceMissingEvents) || 0,
      webcamStatus: proctoringMetrics.webcamStatus || "inactive",
    };

    const flags = [...antiCheatFlags];
    if (tabSwitchCount > 0) {
      flags.push(`Candidate switched browser tabs ${tabSwitchCount} times`);
    }
    if (safeProctoring.multipleFaceEvents >= 3) {
      flags.push(`AI Vision Alert: Multiple persons detected in camera view (${safeProctoring.multipleFaceEvents} times)`);
    }
    if (safeProctoring.faceMissingEvents >= 5) {
      flags.push(`AI Vision Alert: Candidate absent from webcam frame (${safeProctoring.faceMissingEvents} times)`);
    }

    // Anti-cheat disqualification threshold (>= 4 tab switches OR >= 5 multiple face violations fails automatically)
    const disqualifiedByCheating = tabSwitchCount >= 4 || safeProctoring.multipleFaceEvents >= 5;
    const passed = percentage >= 60 && !disqualifiedByCheating;

    if (disqualifiedByCheating) {
      if (tabSwitchCount >= 4) {
        flags.push("Disqualified: Excessive background tab switches detected");
      }
      if (safeProctoring.multipleFaceEvents >= 5) {
        flags.push("Disqualified: Persistent multiple persons detected in camera stream");
      }
    }

    application.aptitudeScore = {
      score: totalScore,
      total: finalTotal,
      percentage,
      passed,
      attemptedAt: new Date(),
      sectionalBreakdown: sectionalScores,
      tabSwitchCount: Number(tabSwitchCount),
      antiCheatFlags: flags,
      proctoringMetrics: safeProctoring,
    };
    application.updatedAt = new Date();

    if (passed) {
      application.status = "Technical Interview";

      // Seed rubric on scorecard
      application.interviewScorecard = application.interviewScorecard || {};
      application.interviewScorecard.problemSolving = Math.min(
        5,
        Math.max(3, Math.round((percentage / 100) * 5))
      );

      // Student notification
      await Notification.create({
        recipient: req.user.userId,
        recipientRole: "student",
        title: "Aptitude Round Cleared! 🎉",
        message: `Congratulations! You scored ${percentage}% in the Aptitude Assessment for ${
          application.drive?.title || "Placement Drive"
        } and advanced to Technical Interview.`,
        category: "interview",
        link: "/student/drives",
      });
    } else {
      application.status = "Rejected";

      const failMsg = disqualifiedByCheating
        ? "Assessment terminated: Repeated browser tab switches triggered anti-cheat policy."
        : `You scored ${percentage}% in the Aptitude Assessment for ${
            application.drive?.title || "Placement Drive"
          }. The qualifying cutoff was 60%.`;

      await Notification.create({
        recipient: req.user.userId,
        recipientRole: "student",
        title: "Aptitude Assessment Result",
        message: failMsg,
        category: "interview",
        link: "/student/drives",
      });
    }

    await application.save();
    res.json({
      success: true,
      passed,
      disqualifiedByCheating,
      score: totalScore,
      total: finalTotal,
      percentage,
      sectionalBreakdown: sectionalScores,
      tabSwitchCount,
      newStatus: application.status,
      reviewDetails,
      application,
    });
  } catch (err) {
    console.error("Error submitting aptitude assessment:", err);
    res.status(500).json({ error: "Failed to submit assessment" });
  }
});

module.exports = router;


