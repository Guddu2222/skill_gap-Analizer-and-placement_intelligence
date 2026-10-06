const mongoose = require("mongoose");
const studentSkillSchema = require("./StudentSkill");

const educationSchema = new mongoose.Schema(
  {
    institutionName: { type: String, required: true },
    board: { type: String, required: true },
    percentage: { type: Number, required: true },
    yearOfPassing: { type: Number, required: true },
    stream: { type: String }, // mainly for 12th
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  type: {
    type: String,
    enum: ["internship", "full_time", "part_time", "freelance"],
    required: true,
  },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectType: {
    type: String,
    enum: ["academic", "personal", "professional", "open_source"],
    required: true,
  },
  githubUrl: { type: String },
  projectUrl: { type: String },
});

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },

    // Basic Info
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    profilePicture: { type: String },

    // Academic Info
    rollNumber: { type: String, required: true }, // University / Exam Roll Number
    collegeRollNumber: { type: String, default: "" }, // College Internal Roll Number
    department: { type: String, required: true },
    degree: { type: String },
    specialization: { type: String },
    admissionYear: { type: Number },
    year: { type: Number, required: true }, // mostly synonymous with current year
    graduationYear: { type: Number }, // alias / preferred for display
    currentSemester: { type: Number },
    cgpa: { type: Number },
    activeBacklogs: { type: Number, default: 0 },
    clearedBacklogs: { type: Number, default: 0 },

    // Education History
    education10th: { type: educationSchema },
    education12th: { type: educationSchema },

    // Skills & Links
    skills: {
      type: [studentSkillSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v.every(
            (s) =>
              (typeof s === "string" && s.length > 0) ||
              (s && typeof s.skillName === "string"),
          );
        },
        message: "Skills must be strings or objects with skillName",
      },
    },
    resume: { type: String },
    resumeUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    githubUsername: { type: String },
    leetcodeUrl: { type: String },
    leetcodeUsername: { type: String },
    portfolioUrl: { type: String },

    // Target & Preferences
    targetDomain: { type: String, default: "Software Engineer" },
    targetRole: { type: String },
    dreamCompanies: { type: [String] },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },
    preferredLocations: { type: [String] },
    expectedSalaryMin: { type: Number },
    expectedSalaryMax: { type: Number },
    willingToRelocate: { type: Boolean, default: true },

    // Arrays
    experiences: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    applications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    ],

    // Placement Tracked Info
    placementStatus: {
      type: String,
      enum: ["eligible", "applying", "placed", "opted_out", "unplaced"],
      default: "eligible",
    },
    visibilityPreferences: {
      showPlacementScore: { type: Boolean, default: true },
      showLearningPaths: { type: Boolean, default: true },
      showCgpa: { type: Boolean, default: false },
    },
    isPlaced: { type: Boolean, default: false },
    placementPackage: { type: Number }, // CTC in lakhs
    placedCompany: { type: String },

    // Calculated Fields
    profileCompletionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Pre-save hook to calculate profile completion
studentSchema.pre("save", function (next) {
  const student = this;

  // Core required fields (70% weight total)
  const coreChecks = [
    Boolean(student.firstName && String(student.firstName).trim()),
    Boolean(student.lastName && String(student.lastName).trim()),
    Boolean(student.email && String(student.email).trim()),
    Boolean(student.phone && String(student.phone).trim()),
    Boolean(student.rollNumber && String(student.rollNumber).trim()),
    Boolean(student.department && String(student.department).trim()),
    Boolean(student.degree && String(student.degree).trim()),
    student.graduationYear != null && Number(student.graduationYear) > 0,
    student.cgpa != null && !isNaN(Number(student.cgpa)) && Number(student.cgpa) >= 0,
    Boolean((student.resumeUrl || student.resume) && String(student.resumeUrl || student.resume).trim()),
    Array.isArray(student.skills) && student.skills.length > 0,
    Boolean(student.targetRole && String(student.targetRole).trim()),
  ];

  // Optional supplementary fields (30% weight total)
  const optionalChecks = [
    Boolean(student.dateOfBirth),
    Boolean(student.gender && student.gender !== "prefer_not_to_say"),
    Boolean(student.profilePicture && String(student.profilePicture).trim()),
    Boolean(student.college),
    Boolean(student.education10th && (student.education10th.institutionName || student.education10th.percentage)),
    Boolean(student.education12th && (student.education12th.institutionName || student.education12th.percentage)),
    Boolean((student.linkedinUrl || student.linkedin) && String(student.linkedinUrl || student.linkedin).trim()),
    Boolean((student.githubUrl || student.githubUsername) && String(student.githubUrl || student.githubUsername).trim()),
    Boolean((student.leetcodeUrl || student.leetcodeUsername) && String(student.leetcodeUrl || student.leetcodeUsername).trim()),
    Boolean(student.portfolioUrl && String(student.portfolioUrl).trim()),
    Boolean(student.addressLine1 && String(student.addressLine1).trim()),
    Boolean(student.city && String(student.city).trim()),
    Boolean(student.state && String(student.state).trim()),
    Array.isArray(student.dreamCompanies) && student.dreamCompanies.length > 0,
    Array.isArray(student.preferredLocations) && student.preferredLocations.length > 0,
    Array.isArray(student.experiences) && student.experiences.length > 0,
    Array.isArray(student.projects) && student.projects.length > 0,
  ];

  const corePassed = coreChecks.filter(Boolean).length;
  const optionalPassed = optionalChecks.filter(Boolean).length;

  const coreScore = (corePassed / coreChecks.length) * 70;
  const optionalScore = (optionalPassed / optionalChecks.length) * 30;

  student.profileCompletionPercentage = Math.min(100, Math.round(coreScore + optionalScore));
  next();
});

// Indexes
studentSchema.index({ college: 1, department: 1 });
studentSchema.index({ college: 1, placementStatus: 1 });
studentSchema.index({ college: 1, graduationYear: 1 });

module.exports = mongoose.model("Student", studentSchema);
