Ó
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth'); // Need to create this middleware

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Post a job (Recruiter/Admin only - simplified to just check exists for now)
router.post('/', async (req, res) => {
  try {
    const { company, title, description, location, salary, jobType, requirements, deadline } = req.body;
    const newJob = new Job({
      company,
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
      deadline
      // postedBy: req.user.id // Add auth middleware later
    });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
Ó*cascade082^file:///d:/project/Skill_Gap%20Analyser%20and%20placement%20intelligence/server/routes/jobs.js