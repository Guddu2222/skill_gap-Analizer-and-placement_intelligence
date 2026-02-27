const mongoose = require('mongoose');

const savedCandidateSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  folderName: { type: String, default: 'General' },
  notes: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  status: {
    type: String,
    enum: ['saved', 'contacted', 'interviewing', 'offered', 'hired', 'rejected'],
    default: 'saved',
  },
}, { timestamps: true });

// Prevent duplicate saves by same recruiter
savedCandidateSchema.index({ recruiter: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('SavedCandidate', savedCandidateSchema);
