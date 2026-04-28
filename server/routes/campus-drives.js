const express = require("express");
const router = express.Router();
const CampusDrive = require("../models/CampusDrive");
const DriveApplication = require("../models/DriveApplication");
const Student = require("../models/Student");
const auth = require("../middleware/auth");
const { roleCheck } = require("../middleware/auth");

// GET all campus drives for the college
router.get("/", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) return res.status(403).json({ error: "College not associated" });

    const drives = await CampusDrive.find({ college: collegeId }).sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    console.error("Error fetching campus drives:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new campus drive
router.post("/", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) return res.status(403).json({ error: "College not associated" });

    const newDrive = new CampusDrive({
      ...req.body,
      college: collegeId,
    });
    const savedDrive = await newDrive.save();
    res.status(201).json(savedDrive);
  } catch (error) {
    console.error("Error creating campus drive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET specific drive details
router.get("/:id", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const drive = await CampusDrive.findOne({ _id: req.params.id, college: req.user.collegeId });
    if (!drive) return res.status(404).json({ error: "Drive not found" });
    res.json(drive);
  } catch (error) {
    console.error("Error fetching drive details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET applications for a specific drive
router.get("/:id/applications", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const applications = await DriveApplication.find({ drive: req.params.id })
      .populate("student", "firstName lastName email rollNumber department cgpa skills")
      .sort({ appliedAt: -1 });
    
    // Group applications by status for the Kanban board
    const grouped = applications.reduce((acc, app) => {
      if (!acc[app.status]) acc[app.status] = [];
      acc[app.status].push(app);
      return acc;
    }, {});

    res.json({ applications: grouped, flat: applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST add/apply student to drive (Manual add by TPO)
router.post("/:id/apply", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const { studentId } = req.body;
    const driveId = req.params.id;

    const drive = await CampusDrive.findById(driveId);
    if (!drive) return res.status(404).json({ error: "Drive not found" });

    const existingApp = await DriveApplication.findOne({ drive: driveId, student: studentId });
    if (existingApp) return res.status(400).json({ error: "Student already added to this drive" });

    const newApp = new DriveApplication({
      drive: driveId,
      student: studentId,
      status: "Applied" // default status
    });

    const savedApp = await newApp.save();
    
    const populatedApp = await savedApp.populate("student", "firstName lastName email rollNumber department cgpa skills");
    res.status(201).json(populatedApp);
  } catch (error) {
    console.error("Error adding student to drive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update application status (drag and drop)
router.put("/:id/applications/:appId/status", auth, roleCheck(["college_admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const app = await DriveApplication.findOneAndUpdate(
      { _id: req.params.appId, drive: req.params.id },
      { status },
      { new: true }
    ).populate("student", "firstName lastName email rollNumber department cgpa skills");

    if (!app) return res.status(404).json({ error: "Application not found" });

    res.json(app);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
