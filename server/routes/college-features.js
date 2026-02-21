
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Job = require('../models/Job');
const User = require('../models/User'); // Assuming Recruiters are Users
const auth = require('../middleware/auth');

// 1. Curriculum Gap Analysis
router.get('/curriculum-gap', auth, async (req, res) => {
  try {
    // Phase 1: simple frequency analysis
    const jobs = await Job.find({ status: { $ne: 'cancelled' } });
    const students = await Student.find();

    const marketDemand = {};
    jobs.forEach(job => {
      // Assuming requiredSkills is an array of strings in Job model (simplified)
      // If it's JSON/Object, we'd parse it. adapted to logic.
      if (Array.isArray(job.requirements)) {
         job.requirements.forEach(skill => {
            marketDemand[skill] = (marketDemand[skill] || 0) + 1;
         });
      }
    });

    const studentSupply = {};
    students.forEach(student => {
      if (Array.isArray(student.skills)) {
        student.skills.forEach(skill => {
          studentSupply[skill] = (studentSupply[skill] || 0) + 1;
        });
      }
    });

    const gapAnalysis = Object.keys(marketDemand).map(skill => ({
      skill,
      demandCount: marketDemand[skill],
      supplyCount: studentSupply[skill] || 0,
      gap: marketDemand[skill] - (studentSupply[skill] || 0)
    })).sort((a, b) => b.demandCount - a.demandCount); // Top demand first

    // Identify critical gaps (High Demand, Low Supply)
    const criticalGaps = gapAnalysis.filter(g => g.gap > 0 && g.supplyCount < (g.demandCount * 0.5));

    res.json({
      overview: gapAnalysis.slice(0, 10), // Top 10 demanded skills
      criticalGaps
    });

  } catch (err) {
    console.error('College features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// 2. At-Risk Student Radar
router.get('/at-risk', auth, async (req, res) => {
  try {
    // Logic: Applied to many, placed in none.
    // Enhanced Logic: Low CGPA + No Skills
    const students = await Student.find({ placementStatus: 'unplaced' });
    
    // In a real app, we'd join with Applications count. 
    // For now, we simulate risk based on CGPA and Skills count + Mock Application count
    const atRiskList = students.map(student => {
      const skillCount = student.skills ? student.skills.length : 0;
      const mockAppCount = Math.floor(Math.random() * 15); // Simulating database data
      
      let riskReason = [];
      if (student.cgpa < 7) riskReason.push("Low CGPA");
      if (skillCount < 3) riskReason.push("Low Skill Count");
      if (mockAppCount > 10) riskReason.push("High Rejection Rate");

      if (riskReason.length > 0) {
        return {
          id: student._id,
          name: student.name || "Student " + student.rollNumber, // Assuming name is populated or available
          rollNumber: student.rollNumber,
          cgpa: student.cgpa,
          riskFactors: riskReason,
          riskLevel: riskReason.length >= 2 ? 'Critical' : 'Moderate'
        };
      }
      return null;
    }).filter(s => s !== null);

    res.json(atRiskList);
  } catch (err) {
    console.error('College features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// 3. Automated Shortlisting
router.post('/shortlist', auth, async (req, res) => {
  try {
    const { minCGPA, requiredSkills, department, excludePlaced } = req.body;
    
    const query = {};
    
    if (minCGPA) query.cgpa = { $gte: minCGPA };
    if (department) query.department = department;
    if (excludePlaced) query.placementStatus = 'unplaced';
    if (requiredSkills && requiredSkills.length > 0) {
      query.skills = { $all: requiredSkills };
    }

    const students = await Student.find(query).select('rollNumber cgpa skills department placementStatus');
    
    res.json({
      count: students.length,
      students
    });

  } catch (err) {
    console.error('College features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// 4. Recruiter CRM
router.get('/recruiter-crm', auth, async (req, res) => {
  try {
    // Mock analytics for Recruiter Relationship Management
    const crmData = [
      { id: 1, company: 'Google', tier: 'Tier 1', visits: 5, hires: 12, avgPackage: '28 LPA', status: 'Active' },
      { id: 2, company: 'Amazon', tier: 'Tier 1', visits: 4, hires: 25, avgPackage: '24 LPA', status: 'Active' },
      { id: 3, company: 'Infosys', tier: 'Mass', visits: 10, hires: 150, avgPackage: '5 LPA', status: 'Active' },
      { id: 4, company: 'StartUp Inc', tier: 'Tier 2', visits: 1, hires: 2, avgPackage: '12 LPA', status: 'Dormant' },
      { id: 5, company: 'TechCorp', tier: 'Tier 2', visits: 0, hires: 0, avgPackage: '0 LPA', status: 'New Lead' },
    ];
    res.json(crmData);
  } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');
  }
});

module.exports = router;
