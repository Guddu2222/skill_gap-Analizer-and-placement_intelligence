
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// 1. Offer Acceptance Probability (Prediction Engine)
router.post('/offer-probability', auth, async (req, res) => {
  try {
    const { studentId, jobId, offerCTC, location } = req.body;
    
    // In a real system, we would fetch historical data and train a model.
    // Here we use heuristic logic.
    
    const student = await Student.findById(studentId);
    let probability = 70; // Base probability
    let riskFactors = [];

    if (!student) return res.status(404).json({ msg: 'Student not found' });

    // Factor 1: CTC Gap (Expectation vs Offer)
    // Assuming student has an expectedCTC field (we'll mock it for now or use random)
    const expectedCTC = 15; // Mock: Student expects 15 LPA
    
    if (offerCTC < expectedCTC) {
      probability -= 20;
      riskFactors.push('Offer below expectation');
    } else if (offerCTC > expectedCTC * 1.5) {
      probability += 15;
    }

    // Factor 2: Location Preference
    // Mock student preference
    const preferredLocations = ['Bangalore', 'Remote']; 
    if (!preferredLocations.includes(location)) {
      probability -= 15;
      riskFactors.push('Location mismatch');
    }

    // Factor 3: Competing Offers
    // If student has other offers (mocked logic)
    const hasCompetingOffers = Math.random() > 0.7; // 30% chance
    if (hasCompetingOffers) {
      probability -= 25;
      riskFactors.push('Has competing offers');
    }

    // Cap probability
    probability = Math.min(Math.max(probability, 10), 99);

    res.json({
      studentId,
      joiningProbability: probability,
      riskLevel: probability < 50 ? 'High' : probability < 80 ? 'Medium' : 'Low',
      riskFactors,
      backupCandidates: [] // Placeholder for recommendation logic
    });

  } catch (err) {
    console.error('Recruiter features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// 2. Campus ROI Engine
router.get('/campus-roi', auth, async (req, res) => {
  try {
    // Mock analytics for ROI per college
    const roiData = [
      { college: 'IIT Bombay', hires: 12, retentionRate: 95, avgPerformance: 4.8, roiScore: 98 },
      { college: 'BITS Pilani', hires: 20, retentionRate: 92, avgPerformance: 4.6, roiScore: 94 },
      { college: 'VIT Vellore', hires: 50, retentionRate: 85, avgPerformance: 4.2, roiScore: 88 },
      { college: 'Local Engg College', hires: 5, retentionRate: 60, avgPerformance: 3.5, roiScore: 55 },
    ];
    
    res.json(roiData);
  } catch (err) {
    console.error('Recruiter features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// 3. Automated Interview Scheduling
router.post('/auto-schedule', auth, async (req, res) => {
  try {
    const { jobId, candidates, durationMinutes, startDate } = req.body;
    
    // improved mock scheduling logic
    const schedule = candidates.map((candidateId, index) => {
      // Create slots starting from startDate, 9 AM
      const date = new Date(startDate);
      date.setHours(9, 0, 0, 0); // Start at 9 AM
      
      // Add duration * index to get slot
      date.setMinutes(date.getMinutes() + (index * durationMinutes)); 
      
      // If past 5 PM, move to next day (simplified logic: just linear for now)
      
      return {
        candidateId,
        slot: date,
        interviewer: 'Panel ' + ((index % 3) + 1), // Rotate through 3 panels
        meetingLink: `https://meet.placement.ai/${jobId}/${candidateId}`
      };
    });

    res.json({
      message: `Successfully scheduled ${candidates.length} interviews`,
      schedule
    });

  } catch (err) {
    console.error('Recruiter features error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

module.exports = router;
