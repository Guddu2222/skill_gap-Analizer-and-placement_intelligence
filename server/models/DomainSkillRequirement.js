const mongoose = require('mongoose');

const domainSkillRequirementSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  },
  experienceLevel: { 
    type: String, 
    enum: ['entry', 'mid', 'senior'], 
    default: 'entry' 
  },
  
  // Required Skills with weights
  coreSkills: [{
    skill: String,
    weight: Number,
    minProficiency: String
  }],
  preferredSkills: [{
    skill: String,
    weight: Number,
    minProficiency: String
  }],
  niceToHaveSkills: [{
    skill: String,
    weight: Number,
    minProficiency: String
  }],
  
  // Market Data
  avgSalaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  demandScore: { 
    type: Number, // 0-100 based on job postings
    min: 0,
    max: 100
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Create compound index for fast lookups
domainSkillRequirementSchema.index({ domain: 1, role: 1, experienceLevel: 1 }, { unique: true });

module.exports = mongoose.model('DomainSkillRequirement', domainSkillRequirementSchema);
