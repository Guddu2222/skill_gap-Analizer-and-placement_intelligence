const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { analyzeATS } = require("../controllers/atsController");

// Use standard auth middleware for the student
router.post("/analyze", auth, analyzeATS);

module.exports = router;
