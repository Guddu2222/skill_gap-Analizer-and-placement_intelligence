const mongoose = require('mongoose');

const skillGapAnalysisSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  targetDomain: { 
    type: String, 
    required: true 
  },
  targetRole: { 
    type: String 
  },
  
  // Current State
  currentSkills: [{
    skill: String,
    proficiency: String,
    years: Number
  }],
  overallReadinessScore: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  
  // Gap Analysis Results
  missingSkills: [{
    skill: String,
    priority: String,
    reasoning: String,
    difficulty: String,
    estimatedLearningTime: String
  }],
  skillsToImprove: [{
    skill: String,
    currentLevel: String,
    requiredLevel: String,
    improvementPriority: String,
    reasoning: String
  }],
  strongSkills: [{
    skill: String,
    strengthLevel: String,
    marketDemand: String,
    leverageAdvice: String
  }],
  
  // AI Analysis
  aiAnalysisRaw: { 
    type: String 
  },
  analysisSummary: { 
    type: String 
  },
  priorityLearningPath: [{
    type: String
  }],
  careerAdvice: {
    type: String
  },
  marketAlignmentScore: { 
    type: Number, 
    min: 0, 
    max: 100 
  },
  
  // Recommendations
  recommendedCourses: [{
    title: String,
    platform: String,
    url: String,
    duration: String,
    price: String
  }],
  recommendedCertifications: [{
    name: String,
    issuer: String,
    url: String
  }],
  estimatedTimeToReady: { 
    type: Number // in weeks
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);
