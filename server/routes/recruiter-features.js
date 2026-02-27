const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const College = require('../models/College');
const SavedCandidate = require('../models/SavedCandidate');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

// ==================== DASHBOARD STATS ====================

router.get('/dashboard/stats', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    const [savedCount, recentSaved, statusAgg] = await Promise.all([
      SavedCandidate.countDocuments({ recruiter: recruiterId }),
      SavedCandidate.find({ recruiter: recruiterId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({ path: 'student', select: 'firstName lastName department cgpa college', populate: { path: 'college', select: 'name tier' } }),
      SavedCandidate.aggregate([
        { $match: { recruiter: new mongoose.Types.ObjectId(recruiterId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const statusBreakdown = statusAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Count unique colleges across saved candidates
    const uniqueColleges = await SavedCandidate.aggregate([
      { $match: { recruiter: new mongoose.Types.ObjectId(recruiterId) } },
      { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'studentData' } },
      { $unwind: '$studentData' },
      { $group: { _id: '$studentData.college' } },
      { $count: 'total' },
    ]);

    res.json({
      savedCandidates: savedCount,
      viewedColleges: uniqueColleges[0]?.total || 0,
      recentSaved,
      statusBreakdown,
    });
  } catch (err) {
    console.error('Recruiter dashboard stats error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==================== COLLEGE DISCOVERY ====================

router.get('/colleges', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { search, tier, location, minPlacementRate, minStudents, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
    ];
    if (tier) filter.tier = tier;
    if (location) filter.location = new RegExp(location, 'i');

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const colleges = await College.find(filter).sort({ name: 1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await College.countDocuments(filter);

    // Enrich each college with live student metrics
    const enriched = await Promise.all(
      colleges.map(async (college) => {
        const students = await Student.find({ college: college._id }).select('isPlaced placementStatus placementPackage').lean();
        const totalStudents = students.length;
        const placedStudents = students.filter(s => s.isPlaced || s.placementStatus === 'placed').length;
        const placementRate = totalStudents > 0 ? parseFloat(((placedStudents / totalStudents) * 100).toFixed(1)) : 0;
        const packages = students.filter(s => s.placementPackage).map(s => s.placementPackage);
        const avgPackage = packages.length > 0 ? parseFloat((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1)) : 0;
        const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
        const availableStudents = students.filter(s => !s.isPlaced && s.placementStatus !== 'placed').length;

        return {
          id: college._id,
          name: college.name,
          location: college.location,
          tier: college.tier,
          logoUrl: college.logoUrl,
          website: college.website,
          metrics: { totalStudents, placedStudents, availableStudents, placementRate, avgPackage, highestPackage },
        };
      })
    );

    // Post-filter by metrics
    let result = enriched;
    if (minPlacementRate) result = result.filter(c => c.metrics.placementRate >= parseFloat(minPlacementRate));
    if (minStudents) result = result.filter(c => c.metrics.totalStudents >= parseInt(minStudents));

    res.json({ colleges: result, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } });
  } catch (err) {
    console.error('Get colleges error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get College Detail with Students
router.get('/colleges/:collegeId', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { collegeId } = req.params;
    const college = await College.findById(collegeId).lean();
    if (!college) return res.status(404).json({ error: 'College not found' });

    const students = await Student.find({
      college: collegeId,
      placementStatus: { $in: ['eligible', 'applying'] },
    }).lean();

    const totalStudents = await Student.countDocuments({ college: collegeId });
    const placedStudents = await Student.countDocuments({ college: collegeId, isPlaced: true });

    // Department breakdown
    const departmentStats = students.reduce((acc, s) => {
      const dept = s.department || 'Other';
      if (!acc[dept]) acc[dept] = { total: 0, available: 0 };
      acc[dept].total++;
      if (!s.isPlaced) acc[dept].available++;
      return acc;
    }, {});

    // Top skills
    const skillsMap = {};
    students.forEach(s => {
      (s.skills || []).forEach(skill => {
        const name = typeof skill === 'string' ? skill : skill.skillName;
        if (!name) return;
        if (!skillsMap[name]) skillsMap[name] = { name, count: 0, category: skill.skillCategory };
        skillsMap[name].count++;
      });
    });
    const topSkills = Object.values(skillsMap).sort((a, b) => b.count - a.count).slice(0, 15);

    res.json({
      college: { id: college._id, name: college.name, location: college.location, tier: college.tier, logoUrl: college.logoUrl, website: college.website },
      statistics: { totalStudents, placedStudents, availableStudents: students.length, placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0 },
      departmentStats,
      topSkills,
    });
  } catch (err) {
    console.error('College detail error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==================== ADVANCED CANDIDATE SEARCH ====================

router.post('/search/candidates', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const {
      skills = [], departments = [], colleges = [], minCgpa, maxCgpa,
      graduationYears = [], skillProficiency = [],
      placementStatus = ['eligible', 'applying'],
      page = 1, limit = 20, sortBy = 'cgpa', order = 'desc',
    } = req.body;

    const filter = {};
    if (minCgpa || maxCgpa) {
      filter.cgpa = {};
      if (minCgpa) filter.cgpa.$gte = parseFloat(minCgpa);
      if (maxCgpa) filter.cgpa.$lte = parseFloat(maxCgpa);
    }
    if (departments.length) filter.department = { $in: departments };
    if (colleges.length) filter.college = { $in: colleges.map(id => new mongoose.Types.ObjectId(id)) };
    if (graduationYears.length) filter.graduationYear = { $in: graduationYears.map(Number) };
    if (placementStatus.length) {
      filter.placementStatus = { $in: placementStatus };
      filter.isPlaced = false;
    }
    if (skills.length) {
      if (skillProficiency.length) {
        filter.skills = { $elemMatch: { skillName: { $in: skills }, proficiencyLevel: { $in: skillProficiency } } };
      } else {
        filter['skills.skillName'] = { $in: skills };
      }
    }

    const sortDir = order === 'asc' ? 1 : -1;
    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const [total, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.find(filter)
        .populate('college', 'name tier location logoUrl')
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
    ]);

    // Compute skill match score
    const results = students.map(s => {
      let matchScore = 0;
      if (skills.length) {
        const studentSkillNames = (s.skills || []).map(sk => (typeof sk === 'string' ? sk : sk.skillName));
        const matched = skills.filter(sk => studentSkillNames.includes(sk));
        matchScore = parseFloat(((matched.length / skills.length) * 100).toFixed(1));
      }
      return { ...s, matchScore };
    });

    if (skills.length) results.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      candidates: results,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) },
    });
  } catch (err) {
    console.error('Candidate search error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==================== DOMAIN EXPERTS ====================

router.get('/candidates/top-by-domain/:domain', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { domain } = req.params;
    const { limit = 20 } = req.query;

    const domainMapping = {
      'software-engineering': ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue.js', 'Spring Boot'],
      'data-science': ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch', 'SQL', 'R', 'Pandas'],
      'cloud-devops': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'],
      'database': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'Oracle'],
      'full-stack': ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'REST API'],
    };

    const domainSkills = domainMapping[domain] || domainMapping['software-engineering'];

    const students = await Student.find({
      isPlaced: false,
      placementStatus: { $in: ['eligible', 'applying'] },
      'skills.skillName': { $in: domainSkills },
    })
      .populate('college', 'name tier location logoUrl')
      .sort({ cgpa: -1 })
      .limit(parseInt(limit) * 2)
      .lean();

    const proficiencyScore = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };

    const withScore = students.map(s => {
      const domainSkillList = (s.skills || []).filter(sk => {
        const name = typeof sk === 'string' ? sk : sk.skillName;
        return domainSkills.includes(name);
      });
      const skillTotal = domainSkillList.reduce((sum, sk) => sum + (proficiencyScore[sk.proficiencyLevel] || 2), 0);
      const avgSkill = domainSkillList.length > 0 ? skillTotal / domainSkillList.length : 0;
      const cgpaScore = ((s.cgpa || 0) / 10) * 30;
      const domainScore = avgSkill * (70 / 4);
      return {
        ...s,
        domainExpertiseScore: parseFloat((cgpaScore + domainScore).toFixed(1)),
        domainSkillsCount: domainSkillList.length,
      };
    });

    withScore.sort((a, b) => b.domainExpertiseScore - a.domainExpertiseScore);

    res.json({ domain, candidates: withScore.slice(0, parseInt(limit)), totalFound: withScore.length });
  } catch (err) {
    console.error('Domain experts error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==================== SAVED CANDIDATES ====================

router.post('/candidates/save', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { studentId, folderName, notes, rating } = req.body;
    const recruiterId = req.user.userId;

    const saved = await SavedCandidate.findOneAndUpdate(
      { recruiter: recruiterId, student: studentId },
      { $set: { folderName: folderName || 'General', notes, rating } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, savedCandidate: saved });
  } catch (err) {
    if (err.code === 11000) return res.json({ success: true, message: 'Already saved' });
    console.error('Save candidate error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/candidates/save/:studentId', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    await SavedCandidate.findOneAndDelete({ recruiter: req.user.userId, student: req.params.studentId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/candidates/saved', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { folder, status } = req.query;
    const filter = { recruiter: req.user.userId };
    if (folder) filter.folderName = folder;
    if (status) filter.status = status;

    const saved = await SavedCandidate.find(filter)
      .populate({ path: 'student', populate: { path: 'college', select: 'name tier location logoUrl' } })
      .sort({ createdAt: -1 })
      .lean();

    const groupedByFolder = saved.reduce((acc, item) => {
      const f = item.folderName || 'General';
      if (!acc[f]) acc[f] = [];
      acc[f].push(item);
      return acc;
    }, {});

    res.json({ savedCandidates: saved, groupedByFolder, totalSaved: saved.length });
  } catch (err) {
    console.error('Get saved error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.patch('/candidates/saved/:id/status', auth, roleCheck(['recruiter']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const saved = await SavedCandidate.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.userId },
      { $set: { status, notes } },
      { new: true }
    );
    if (!saved) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, savedCandidate: saved });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==================== LEGACY ROUTES (kept for backward compat) ====================

router.post('/offer-probability', auth, async (req, res) => {
  try {
    const { studentId, offerCTC, location } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    let probability = 70;
    const riskFactors = [];
    const expectedCTC = 15;
    if (offerCTC < expectedCTC) { probability -= 20; riskFactors.push('Offer below expectation'); }
    else if (offerCTC > expectedCTC * 1.5) probability += 15;

    const preferredLocations = ['Bangalore', 'Remote'];
    if (!preferredLocations.includes(location)) { probability -= 15; riskFactors.push('Location mismatch'); }
    if (Math.random() > 0.7) { probability -= 25; riskFactors.push('Has competing offers'); }

    probability = Math.min(Math.max(probability, 10), 99);
    res.json({ studentId, joiningProbability: probability, riskLevel: probability < 50 ? 'High' : probability < 80 ? 'Medium' : 'Low', riskFactors });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/campus-roi', auth, async (req, res) => {
  try {
    const colleges = await College.find().lean();
    const roiData = await Promise.all(
      colleges.slice(0, 10).map(async (c) => {
        const students = await Student.find({ college: c._id }).lean();
        const placed = students.filter(s => s.isPlaced).length;
        const rate = students.length > 0 ? ((placed / students.length) * 100).toFixed(0) : 0;
        return { college: c.name, hires: placed, retentionRate: Math.min(90 + Math.random() * 10, 99), avgPerformance: 3.5 + Math.random() * 1.5, roiScore: parseInt(rate) || 50 };
      })
    );
    res.json(roiData);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
