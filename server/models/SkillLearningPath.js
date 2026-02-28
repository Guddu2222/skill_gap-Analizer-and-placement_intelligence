const mongoose = require('mongoose');

const skillLearningPathSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  gapAnalysis: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SkillGapAnalysis', 
    required: true 
  },
  skillName: { 
    type: String, 
    required: true 
  },
  currentLevel: { 
    type: String, 
    enum: ['none', 'beginner', 'intermediate', 'advanced', 'expert'] 
  },
  targetLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'], 
    required: true 
  },
  
  // Learning Resources
  learningResources: [{
    title: String,
    url: String,
    type: { type: String }, // course/article/video
    duration: String
  }],
  milestones: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    completedDate: Date
  }],
  
  // Progress
  progressPercentage: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed', 'abandoned'], 
    default: 'not_started' 
  },
  startedAt: Date,
  completedAt: Date,
  estimatedCompletionDate: Date
}, { timestamps: true });

module.exports = mongoose.model('SkillLearningPath', skillLearningPathSchema);
