const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Alumni = require("../models/Alumni");

dotenv.config({ path: "../.env" });

const alumniSeedData = [
  {
    name: "Priya Sharma",
    company: "Amazon",
    role: "SDE II",
    batch: 2022,
    department: "Computer Science",
    email: "priya.sharma@example.com",
    linkedInProfile: "https://linkedin.com/in/priya-sharma-tech",
    skills: ["Java", "AWS", "System Design", "Microservices"],
    isMentor: true,
  },
  {
    name: "Rahul Verma",
    company: "Uber",
    role: "Senior Frontend Engineer",
    batch: 2023,
    department: "Information Science",
    email: "rahul.verma@example.com",
    linkedInProfile: "https://linkedin.com/in/rahul-verma-fe",
    skills: ["React", "Redux", "TypeScript", "Performance Tuning"],
    isMentor: true,
  },
  {
    name: "Ankit Gupta",
    company: "Microsoft",
    role: "Data Scientist",
    batch: 2021,
    department: "Computer Science",
    email: "ankit.gupta@example.com",
    linkedInProfile: "https://linkedin.com/in/ankit-gupta-ds",
    skills: ["Python", "Machine Learning", "Azure", "PyTorch"],
    isMentor: true,
  },
  {
    name: "Sneha Reddy",
    company: "Google",
    role: "Product Manager",
    batch: 2020,
    department: "Electronics & Comm",
    email: "sneha.reddy@example.com",
    linkedInProfile: "https://linkedin.com/in/sneha-reddy-pm",
    skills: ["Product Strategy", "Analytics", "UX Research", "Agile"],
    isMentor: true,
  },
  {
    name: "Vikram Malhotra",
    company: "Meta",
    role: "Backend Architect",
    batch: 2019,
    department: "Computer Science",
    email: "vikram.m@example.com",
    linkedInProfile: "https://linkedin.com/in/vikram-malhotra",
    skills: ["C++", "Distributed Systems", "GraphQL", "Database Optimization"],
    isMentor: true,
  },
  {
    name: "Ananya Deshmukh",
    company: "Goldman Sachs",
    role: "Quant Analyst",
    batch: 2022,
    department: "Information Technology",
    email: "ananya.d@example.com",
    linkedInProfile: "https://linkedin.com/in/ananya-deshmukh",
    skills: ["Algorithms", "Python", "Financial Modeling", "C++"],
    isMentor: true,
  },
];

const runSeed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/placement_platform"
    );
    console.log("MongoDB connected for Alumni seeding");

    await Alumni.deleteMany({});
    const inserted = await Alumni.insertMany(alumniSeedData);
    console.log(`✅ Successfully seeded ${inserted.length} Alumni mentors!`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Alumni seeding failed:", err.message);
    process.exit(1);
  }
};

runSeed();
