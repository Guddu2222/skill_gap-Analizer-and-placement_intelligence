
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
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

// Get smart job opportunities matching student profile
router.get('/opportunities', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentSkills = (student.skills || []).map(s => 
      (typeof s === 'string' ? s : s.skillName || '').toLowerCase().trim()
    ).filter(Boolean);

    const matchThreshold = 20; // Only return jobs where they have at least a 20% match to prevent spam
    const jobs = await Job.find().sort({ createdAt: -1 });

    const opportunities = jobs.map(job => {
      const requirements = job.requirements || [];
      if (requirements.length === 0) {
        return { ...job.toObject(), matchScore: 50, missingSkills: [] }; // Neutral score if no requirements exist
      }

      let matchCount = 0;
      const missingSkills = [];

      requirements.forEach(reqSkill => {
        const skillDown = reqSkill.toLowerCase().trim();
        const hasSkill = studentSkills.some(s => s.includes(skillDown) || skillDown.includes(s));
        if (hasSkill) matchCount++;
        else missingSkills.push(reqSkill);
      });

      const matchScore = Math.round((matchCount / requirements.length) * 100);
      return { ...job.toObject(), matchScore, missingSkills };
    })
    .filter(job => job.matchScore >= matchThreshold)
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, count: opportunities.length, opportunities });
  } catch (err) {
    console.error('Job match error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
