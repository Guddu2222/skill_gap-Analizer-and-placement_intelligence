
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/student-features', require('./routes/student-features')); 
app.use('/api/college-features', require('./routes/college-features')); 
app.use('/api/recruiter-features', require('./routes/recruiter-features')); 

app.get('/', (req, res) => {
  res.send('Placement Intelligence Platform API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Please make sure MongoDB is running on your system');
  console.error('You can start MongoDB with: mongod (or use MongoDB Atlas for cloud)');
  // Don't exit process, let server start but log the error
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
