const mongoose = require("mongoose");

const driveApplicationSchema = new mongoose.Schema({
  drive: { type: mongoose.Schema.Types.ObjectId, ref: "CampusDrive", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  status: {
    type: String,
    default: "Applied", // Should match one of the rounds in the CampusDrive or be "Rejected"
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on save
driveApplicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("DriveApplication", driveApplicationSchema);
