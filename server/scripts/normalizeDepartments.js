require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const { normalizeDepartment } = require('../utils/departmentHelper');

async function migrate() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGO_URI provided in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const students = await Student.find({});
  console.log(`Found ${students.length} student records`);

  let updated = 0;
  for (const s of students) {
    const original = s.department;
    const normalized = normalizeDepartment(original);

    if (original !== normalized) {
      console.log(`Updating ${s.email || s._id}: "${original}" -> "${normalized}"`);
      await Student.updateOne({ _id: s._id }, { $set: { department: normalized } });
      updated++;
    }
  }

  console.log(`Successfully normalized ${updated} records.`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
