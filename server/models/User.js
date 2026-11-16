const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Password is optional — social-login users (Google/LinkedIn) have no password
  password: { type: String, required: false, default: null },
  role: {
    type: String,
    enum: ["student", "college_admin", "recruiter", "super_admin"],
    required: true,
  },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  company: { type: String },
  designation: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  bio: { type: String, default: "" },
  hiringInterests: [{ type: String }],
  notifPrefs: {
    driveAccepted: { type: Boolean, default: true },
    driveRejected: { type: Boolean, default: true },
    newCandidate: { type: Boolean, default: false },
  },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // ── OAuth fields ──────────────────────────────────────────
  googleId: { type: String, default: null, sparse: true },
  linkedinId: { type: String, default: null, sparse: true },
  avatar: { type: String, default: null }, // profile picture from OAuth provider

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
