const mongoose = require('mongoose');
require('dotenv').config();
const SkillLearningPath = require('./models/SkillLearningPath');

async function clean() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/placement_platform");
    
    // Find all OOP related paths
    const paths = await SkillLearningPath.find({ 
      skillName: { $regex: /Object-Oriented/i } 
    });
    console.log('Found paths:', paths.map(p => ({id: p._id, name: p.skillName})));
    
    // Delete the redundant "Object-Oriented Design Principles"
    const result = await SkillLearningPath.deleteOne({ 
      skillName: /Object-Oriented Design Principles/i 
    });
    
    console.log('Deleted redundant path. Count:', result.deletedCount);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

clean();
