
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_platform')
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.error(err));

const seedJobs = [
  {
    company: 'Google',
    title: 'Software Engineer',
    description: 'Work on Google Search.',
    location: 'Bangalore',
    salary: '25 LPA',
    jobType: 'Full Time',
    requirements: ['React', 'Node.js', 'DSA'],
    deadline: new Date('2024-03-01')
  },
  {
    company: 'Microsoft',
    title: 'SDE II',
    description: 'Azure Cloud Team.',
    location: 'Hyderabad',
    salary: '28 LPA',
    jobType: 'Full Time',
    requirements: ['C#', 'Azure', 'System Design'],
    deadline: new Date('2024-02-28')
  },
  {
    company: 'Amazon',
    title: 'SDE I',
    description: 'AWS Team.',
    location: 'Bangalore',
    salary: '24 LPA',
    jobType: 'Full Time',
    requirements: ['Java', 'AWS', 'DSA'],
    deadline: new Date('2024-03-15')
  }
];

const seedDB = async () => {
  try {
    await Job.deleteMany({});
    await Job.insertMany(seedJobs);
    console.log('Jobs seeded');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDB();
