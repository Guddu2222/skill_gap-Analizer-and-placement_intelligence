const mongoose = require("mongoose");

const driveRequestSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DriveRequest", driveRequestSchema);
