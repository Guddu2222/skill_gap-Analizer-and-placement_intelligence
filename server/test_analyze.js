const fs = require('fs');
const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const student = await Student.findOne();
    if(student) {
      console.log('Found user:', student.email);
      // Hardcode a password reset or token generation just for test
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { userId: student._id, userRole: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const res = await fetch('http://localhost:5000/api/skill-gap/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ targetDomain: 'Software Engineer', targetRole: 'Full Stack Developer' })
      });
      const data = await res.json();
      console.log(data);
    }
    process.exit(0);
  });
