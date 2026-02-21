
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rollNumber: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  cgpa: { type: Number },
  skills: { type: [String], default: [] },
  targetRole: { type: String }, // e.g., "Full Stack Developer"
  dreamCompanies: { type: [String] },
  resume: { type: String }, // URL to resume
  placementStatus: { type: String, enum: ['placed', 'unplaced', 'opted_out'], default: 'unplaced' },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
});

module.exports = mongoose.model('Student', studentSchema);
