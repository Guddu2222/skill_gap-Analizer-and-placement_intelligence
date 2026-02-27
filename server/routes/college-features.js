const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const College = require('../models/College');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/auth');

const getSkillName = (s) => (typeof s === 'string' ? s : (s && s.skillName)) || '';

// Helper: normalize student for API (optional snake_case for legacy frontend)
function toStudentResponse(doc) {
  const s = doc.toObject ? doc.toObject() : doc;
  const skills = (s.skills || []).map((sk) => ({
    skill_name: sk.skillName || sk,
    proficiency_level: sk.proficiencyLevel || 'intermediate',
    skill_category: sk.skillCategory,
  }));
  return {
    id: s._id,
    user_id: s.user,
    college_id: s.college,
    first_name: s.firstName,
    last_name: s.lastName,
    roll_number: s.rollNumber,
    email: s.email,
    phone: s.phone,
    department: s.department,
    graduation_year: s.graduationYear ?? s.year,
    cgpa: s.cgpa,
    degree: s.degree,
    resume_url: s.resumeUrl || s.resume,
    profile_picture: s.profilePicture,
    linkedin_url: s.linkedinUrl,
    github_url: s.githubUrl,
    portfolio_url: s.portfolioUrl,
    is_placed: s.isPlaced || s.placementStatus === 'placed',
    placement_status: s.placementStatus,
    placement_package: s.placementPackage,
    placed_company: s.placedCompany,
    skills,
  };
}

// --- College Dashboard & Student Management (college_admin only) ---

// Get College Dashboard Data
router.get('/dashboard', auth, roleCheck(['college_admin']), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) return res.status(403).json({ error: 'College not associated with this account' });

    const college = await College.findById(collegeId).lean();
    if (!college) return res.status(404).json({ error: 'College not found' });

    const students = await Student.find({ college: collegeId }).lean();
    const totalStudents = students.length;
    const placedStudents = students.filter((s) => s.isPlaced || s.placementStatus === 'placed').length;
    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;
    const withPackage = students.filter((s) => s.placementPackage != null && (s.isPlaced || s.placementStatus === 'placed'));
    const avgPackage = withPackage.length > 0
      ? (withPackage.reduce((sum, s) => sum + (s.placementPackage || 0), 0) / withPackage.length).toFixed(2)
      : 0;

    const departmentStats = {};
    students.forEach((student) => {
      const dept = student.department || 'Other';
      if (!departmentStats[dept]) departmentStats[dept] = { total: 0, placed: 0, students: [] };
      departmentStats[dept].total++;
      if (student.isPlaced || student.placementStatus === 'placed') departmentStats[dept].placed++;
      departmentStats[dept].students.push(student);
    });

    res.json({
      college: {
        id: college._id,
        name: college.name,
        location: college.location,
        logo_url: college.logoUrl,
      },
      statistics: {
        totalStudents,
        placedStudents,
        placementRate: parseFloat(placementRate),
        avgPackage: parseFloat(avgPackage),
        departments: Object.keys(departmentStats).length,
      },
      departmentStats,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Students with Filters
router.get('/students', auth, roleCheck(['college_admin']), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) return res.status(403).json({ error: 'College not associated' });

    const {
      department,
      graduationYear,
      placementStatus,
      search,
      page = 1,
      limit = 20,
      sortBy = 'cgpa',
      order = 'desc',
    } = req.query;

    const query = { college: collegeId };
    if (department) query.department = department;
    if (graduationYear) query.graduationYear = parseInt(graduationYear, 10) || query.graduationYear;
    if (placementStatus) query.placementStatus = placementStatus;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { rollNumber: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [total, rows] = await Promise.all([
      Student.countDocuments(query),
      Student.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    ]);

    const students = rows.map((s) => toStudentResponse(s));
    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Skill Analytics
router.get('/skills/analytics', auth, roleCheck(['college_admin']), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    if (!collegeId) return res.status(403).json({ error: 'College not associated' });

    const students = await Student.find({ college: collegeId }).lean();
    const skillsMap = {};
    const categoryMap = {};

    students.forEach((student) => {
      (student.skills || []).forEach((skill) => {
        const name = getSkillName(skill);
        if (!name) return;
        const category = skill.skillCategory || 'domain_knowledge';
        if (!skillsMap[name]) {
          skillsMap[name] = {
            name,
            count: 0,
            category,
            proficiencyLevels: { beginner: 0, intermediate: 0, advanced: 0, expert: 0 },
          };
        }
        skillsMap[name].count++;
        const level = (skill.proficiencyLevel || 'intermediate').toLowerCase();
        if (skillsMap[name].proficiencyLevels[level] !== undefined) skillsMap[name].proficiencyLevels[level]++;

        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
    });

    const topSkills = Object.values(skillsMap).sort((a, b) => b.count - a.count).slice(0, 20);
    const skillsByCategory = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
      percentage: students.length ? ((count / students.length) * 100).toFixed(1) : 0,
    }));

    res.json({
      totalStudents: students.length,
      topSkills,
      skillsByCategory,
      allSkills: Object.values(skillsMap),
    });
  } catch (err) {
    console.error('Skill analytics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Department-wise Skill Distribution
router.get('/skills/department/:department', auth, roleCheck(['college_admin']), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { department } = req.params;
    if (!collegeId) return res.status(403).json({ error: 'College not associated' });

    const students = await Student.find({ college: collegeId, department }).lean();
    const skillsMap = {};

    students.forEach((student) => {
      (student.skills || []).forEach((skill) => {
        const name = getSkillName(skill);
        if (!name) return;
        if (!skillsMap[name]) skillsMap[name] = { name, count: 0, students: [] };
        skillsMap[name].count++;
        skillsMap[name].students.push({
          id: student._id,
          name: [student.firstName, student.lastName].filter(Boolean).join(' ') || student.rollNumber,
          proficiency: skill.proficiencyLevel || 'intermediate',
        });
      });
    });

    const skills = Object.values(skillsMap).sort((a, b) => b.count - a.count);
    res.json({ department, totalStudents: students.length, skills });
  } catch (err) {
    console.error('Department skills error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export students data
router.get('/students/export', auth, roleCheck(['college_admin']), async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { format = 'csv' } = req.query;
    if (!collegeId) return res.status(403).json({ error: 'College not associated' });

    const students = await Student.find({ college: collegeId }).lean();
    const rows = students.map((s) => toStudentResponse(s));

    if (format === 'csv') {
      const headers = ['first_name', 'last_name', 'roll_number', 'email', 'department', 'graduation_year', 'cgpa', 'placement_status', 'placement_package', 'placed_company'];
      const csvLines = [headers.join(',')];
      rows.forEach((r) => {
        csvLines.push(headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','));
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
      return res.send(csvLines.join('\r\n'));
    }
    res.json(rows);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Existing routes (all authenticated users where applicable) ---

// 1. Curriculum Gap Analysis
router.get('/curriculum-gap', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: { $ne: 'cancelled' } });
    const studentQuery = req.user.collegeId ? { college: req.user.collegeId } : {};
    const students = await Student.find(studentQuery);

    const marketDemand = {};
    jobs.forEach((job) => {
      if (Array.isArray(job.requirements)) {
        job.requirements.forEach((skill) => {
          marketDemand[skill] = (marketDemand[skill] || 0) + 1;
        });
      }
    });

    const studentSupply = {};
    students.forEach((student) => {
      (student.skills || []).forEach((skill) => {
        const name = getSkillName(skill);
        if (name) studentSupply[name] = (studentSupply[name] || 0) + 1;
      });
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
    const query = { $or: [{ placementStatus: 'unplaced' }, { placementStatus: 'eligible' }, { placementStatus: 'applying' }] };
    if (req.user.collegeId) query.college = req.user.collegeId;
    const students = await Student.find(query);

    const atRiskList = students
      .map((student) => {
        const skillCount = student.skills ? student.skills.length : 0;
        const mockAppCount = Math.floor(Math.random() * 15);

        const riskReason = [];
        if ((student.cgpa != null && student.cgpa < 7)) riskReason.push('Low CGPA');
        if (skillCount < 3) riskReason.push('Low Skill Count');
        if (mockAppCount > 10) riskReason.push('High Rejection Rate');

        if (riskReason.length === 0) return null;
        const name = [student.firstName, student.lastName].filter(Boolean).join(' ') || `Student ${student.rollNumber}`;
        return {
          id: student._id,
          name,
          rollNumber: student.rollNumber,
          cgpa: student.cgpa,
          riskFactors: riskReason,
          riskLevel: riskReason.length >= 2 ? 'Critical' : 'Moderate',
        };
      })
      .filter((s) => s !== null);

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
    if (req.user.collegeId) query.college = req.user.collegeId;
    if (minCGPA != null) query.cgpa = { $gte: minCGPA };
    if (department) query.department = department;
    if (excludePlaced) query.$or = [{ placementStatus: 'unplaced' }, { placementStatus: 'eligible' }, { placementStatus: 'applying' }];
    if (requiredSkills && requiredSkills.length > 0) {
      query.$and = requiredSkills.map((skill) => ({ 'skills.skillName': skill }));
    }

    const students = await Student.find(query).select('rollNumber cgpa skills department placementStatus firstName lastName');
    res.json({ count: students.length, students });

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
