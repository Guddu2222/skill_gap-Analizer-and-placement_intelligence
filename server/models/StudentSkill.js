const mongoose = require('mongoose');

const studentSkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  proficiencyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
  yearsOfExperience: { type: Number },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String }, // certification, test, project, etc.
  skillCategory: {
    type: String,
    enum: [
      'programming_language',
      'framework',
      'database',
      'cloud',
      'devops',
      'soft_skill',
      'domain_knowledge',
    ],
  },
}, { _id: true });

module.exports = studentSkillSchema;
