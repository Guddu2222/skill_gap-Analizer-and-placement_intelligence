
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
// const auth = require('../middleware/auth'); // Uncomment when ready to use authentication

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('Jobs error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
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
    console.error('Jobs error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

module.exports = router;
