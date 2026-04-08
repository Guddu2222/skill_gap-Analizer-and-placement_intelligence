const mongoose = require('mongoose');
require('dotenv').config();
const SkillLearningPath = require('./models/SkillLearningPath');

const progressionNames = [
  "Foundations & Setup",
  "Core Concepts & Syntax",
  "Intermediate Implementation",
  "Advanced Techniques & Patterns",
  "Real-world Application & Architecture",
  "Performance Optimization & Debugging",
  "Testing & Best Practices",
  "Mastery & Interview Preparation"
];

async function updateDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/placement_platform");
    
    const paths = await SkillLearningPath.find({});
    let count = 0;

    for (const path of paths) {
      if (path.milestones && path.milestones.length > 0) {
        let changed = false;
        
        path.milestones.forEach((m, index) => {
          if (m.title && m.title.includes("Basics")) {
             const i = index + 1;
             const theme = progressionNames[i - 1] || "Continued Practice";
             m.title = `Week ${i}: ${theme}`;
             m.description = `Complete required readings, tutorials, and practical exercises for ${path.skillName} focusing on ${theme.toLowerCase()}.`;
             changed = true;
          }
        });

        if (changed) {
          await path.save();
          count++;
        }
      }
    }
    
    console.log(`Successfully migrated ${count} paths to progressive milestone titles.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateDb();
