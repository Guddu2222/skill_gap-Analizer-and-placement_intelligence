const express = require("express");
const router = express.Router();
const College = require("../models/College");

// GET /api/colleges - Fetch registered colleges (supports ?search=... or ?q=...)
router.get("/", async (req, res) => {
  try {
    const { search, q } = req.query;
    const queryTerm = search || q;

    const filter = {};
    if (queryTerm && typeof queryTerm === "string" && queryTerm.trim()) {
      const regex = new RegExp(queryTerm.trim(), "i");
      filter.$or = [
        { name: regex },
        { location: regex },
        { emailDomain: regex },
      ];
    }

    const colleges = await College.find(filter)
      .sort({ name: 1 })
      .lean();

    // Map to ensure both id and _id are explicitly available and formatted cleanly
    const formattedColleges = colleges.map((c) => ({
      ...c,
      id: c._id ? c._id.toString() : "",
      _id: c._id ? c._id.toString() : "",
    }));

    res.json(formattedColleges);
  } catch (err) {
    console.error("Error fetching colleges:", err);
    res.status(500).json({ error: "Failed to fetch colleges", message: err.message });
  }
});

// GET /api/colleges/:id - Fetch single college by ID
router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id).lean();
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json({
      ...college,
      id: college._id ? college._id.toString() : "",
      _id: college._id ? college._id.toString() : "",
    });
  } catch (err) {
    console.error("Error fetching college details:", err);
    res.status(500).json({ error: "Failed to fetch college", message: err.message });
  }
});

module.exports = router;
