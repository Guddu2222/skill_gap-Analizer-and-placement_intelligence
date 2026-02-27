const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emailDomain: { type: String, required: false, unique: true, sparse: true }, // e.g. "mit.edu", "stanford.edu"
  location: { type: String },
  tier: { type: String, enum: ['tier1', 'tier2', 'tier3'], default: 'tier2' },
  logoUrl: { type: String },
  website: { type: String },
  totalStudents: { type: Number, default: 0 },
  placedStudents: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
