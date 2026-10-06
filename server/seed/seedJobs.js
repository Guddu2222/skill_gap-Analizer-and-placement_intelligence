/**
 * seedJobs.js — Run once to populate the Jobs collection with sample opportunities
 * Usage: node server/seed/seedJobs.js
 */

const dns = require("dns");
dns.setServers(["8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Job = require("../models/Job");

const jobs = [
  // ── Full Stack Roles ───────────────────────────────────────────────────────
  {
    title: "Full Stack Developer",
    company: "TCS Digital",
    description:
      "Work on enterprise-grade web applications using React, Node.js and MongoDB. Collaborate with cross-functional teams to deliver scalable solutions.",
    location: "Bangalore",
    salary: "8-12 LPA",
    jobType: "Full Time",
    requirements: ["React.js", "Node.js", "MongoDB", "JavaScript", "REST APIs", "Git"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: "MERN Stack Developer",
    company: "Infosys",
    description:
      "Build and maintain full-stack applications using the MERN stack. Participate in Agile sprints and code reviews.",
    location: "Hyderabad",
    salary: "7-10 LPA",
    jobType: "Full Time",
    requirements: ["MongoDB", "Express.js", "React.js", "Node.js", "CSS", "HTML"],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Frontend Developer",
    company: "Flipkart",
    description:
      "Create responsive, high-performance UIs for one of India's largest e-commerce platforms. Strong JS fundamentals required.",
    location: "Bangalore",
    salary: "10-15 LPA",
    jobType: "Full Time",
    requirements: ["React.js", "JavaScript", "CSS", "HTML", "TypeScript", "Redux"],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Backend Developer",
    company: "Razorpay",
    description:
      "Design and build scalable microservices for payment processing infrastructure. Experience with high-throughput APIs required.",
    location: "Bangalore",
    salary: "12-18 LPA",
    jobType: "Full Time",
    requirements: ["Node.js", "Express.js", "MongoDB", "SQL", "REST APIs", "Docker"],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Software Engineer – Full Stack",
    company: "Zoho",
    description:
      "Join Zoho's product team to build world-class SaaS products. Work on both frontend and backend systems.",
    location: "Chennai",
    salary: "6-9 LPA",
    jobType: "Full Time",
    requirements: ["Java", "JavaScript", "SQL", "HTML", "CSS", "Git"],
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },

  // ── Data Science / AI Roles ────────────────────────────────────────────────
  {
    title: "Data Scientist",
    company: "Swiggy",
    description:
      "Use ML and data analytics to optimise delivery logistics, customer experience and demand forecasting.",
    location: "Bangalore",
    salary: "14-20 LPA",
    jobType: "Full Time",
    requirements: ["Python", "Machine Learning", "SQL", "Pandas", "NumPy", "TensorFlow"],
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Machine Learning Engineer",
    company: "Ola",
    description:
      "Build and deploy ML models for real-time route optimisation and driver behaviour prediction.",
    location: "Bangalore / Remote",
    salary: "16-24 LPA",
    jobType: "Full Time",
    requirements: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Docker", "REST APIs"],
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Data Analyst",
    company: "HDFC Bank Tech",
    description:
      "Analyse large datasets to generate business insights and drive data-informed decisions across banking operations.",
    location: "Mumbai",
    salary: "6-10 LPA",
    jobType: "Full Time",
    requirements: ["SQL", "Python", "Excel", "Power BI", "Pandas", "Statistics"],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },

  // ── DevOps / Cloud Roles ───────────────────────────────────────────────────
  {
    title: "DevOps Engineer",
    company: "Wipro",
    description:
      "Manage CI/CD pipelines, containerised workloads and cloud infrastructure on AWS/GCP for enterprise clients.",
    location: "Pune",
    salary: "8-14 LPA",
    jobType: "Full Time",
    requirements: ["Docker", "Kubernetes", "AWS", "Linux", "Git", "Jenkins"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Cloud Engineer",
    company: "HCL Technologies",
    description:
      "Design and implement cloud-native solutions on AWS. Manage infrastructure as code using Terraform.",
    location: "Noida",
    salary: "9-14 LPA",
    jobType: "Full Time",
    requirements: ["AWS", "Terraform", "Docker", "Linux", "Python", "Networking"],
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
  },

  // ── Internships ────────────────────────────────────────────────────────────
  {
    title: "Full Stack Intern",
    company: "Startup India – BuildFast",
    description:
      "6-month paid internship. Work alongside senior developers on real product features. Pre-placement offer based on performance.",
    location: "Remote",
    salary: "₹25,000/month",
    jobType: "Internship",
    requirements: ["React.js", "Node.js", "JavaScript", "HTML", "CSS"],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Data Science Intern",
    company: "CRED",
    description:
      "Work with real financial datasets. Apply ML models for credit risk and personalisation features.",
    location: "Bangalore",
    salary: "₹30,000/month",
    jobType: "Internship",
    requirements: ["Python", "Pandas", "NumPy", "Machine Learning", "SQL"],
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Backend Intern",
    company: "PhonePe",
    description:
      "Build microservices and APIs for India's leading UPI payments platform. Mentored by senior engineers.",
    location: "Bangalore",
    salary: "₹35,000/month",
    jobType: "Internship",
    requirements: ["Java", "Spring Boot", "SQL", "Git", "REST APIs"],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Frontend Intern",
    company: "Meesho",
    description:
      "Build UI components for a social commerce app used by 130M+ users. React/TypeScript codebase.",
    location: "Bangalore / Remote",
    salary: "₹20,000/month",
    jobType: "Internship",
    requirements: ["React.js", "HTML", "CSS", "JavaScript", "Git"],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Android Development Intern",
    company: "ShareChat",
    description:
      "Contribute to the Android app used by 180M+ users. Work on performance, animations and new features.",
    location: "Bangalore",
    salary: "₹30,000/month",
    jobType: "Internship",
    requirements: ["Android", "Kotlin", "Java", "Git", "REST APIs"],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },

  // ── Other Tech Roles ───────────────────────────────────────────────────────
  {
    title: "Software Engineer (SDE-1)",
    company: "Amazon India",
    description:
      "Design, build and ship high-quality software for Amazon's supply chain and logistics systems.",
    location: "Hyderabad",
    salary: "20-28 LPA",
    jobType: "Full Time",
    requirements: ["Java", "Data Structures", "Algorithms", "SQL", "System Design", "Git"],
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Software Development Engineer",
    company: "Microsoft India",
    description:
      "Join the Azure team to build cloud-scale distributed systems. Ownership from design to production.",
    location: "Hyderabad / Bangalore",
    salary: "22-32 LPA",
    jobType: "Full Time",
    requirements: ["C#", "Python", "SQL", "Azure", "Data Structures", "System Design"],
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Cybersecurity Analyst",
    company: "Deloitte India",
    description:
      "Assess and mitigate security risks for enterprise clients. Conduct penetration testing and vulnerability assessments.",
    location: "Mumbai",
    salary: "8-13 LPA",
    jobType: "Full Time",
    requirements: ["Networking", "Linux", "Python", "Cybersecurity", "SQL", "Git"],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    title: "React Native Developer",
    company: "Nykaa",
    description:
      "Build cross-platform mobile features for Nykaa's fashion and beauty app with 45M+ downloads.",
    location: "Mumbai / Remote",
    salary: "9-14 LPA",
    jobType: "Full Time",
    requirements: ["React Native", "JavaScript", "React.js", "REST APIs", "Git"],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Java Backend Developer",
    company: "Accenture",
    description:
      "Build enterprise Java applications for Fortune 500 clients. Experience with Spring Boot required.",
    location: "Pune",
    salary: "7-11 LPA",
    jobType: "Full Time",
    requirements: ["Java", "Spring Boot", "SQL", "REST APIs", "Microservices", "Git"],
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Job.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  ${existing} jobs already exist. Clearing and re-seeding...`);
      await Job.deleteMany({});
    }

    const inserted = await Job.insertMany(jobs);
    console.log(`✅ Seeded ${inserted.length} jobs successfully!`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
