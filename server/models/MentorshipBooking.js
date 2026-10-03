const mongoose = require("mongoose");

const mentorshipBookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
  },
  requestType: {
    type: String,
    enum: ["Mock Interview", "Domain Guidance", "Resume Review", "Career Referral"],
    default: "Mock Interview",
  },
  topic: { type: String, required: true },
  message: { type: String, required: true },
  preferredDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MentorshipBooking", mentorshipBookingSchema);
