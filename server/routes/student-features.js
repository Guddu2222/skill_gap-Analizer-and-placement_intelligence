const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Job = require("../models/Job");
const Alumni = require("../models/Alumni");
const InterviewExperience = require("../models/InterviewExperience");
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

// Get Recommended Alumni
router.get("/alumni", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    // Find alumni in dream companies or same department
    const query = {};
    if (
      student &&
      student.dreamCompanies &&
      student.dreamCompanies.length > 0
    ) {
      query.company = { $in: student.dreamCompanies };
    }

    const alumni = await Alumni.find(query).limit(10);
    res.json(alumni);
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

    // Academic Info
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

module.exports = router;
