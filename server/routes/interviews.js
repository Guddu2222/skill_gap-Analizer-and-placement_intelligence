const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const interviewService = require('../services/interview.service');
const MockInterview = require('../models/MockInterview');
const Student = require('../models/Student');

// Generate Mock Interview
router.post('/generate', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const targetRole = req.body.targetRole || student.targetRole || 'Software Engineer';

    const interview = await interviewService.generateMockInterview(student._id, targetRole);

    res.json({
      success: true,
      message: 'Mock interview generated successfully',
      interview
    });

  } catch (error) {
    console.error('Mock interview generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate mock interview',
      message: error.message 
    });
  }
});

// Evaluate Interview Answers
router.post('/:id/evaluate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // Array of { questionId, studentAnswer }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers must be an array' });
    }

    const evaluatedInterview = await interviewService.evaluateInterviewAnswers(id, answers);

    res.json({
      success: true,
      message: 'Interview evaluated successfully',
      interview: evaluatedInterview
    });

  } catch (error) {
    console.error('Interview evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate interview answers',
      message: error.message 
    });
  }
});

// Get Interviews History
router.get('/history/:studentId?', auth, async (req, res) => {
  try {
    let studentId = req.params.studentId;

    if (!studentId) {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) {
        return res.status(404).json({ error: 'Student profile not found' });
      }
      studentId = student._id;
    }

    const interviews = await MockInterview.find({ student: studentId })
      .sort({ createdAt: -1 })
      .select('-responses'); // Exclude responses to keep the list lightweight

    res.json({
      success: true,
      interviews
    });

  } catch (error) {
    console.error('Get interviews history error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews history' });
  }
});

// Get Specific Interview Details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await MockInterview.findById(id);

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Get interview details error:', error);
    res.status(500).json({ error: 'Failed to fetch interview details' });
  }
});

module.exports = router;
