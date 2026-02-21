
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    
    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (user) {
      // Update existing unverified user
      user.name = name;
      user.password = hashedPassword;
      user.role = role;
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        verificationCode,
        verificationCodeExpires
      });
    }

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationCode);
    } catch (err) {
      console.error('Email send error:', err);
      // We still save the user, but they might need to resend the code
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: false },
      message: 'Registration successful. Please check your email for verification code.'
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
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
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
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

    // In production, send email with reset link
    // For now, we'll just return the token (remove this in production!)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:3000/reset-password/${resetToken}`);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetToken);

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

module.exports = router;
