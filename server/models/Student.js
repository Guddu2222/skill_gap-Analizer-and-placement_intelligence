const mongoose = require('mongoose');
const studentSkillSchema = require('./StudentSkill');

const educationSchema = new mongoose.Schema({
  institutionName: { type: String, required: true },
  board: { type: String, required: true },
  percentage: { type: Number, required: true },
  yearOfPassing: { type: Number, required: true },
  stream: { type: String } // mainly for 12th
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, enum: ['internship', 'full_time', 'part_time', 'freelance'], required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  projectType: { type: String, enum: ['academic', 'personal', 'professional', 'open_source'], required: true },
  githubUrl: { type: String },
  projectUrl: { type: String }
});

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  
  // Basic Info
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  profilePicture: { type: String },

  // Academic Info
  rollNumber: { type: String, required: true },
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
            (typeof s === 'string' && s.length > 0) ||
            (s && typeof s.skillName === 'string')
        );
      },
      message: 'Skills must be strings or objects with skillName',
    },
  },
  resume: { type: String },
  resumeUrl: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  portfolioUrl: { type: String },
  
  // Target & Preferences
  targetRole: { type: String },
  dreamCompanies: { type: [String] },
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String, default: 'India' },
  preferredLocations: { type: [String] },
  expectedSalaryMin: { type: Number },
  expectedSalaryMax: { type: Number },
  willingToRelocate: { type: Boolean, default: true },

  // Arrays
  experiences: { type: [experienceSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],

  // Placement Tracked Info
  placementStatus: {
    type: String,
    enum: ['eligible', 'applying', 'placed', 'opted_out', 'unplaced'],
    default: 'eligible',
  },
  isPlaced: { type: Boolean, default: false },
  placementPackage: { type: Number }, // CTC in lakhs
  placedCompany: { type: String },
  
  // Calculated Fields
  profileCompletionPercentage: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to calculate profile completion
studentSchema.pre('save', function (next) {
  const student = this;
  
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'rollNumber',
    'department', 'degree', 'graduationYear', 'cgpa', 'resumeUrl'
  ];
  
  const optionalFields = [
    'dateOfBirth', 'gender', 'profilePicture', 'linkedinUrl',
    'githubUrl', 'portfolioUrl', 'education10th', 'education12th',
    'city', 'state'
  ];
  
  let completedRequired = 0;
  requiredFields.forEach(field => {
    if (student[field]) completedRequired++;
  });
  
  let completedOptional = 0;
  optionalFields.forEach(field => {
    if (student[field]) completedOptional++;
  });
  
  const requiredWeight = 70;
  const optionalWeight = 30;
  
  const completion = (
    (completedRequired / requiredFields.length) * requiredWeight +
    (completedOptional / optionalFields.length) * optionalWeight
  );
  
  student.profileCompletionPercentage = Math.round(completion);
  next();
});

// Indexes
studentSchema.index({ college: 1, department: 1 });
studentSchema.index({ college: 1, placementStatus: 1 });
studentSchema.index({ college: 1, graduationYear: 1 });

module.exports = mongoose.model('Student', studentSchema);
