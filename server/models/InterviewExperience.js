
const mongoose = require('mongoose');

const interviewExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  studentName: { type: String }, // Optional, could be anonymous
  batch: { type: Number },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  rounds: [{
    roundName: { type: String }, // e.g., "Online Assessment", "Technical 1"
    questions: { type: [String] },
    description: { type: String }
  }],
  outcome: { type: String, enum: ['Selected', 'Rejected', 'Pending'] },
  tips: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);
