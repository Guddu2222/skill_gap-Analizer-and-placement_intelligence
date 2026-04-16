---
marp: true
theme: default
class: lead
backgroundColor: #f4f4f5
paginate: true
style: |
  section {
    font-family: 'Inter', sans-serif;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
  }
---

# 🚀 SkillBridge 

**Predictive Placement & Skill Gap Analytics Platform**

Bridging the gap between Campus Preparation and Corporate Requirements.

---

## 🎯 The Problem

- **Students** lack clarity on what exact skills are needed for their target roles.
- **Colleges** struggle with tracking the specific placement readiness of hundreds of students.
- **Recruiters** waste time sifting through resumes that don't precisely match their technical requirements.

---

## 💡 The Solution

**An intelligent, RBAC-driven platform featuring three dedicated portals:**

1. 🎓 **Student Portal**
2. 🏛️ **College Portal**
3. 💼 **Recruiter Portal**

Provides end-to-end recruitment lifecycle management and upskilling guidance.

---

## ✨ Unique Features

- 📊 **Skill Radar & Gap Analysis:** AI-driven profiling of missing skills.
- 🛣️ **Personalized Learning Paths:** Automated course recommendations.
- 🎯 **Predictive Candidate Match:** Match scores for recruiters based on hard skills and proficiencies.
- 📅 **Drive Management:** Streamlined campus placement workflow.
- 🎤 **Interview Prep & Alumni Mentorship:** Built-in guidance ecosystem.

---

## 🏗️ Technical Architecture

**Built on the scalable MERN Stack**

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js (MVC Pattern)
- **Database:** MongoDB Atlas, Mongoose
- **Security:** JWT Authentication, Bcrypt Hashing
- **Architecture:** API-Driven, RESTful Principles

---

## MVC Backend Pattern

- 🗄️ **Models:** Defining schemas (`Student`, `Job`, `Candidate`)
- ⚙️ **Controllers:** Business logic (`Skill Gap Calculation`, `Auth`)
- 🛣️ **Routes:** Exposing clean API endpoints

---

## Database Design

**Why NoSQL / MongoDB?**
- Highly flexible schema for dynamic skill arrays and nested user profiles.
- Separation of concerns: the core `User` model handles authentication while referencing specialized profiles (`Student`, `College`, `Recruiter`).

---

## 🚀 Conclusion

**SkillBridge** replaces manual, chaotic placement processes with a data-driven, predictive model. 

It ensures **Students get skilled**, **Colleges look good**, and **Recruiters get the right talent securely.**

---

# Thank You! 
Any Questions?
