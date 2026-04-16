# System Design Flowchart Prompt
## For: Skill Gap Analyser & Placement Intelligence Platform

---

## System Overview
Create a comprehensive system design flowchart diagram for a **Placement Intelligence Platform** that connects three primary stakeholders: **Students**, **Colleges (Placement Offices)**, and **Recruiters**. The platform provides AI-driven skill gap analysis, placement analytics, recruiter management, and intelligent matching capabilities.

---

## Core Technology Stack
- **Frontend**: React 18 + Vite + TailwindCSS + React Router DOM
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Visualization**: Recharts library
- **UI Components**: Lucide React icons

---

## User Roles & Primary Features

### 1. **Students**
- **Skill Gap Analysis**: Compare student skills vs. target role requirements
- **Alumni Network**: Connect with alumni from dream companies
- **Interview Preparation**: Access company-specific interview experiences
- **Job Applications**: Apply for jobs and track application status
- **Personalized Dashboard**: View placement stats, skill scores, recommendations

### 2. **College (Placement Office)**
- **Curriculum Gap Analysis**: Analyze market demand vs. student skill supply
- **At-Risk Student Radar**: Identify students needing intervention
- **Automated Shortlisting**: Filter students by CGPA, skills, department
- **Recruiter CRM**: Manage recruiter relationships and track historical data
- **Analytics Dashboard**: Placement statistics, trending skills, success metrics

### 3. **Recruiters**
- **Smart Shortlisting**: AI-powered candidate matching
- **Offer Acceptance Probability**: Predict likelihood of offer acceptance
- **Campus ROI Engine**: Analyze hiring ROI per college
- **Automated Interview Scheduling**: Intelligent scheduling with conflict resolution
- **Recruiter Dashboard**: Track applications, manage job postings

---

## Data Models (MongoDB Collections)

### **User**
- `_id`, `name`, `email`, `password` (hashed), `role` (student/college/recruiter)

### **Student**
- `user` (ref: User), `rollNumber`, `department`, `year`, `cgpa`
- `skills[]`, `targetRole`, `dreamCompanies[]`, `resume`
- `placementStatus` (placed/unplaced/opted_out)
- `applications[]` (ref: Application)

### **Alumni**
- `name`, `company`, `role`, `batch`, `department`
- `linkedInProfile`, `email`, `skills[]`, `isMentor`

### **Job**
- `company`, `title`, `description`, `location`, `salary`
- `jobType` (Full Time/Internship), `requirements[]`
- `deadline`, `postedBy` (ref: User), `applicants[]`

### **Application**
- `job` (ref: Job), `student` (ref: Student)
- `status` (applied/shortlisted/interviewed/offered/rejected)
- `appliedAt`

### **InterviewExperience**
- `company`, `role`, `round`, `questions[]`, `difficulty`
- `tips`, `postedBy`, `createdAt`

---

## API Routes & Backend Services

### **Authentication** (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login with JWT

### **Jobs** (`/api/jobs`)
- GET `/` - Fetch all jobs
- POST `/` - Create job posting
- GET `/:id` - Get job details
- POST `/:id/apply` - Apply to job

### **Student Features** (`/api/student-features`)
- GET `/skill-gap` - Get skill gap analysis
- GET `/alumni` - Get recommended alumni
- GET `/interviews` - Get interview experiences (filterable by company)

### **College Features** (`/api/college-features`)
- GET `/curriculum-gap` - Analyze market demand vs student skills
- GET `/at-risk` - Identify at-risk students
- POST `/shortlist` - Automated student shortlisting
- GET `/recruiter-crm` - Recruiter relationship data

### **Recruiter Features** (`/api/recruiter-features`)
- POST `/offer-probability` - Predict offer acceptance probability
- GET `/campus-roi` - Campus hiring ROI analytics
- POST `/auto-schedule` - Automated interview scheduling

### **Analytics** (`/api/analytics`)
- GET `/placement-stats` - Overall placement statistics

---

## Frontend Routes & Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Marketing homepage with features |
| `/login` | Login | Authentication page |
| `/student` | StudentDashboard | Student home with stats & quick actions |
| `/student/skills` | SkillIntelligence | Detailed skill gap analysis |
| `/student/alumni` | AlumniNetwork | Alumni directory & connections |
| `/student/interviews` | InterviewPrep | Interview experiences database |
| `/college` | CollegeDashboard | Placement office analytics hub |
| `/college/recruiters` | RecruiterCRM | Recruiter relationship management |
| `/recruiter` | RecruiterDashboard | Recruiter job & application management |
| `/recruiter/smart-shortlist` | SmartShortlist | AI-powered candidate matching |

---

## Key System Flows to Include in Diagram

### **Flow 1: Student Skill Gap Analysis**
1. Student logs in → JWT authentication
2. Navigate to Skill Intelligence page
3. Frontend calls GET `/api/student-features/skill-gap`
4. Backend retrieves student profile from MongoDB
5. Compares student skills vs. target role requirements
6. Calculates match score and identifies gaps
7. Returns: targetRole, matchScore, missingSkills, acquiredSkills
8. Frontend displays visual analysis with Recharts

### **Flow 2: College Curriculum Gap Analysis**
1. College admin logs in
2. Navigate to College Dashboard
3. Frontend calls GET `/api/college-features/curriculum-gap`
4. Backend aggregates all Job requirements (market demand)
5. Backend aggregates all Student skills (supply)
6. Calculates gap: demand - supply per skill
7. Identifies critical gaps (high demand, low supply)
8. Returns top demanded skills and critical gaps
9. Frontend displays charts and actionable insights

### **Flow 3: Recruiter Offer Acceptance Prediction**
1. Recruiter logs in
2. Views shortlisted candidates
3. Selects a candidate and enters offer details (CTC, location)
4. Frontend calls POST `/api/recruiter-features/offer-probability`
5. Backend applies ML/heuristic model considering:
   - Offer CTC vs. student expectations
   - Location preferences
   - Competing offers probability
6. Returns: joiningProbability, riskLevel, riskFactors
7. Frontend displays prediction with risk indicators

### **Flow 4: Student Job Application**
1. Student browses jobs on dashboard
2. Clicks "Apply" on a job
3. Frontend calls POST `/api/jobs/:id/apply`
4. Backend creates Application record
5. Updates Job's applicants array
6. Updates Student's applications array
7. Returns confirmation
8. Frontend updates UI with "Applied" status

### **Flow 5: Alumni Network Recommendation**
1. Student navigates to Alumni Network
2. Frontend calls GET `/api/student-features/alumni`
3. Backend retrieves student's dream companies
4. Queries Alumni collection for matching companies
5. Returns alumni profiles
6. Frontend displays cards with contact options

---

## Diagram Components to Include

### **External Entities**
- Student (Browser)
- College Admin (Browser)
- Recruiter (Browser)

### **Frontend Layer**
- React App (Vite)
- React Router (Routing)
- Axios (HTTP Client)
- UI Components (Forms, Charts, Cards)

### **Backend Layer**
- Express Server
- JWT Middleware (Authentication)
- Route Handlers (6 route files)
- Business Logic (Analysis, Predictions, Scheduling)

### **Database Layer**
- MongoDB
- Collections: User, Student, Alumni, Job, Application, InterviewExperience

### **Key Middleware**
- CORS
- JSON Body Parser
- JWT Authentication (`auth` middleware)

---

## Technical Integrations & Algorithms

### **Skill Gap Analysis Algorithm**
```
1. Fetch student skills
2. Fetch target role required skills (from predefined mapping)
3. Calculate: missingSkills = requiredSkills - studentSkills
4. Calculate: matchScore = ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
5. Return analysis
```

### **At-Risk Student Detection**
```
1. Fetch all unplaced students
2. For each student:
   - Check if CGPA < 7 → add "Low CGPA" risk
   - Check if skills.length < 3 → add "Low Skill Count" risk
   - Check if applications > 10 with no offers → add "High Rejection Rate" risk
3. Classify: riskLevel = (riskFactors.length >= 2) ? 'Critical' : 'Moderate'
4. Return at-risk list
```

### **Offer Acceptance Prediction**
```
1. Base probability = 70%
2. If offerCTC < expectedCTC → probability -= 20%
3. If location not in preferences → probability -= 15%
4. If has competing offers → probability -= 25%
5. Cap probability between 10-99%
6. Classify risk: High (<50%), Medium (50-80%), Low (>80%)
```

---

## Data Flow Patterns

### **Authentication Flow**
User → Login Form → POST `/api/auth/login` → Verify credentials → Generate JWT → Store in localStorage → Attach to all subsequent requests via Authorization header

### **Protected Route Access**
Request → Express → `auth` middleware → Verify JWT → Extract userId → Attach to req.user → Continue to route handler

### **Database Query Pattern**
Route Handler → Mongoose Model → MongoDB Query → Transform Data → JSON Response → Frontend → State Update → UI Render

---

## Non-Functional Requirements

### **Performance**
- API response time < 300ms
- Database queries optimized with indexes
- Pagination for large datasets

### **Security**
- Passwords hashed with bcryptjs
- JWT tokens for stateless authentication
- CORS enabled for cross-origin requests
- Input validation on all endpoints

### **Scalability**
- Modular route structure
- RESTful API design
- Stateless backend (horizontally scalable)
- MongoDB for flexible schema evolution

---

## Suggested Flowchart Structure

### **High-Level Architecture**
```
[Student Browser] ──┐
[College Browser] ──┼──> [React Frontend (Vite)] ──> [Express Backend] ──> [MongoDB]
[Recruiter Browser]─┘        ↓                           ↓
                      [React Router]              [JWT Middleware]
                      [Axios HTTP]                [Route Controllers]
                      [Recharts]                  [Mongoose Models]
```

### **Detailed Component Interaction**
1. **User Interface Layer**
   - Landing Page → Login → Role-based Dashboards

2. **API Gateway Layer**
   - Express routes grouped by feature
   - Authentication middleware

3. **Business Logic Layer**
   - Skill gap calculations
   - Prediction algorithms
   - Data aggregations

4. **Data Persistence Layer**
   - MongoDB collections
   - Relationships via ObjectId references

---

## Visual Diagram Recommendations

### **Color Coding**
- 🟦 **Blue**: Frontend components
- 🟩 **Green**: Backend services
- 🟨 **Yellow**: Database entities
- 🟥 **Red**: External integrations (future: email, calendar)
- ⚪ **White**: User interactions

### **Symbol Conventions**
- **Rectangles**: Processes/Services
- **Cylinders**: Databases
- **Circles**: Start/End points
- **Diamonds**: Decision points
- **Arrows**: Data/Control flow

### **Grouping**
- Use swim lanes for each user role
- Group related features in bounded contexts
- Separate layers (Frontend, Backend, Database)

---

## Future Enhancements (Optional to Include)

- Real-time chat between students and alumni
- Email notifications for job applications
- Calendar integration for interview scheduling
- ML model training for better predictions
- Resume parsing and auto-skill extraction
- Video interview integration
- Mobile app (React Native)

---

## Prompt Usage Instructions

**For Mermaid.js or Lucidchart:**
Use this document to create a flowchart showing:
1. All user types and their entry points
2. Frontend pages and routing
3. API endpoints and their handlers
4. Database collections and relationships
5. Key data flows (at least 3-5 major flows)
6. Authentication mechanism
7. Business logic components

**For PlantUML:**
Focus on sequence diagrams for critical flows like skill gap analysis, job application, and offer prediction.

**For Draw.io:**
Create a layered architecture diagram with clear separation of concerns and bidirectional data flows.

---

**Generated for**: Skill Gap Analyser & Placement Intelligence Platform  
**Technology**: MERN Stack (MongoDB, Express, React, Node.js)  
**Purpose**: Technical documentation for system design visualization
