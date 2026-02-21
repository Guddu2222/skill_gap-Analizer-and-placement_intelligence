
const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  batch: { type: Number, required: true }, // e.g., 2022
  department: { type: String, required: true },
  linkedInProfile: { type: String },
  email: { type: String },
  skills: { type: [String], default: [] },
  isMentor: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alumni', alumniSchema);
