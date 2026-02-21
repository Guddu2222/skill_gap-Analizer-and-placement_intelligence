
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Job = require('../models/Job');
const Alumni = require('../models/Alumni');
const InterviewExperience = require('../models/InterviewExperience');
const auth = require('../middleware/auth');

// Get Student Skill Gap Analysis
router.get('/skill-gap', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    // Mock logic for gap analysis based on target role
    // In a real app, this would query a skills database mapping roles to skills
    const roleSkills = {
      'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'System Design'],
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      'SDE': ['DSA', 'Java/C++', 'System Design', 'OS']
    };

    const targetRole = student.targetRole || 'Full Stack Developer'; // Default
    const requiredSkills = roleSkills[targetRole] || ['Communication'];
    const studentSkills = student.skills || [];

    const gaps = requiredSkills.filter(skill => !studentSkills.includes(skill));
    const matchScore = Math.round(((requiredSkills.length - gaps.length) / requiredSkills.length) * 100);

    res.json({
      targetRole,
      matchScore,
      missingSkills: gaps,
      acquiredSkills: studentSkills.filter(skill => requiredSkills.includes(skill))
    });

  } catch (err) {
    console.error('Student features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// Get Recommended Alumni
router.get('/alumni', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    // Find alumni in dream companies or same department
    const query = {};
    if (student && student.dreamCompanies && student.dreamCompanies.length > 0) {
      query.company = { $in: student.dreamCompanies };
    }
    
    const alumni = await Alumni.find(query).limit(10);
    res.json(alumni);
  } catch (err) {
    console.error('Student features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// Get Interview Experiences
router.get('/interviews', auth, async (req, res) => {
  try {
    const { company } = req.query;
    const query = {};
    if (company) query.company = new RegExp(company, 'i');

    const experiences = await InterviewExperience.find(query).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    console.error('Student features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

module.exports = router;
