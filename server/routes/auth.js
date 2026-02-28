
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const College = require('../models/College');

const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      // College admin profile (when role === 'college_admin')
      collegeName,
      phone,
      address,
      
      // Student profile (when role === 'student') - Extended
      firstName, lastName, college: studentCollegeName, rollNumber,
      department, graduationYear, cgpa, degree, skills,
      linkedinUrl, githubUrl, portfolioUrl, targetRole, resumeUrl,
      dateOfBirth, gender, specialization, admissionYear, currentSemester,
      activeBacklogs, clearedBacklogs, education10th, education12th,
      experiences, projects,
      addressLine1, addressLine2, city, state, pincode, country,
      preferredLocations, expectedSalaryMin, expectedSalaryMax, willingToRelocate
    } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (user) {
      user.name = name || `${firstName} ${lastName}`.trim();
      user.password = hashedPassword;
      user.role = role;
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
    } else {
      user = new User({
        name: name || `${firstName} ${lastName}`.trim(),
        email,
        password: hashedPassword,
        role,
        verificationCode,
        verificationCodeExpires,
      });
    }

    await user.save();

    // If college_admin, create/upsert a College document and link it to the user
    if (role === 'college_admin') {
      try {
        const emailDomain = email.split('@')[1]?.toLowerCase() || null;
        const collegeNameTrimmed = (collegeName || name || '').trim();

        // Build upsert filter — prefer domain-based lookup to avoid duplicates
        const filter = emailDomain
          ? { emailDomain }
          : { name: new RegExp('^' + collegeNameTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };

        const update = {
          $setOnInsert: {
            name: collegeNameTrimmed || `College (${email})`,
            emailDomain: emailDomain || undefined,
            location: address || undefined,
          },
        };

        const college = await College.findOneAndUpdate(filter, update, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        });

        user.college = college._id;
        await user.save();
      } catch (collegeErr) {
        console.error('College upsert error (non-fatal):', collegeErr.message);
        // Non-fatal: user is still created, they can be linked later
      }
    }

    // If student, create/update Student profile and optionally link college
    if (role === 'student') {
      let collegeId = null;
      if (studentCollegeName && typeof studentCollegeName === 'string' && studentCollegeName.trim().length >= 3) {
        const cleanCollegeName = studentCollegeName.trim();
        let college = await College.findOne({
          name: new RegExp('^' + cleanCollegeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i'),
        });
        
        // Auto-create college if it doesn't exist
        if (!college) {
          try {
            college = new College({ name: cleanCollegeName, isVerified: false });
            await college.save();
          } catch(err) {
            console.error('Error auto-creating college', err);
          }
        }
        
        if (college) collegeId = college._id;
      }

      const yearNum = graduationYear ? parseInt(graduationYear, 10) : new Date().getFullYear();
      const skillsNormalized = Array.isArray(skills)
        ? skills
            .filter((s) => s != null && (typeof s === 'string' ? String(s).trim() !== '' : String(s.skillName || '').trim() !== ''))
            .map((s) => (typeof s === 'string' ? { skillName: s.trim() } : { 
              skillName: String(s.skillName || '').trim(), 
              proficiencyLevel: String(s.proficiencyLevel || 'intermediate').toLowerCase() 
            }))
        : [];

      const studentPayload = {
        user: user._id,
        college: collegeId,
        rollNumber: rollNumber && String(rollNumber).trim() ? String(rollNumber).trim() : email.split('@')[0],
        department: department && String(department).trim() ? String(department).trim() : 'General',
        year: yearNum,
        graduationYear: yearNum,
        firstName: firstName && String(firstName).trim() ? String(firstName).trim() : undefined,
        lastName: lastName && String(lastName).trim() ? String(lastName).trim() : undefined,
        email: email || user.email,
        phone: phone && String(phone).trim() ? String(phone).trim() : undefined,
        cgpa: cgpa != null && cgpa !== '' ? parseFloat(cgpa) : undefined,
        degree: degree && String(degree).trim() ? String(degree).trim() : undefined,
        skills: skillsNormalized,
        targetRole: targetRole && String(targetRole).trim() ? String(targetRole).trim() : undefined,
        linkedinUrl: linkedinUrl && String(linkedinUrl).trim() ? String(linkedinUrl).trim() : undefined,
        githubUrl: githubUrl && String(githubUrl).trim() ? String(githubUrl).trim() : undefined,
        portfolioUrl: portfolioUrl && String(portfolioUrl).trim() ? String(portfolioUrl).trim() : undefined,
        resumeUrl: resumeUrl && String(resumeUrl).trim() ? String(resumeUrl).trim() : undefined,
        
        // New Fields
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || undefined,
        specialization: specialization || undefined,
        admissionYear: admissionYear ? parseInt(admissionYear, 10) : undefined,
        currentSemester: currentSemester ? parseInt(currentSemester, 10) : undefined,
        activeBacklogs: activeBacklogs ? parseInt(activeBacklogs, 10) : 0,
        clearedBacklogs: clearedBacklogs ? parseInt(clearedBacklogs, 10) : 0,
        
        education10th: education10th?.percentage ? {
          institutionName: education10th.institutionName,
          board: education10th.board,
          percentage: parseFloat(education10th.percentage),
          yearOfPassing: parseInt(education10th.yearOfPassing, 10)
        } : undefined,

        education12th: education12th?.percentage ? {
          institutionName: education12th.institutionName,
          board: education12th.board,
          percentage: parseFloat(education12th.percentage),
          yearOfPassing: parseInt(education12th.yearOfPassing, 10),
          stream: education12th.stream
        } : undefined,

        experiences: Array.isArray(experiences) ? experiences : [],
        projects: Array.isArray(projects) ? projects : [],
        
        addressLine1, addressLine2, city, state, pincode, country,
        preferredLocations: Array.isArray(preferredLocations) ? preferredLocations : [],
        expectedSalaryMin: expectedSalaryMin ? parseFloat(expectedSalaryMin) : undefined,
        expectedSalaryMax: expectedSalaryMax ? parseFloat(expectedSalaryMax) : undefined,
        willingToRelocate: willingToRelocate !== undefined ? Boolean(willingToRelocate) : true,
      };

      let student = await Student.findOne({ user: user._id });
      if (student) {
        Object.assign(student, studentPayload);
        await student.save();
      } else {
        student = new Student(studentPayload);
        await student.save();
      }
    }

    try {
      await sendVerificationEmail(user.email, verificationCode);
    } catch (err) {
      console.error('Email send error:', err);
    }

    const payload = { userId: user.id, role: user.role };
    if (user.role === 'college_admin' && user.college) {
      payload.collegeId = user.college.toString();
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: false },
      message: 'Registration successful. Please check your email for verification code.',
    });
  } catch (err) {
    console.error('Register error (Full):', err);
    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(' | ') });
    }
    // Handle Duplicate Key Errors
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email is already registered.' });
    }
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({ 
      email, 
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Send Welcome Email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch(err) {
      console.error('Welcome email error:', err);
    }

    res.json({ success: true, msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Resend Verification Code
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    try {
      await sendVerificationEmail(user.email, verificationCode);
      res.json({ success: true, msg: 'Verification code resent' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (err) {
    console.error('Resend error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first', isVerified: false });
    }

    const payload = { userId: user.id, role: user.role };
    if (user.role === 'college_admin' && user.college) {
      payload.collegeId = user.college.toString();
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    const userRes = { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified };
    if (user.college) userRes.collegeId = user.college.toString();
    res.json({ token, user: userRes });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

// Forgot Password - Send reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    // Don't reveal if email exists or not (security best practice)
    // Always return success message
    if (!user) {
      return res.json({ 
        success: true, 
        message: 'If that email exists, we sent a reset link' 
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'password_reset' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${resetLink}`);

    // Send email with reset link
    await sendPasswordResetEmail(user.email, resetLink);

    res.json({ 
      success: true, 
      message: 'Password reset link sent to your email',
      // Remove token in production - only for development/testing
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Reset Password - Update password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Check if token is for password reset
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({ error: 'Invalid reset token' });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
      }
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });

  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
