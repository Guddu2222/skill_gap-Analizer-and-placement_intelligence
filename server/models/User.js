
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'college_admin', 'recruiter', 'super_admin'], required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // For students and college admins
  company: { type: String }, // For recruiters
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
