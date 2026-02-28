const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Mongoose app uses 'auth' not 'authMiddleware'
const skillGapService = require('../services/skillGapAnalysis.service');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const SkillLearningPath = require('../models/SkillLearningPath');
const DomainSkillRequirement = require('../models/DomainSkillRequirement');
const Student = require('../models/Student');

// Trigger Skill Gap Analysis
router.post('/analyze', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = student._id;
    const { targetDomain, targetRole } = req.body;

    if (!targetDomain) {
      return res.status(400).json({ error: 'Target domain is required' });
    }

    const result = await skillGapService.analyzeSkillGap(
      studentId,
      targetDomain,
      targetRole
    );

    res.json({
      success: true,
      message: 'Skill gap analysis completed successfully',
      data: result.analysis
    });

  } catch (error) {
    console.error('Skill gap analysis route error:', error);
    console.error('Skill gap analysis route error details:', error.stack || error);
    res.status(500).json({ 
      error: 'Failed to analyze skill gap',
      message: error.message 
    });
  }
});

// Get Latest Analysis
router.get('/latest', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = student._id;

    const analysis = await SkillGapAnalysis.findOne({ student: studentId, isActive: true })
      .sort({ analysisDate: -1 });

    if (!analysis) {
      return res.status(404).json({ 
        error: 'No analysis found',
        message: 'Please complete skill gap analysis first'
      });
    }

    // Also fetch associated learning paths
    const learningPaths = await SkillLearningPath.find({ gapAnalysis: analysis._id });

    res.json({
      success: true,
      analysis: {
         ...analysis.toObject(),
         learningPaths
      }
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// Get All Analyses (History)
router.get('/history', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = student._id;

    const analyses = await SkillGapAnalysis.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      analyses
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get Learning Paths
router.get('/learning-paths', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = student._id;

    const learningPaths = await SkillLearningPath.find({ student: studentId })
      .sort({ createdAt: -1 });

    // Group by status
    const grouped = {
      not_started: learningPaths.filter(lp => lp.status === 'not_started'),
      in_progress: learningPaths.filter(lp => lp.status === 'in_progress'),
      completed: learningPaths.filter(lp => lp.status === 'completed')
    };

    res.json({
      success: true,
      learningPaths,
      grouped
    });

  } catch (error) {
    console.error('Get learning paths error:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Update Learning Path Progress
router.patch('/learning-paths/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, milestoneIndex, completed } = req.body;
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentId = student._id;

    const learningPath = await SkillLearningPath.findOne({ _id: id, student: studentId });

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Update progress
    if (progress !== undefined) {
      learningPath.progressPercentage = progress;
      
      if (progress >= 100) {
        learningPath.progressPercentage = 100;
        learningPath.status = 'completed';
        learningPath.completedAt = new Date();
      } else if (progress > 0 && learningPath.status === 'not_started') {
        learningPath.status = 'in_progress';
        learningPath.startedAt = new Date();
      }
    }

    // Update milestone
    if (milestoneIndex !== undefined && completed !== undefined) {
      const milestones = [...learningPath.milestones];
      if (milestones[milestoneIndex]) {
        milestones[milestoneIndex].completed = completed;
        if (completed) {
          milestones[milestoneIndex].completedDate = new Date();
        }
        learningPath.milestones = milestones;
      }
    }

    await learningPath.save();

    res.json({
      success: true,
      learningPath
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get Available Domains
router.get('/domains', async (req, res) => {
  try {
    const domains = await DomainSkillRequirement.find({}, 'domain role');

    // Group by domain
    const grouped = domains.reduce((acc, item) => {
      if (!acc[item.domain]) {
        acc[item.domain] = [];
      }
      if (item.role && !acc[item.domain].includes(item.role)) {
        acc[item.domain].push(item.role);
      }
      return acc;
    }, {});

    res.json({
      success: true,
      domains: grouped
    });

  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

module.exports = router;
