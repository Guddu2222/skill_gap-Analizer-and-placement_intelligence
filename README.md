# SkillBridge — Skill Gap Analyser & Placement Intelligence Platform

> A full-stack, AI-powered MERN application that bridges the gap between student skills, institutional placement management, and corporate hiring intelligence through predictive analytics, shared-state Kanban workflows, and curated learning paths.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features by Role](#core-features-by-role)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Frontend Routing](#frontend-routing)
8. [Authentication & Security](#authentication--security)
9. [AI & Intelligence Layer](#ai--intelligence-layer)
10. [Campus Drive Module](#campus-drive-module)
11. [Local Development Setup](#local-development-setup)
12. [Environment Variables](#environment-variables)
13. [Deployment](#deployment)

---

## Project Overview

**SkillBridge** is a multi-role SaaS placement intelligence platform designed for the modern university ecosystem. It operates on three distinct personas — **Student**, **College (TPO)**, and **Recruiter** — each with a dedicated, permission-scoped dashboard.

The platform solves three critical problems:

| Problem | Solution |
|---|---|
| Students don't know what skills they lack | AI-powered Skill Gap Analyser with curated weekly learning paths |
| TPOs manage drives manually via spreadsheets | Shared-state Kanban board with automated status tracking |
| Recruiters struggle to find college talent | Bi-directional Drive Request system (Model A + Model B handshake) |

---

## Core Features by Role

### 🎓 Student Portal

| Feature | Description |
|---|---|
| **Profile Builder** | Multi-step profile wizard: personal info, skills, CGPA, resume upload |
| **Skill Gap Analyser** | AI analysis against target domain/role using Gemini API |
| **Learning Path Tracker** | Milestone-based weekly study plans with progress tracking |
| **Milestone Quizzes** | AI-generated per-milestone quizzes; passing auto-completes milestone |
| **Resume Upload & ATS** | Upload to Cloudinary; ATS Reality Check scores resume vs job descriptions |
| **Campus Drive Portal** | View active college drives, eligibility check, one-click apply |
| **Interview Prep** | Access interview experiences and mock interview sessions |
| **Job Opportunities** | Smart job matching with skill-based percentage match scores |
| **Profile Score** | Dynamic placement readiness score based on profile completeness |

### 🏛️ College (TPO) Portal

| Feature | Description |
|---|---|
| **College Dashboard** | Macro analytics: placement rate, department breakdown, active drives |
| **Campus Drives (Kanban)** | Full 6-stage Kanban: Applied → Aptitude → Technical → HR → Offered → Rejected |
| **Drive Creation** | Create drives with eligibility (min CGPA), assign a specific recruiter |
| **Incoming Drive Requests** | Accept recruiter-initiated invites; auto-provisions a new drive on accept |
| **Student Management** | View and track all enrolled students and their placement readiness |
| **Recruiter CRM** | Track partner recruiter relationships, visit history, hire rates |
| **Analytics** | Placement success rates by department and academic year |

### 💼 Recruiter Portal

| Feature | Description |
|---|---|
| **Recruiter Dashboard** | Overview of active drives, shortlisted candidates, open positions |
| **Jobs & Postings** | Create job postings with requirements; manage the full listing lifecycle |
| **Invite Colleges (Model B)** | Send campus drive invites to colleges directly from a job posting |
| **Assigned Drives (Kanban)** | Shared-state Kanban showing candidates pushed from Technical Interview onwards |
| **Smart Shortlister** | Filter students across all colleges by skills, CGPA, and department |
| **College Explorer** | Browse partner colleges, view placement stats, initiate drive requests |
| **Saved Candidates** | Bookmark promising candidates for later review |
| **Domain Experts** | Access a directory of verified industry mentors |

---

## System Architecture

SkillBridge uses a **3-tier MVC architecture**:

```
┌─────────────────────────────────────────────┐
│          React Frontend (Vite)              │
│  Role-based routing | Glassmorphic UI       │
└───────────────────┬─────────────────────────┘
                    │ HTTPS / Axios
┌───────────────────▼─────────────────────────┐
│        Express.js REST API (Node.js)        │
│  JWT Auth | Role Middleware | Route Guards  │
│  ┌─────────────────────────────────────┐    │
│  │ Routes → Controllers → Services    │    │
│  └─────────────────────────────────────┘    │
└───────────────────┬─────────────────────────┘
                    │ Mongoose ODM
┌───────────────────▼─────────────────────────┐
│              MongoDB Atlas                  │
│  17 Collections | Indexes | Refs            │
└─────────────────────────────────────────────┘

External Services:
  ├── Google Gemini API  → Skill Gap & Quiz AI
  ├── Cloudinary CDN     → Resume & Avatar Storage
  ├── Google OAuth 2.0   → Social Login
  └── Nodemailer         → Email Verification & Password Reset
```

### Campus Drive Data Flow (Hybrid Model)

```
MODEL A — College Initiates:
College Admin → Creates Drive → Assigns Recruiter → Students Apply
    │                                                      │
    └──────────────── Shared Kanban ◄──────────────────────┘
                          │
                    Recruiter sees candidates
                    in Technical Interview+

MODEL B — Recruiter Initiates:
Recruiter → Creates Job → Invites College → TPO Accepts
                                              │
                              Drive Auto-Provisioned on Kanban
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI Framework |
| Vite | 5.x | Build tool & dev server |
| React Router DOM | v6 | Client-side routing |
| Tailwind CSS | 3.x | Utility-first styling |
| @hello-pangea/dnd | latest | Drag & Drop Kanban |
| Axios | latest | HTTP client |
| Lucide React | latest | Icon system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18.x | Runtime |
| Express.js | 4.x | Web framework |
| Mongoose | 7.x | MongoDB ODM |
| JSON Web Token | latest | Stateless authentication |
| Bcrypt.js | latest | Password hashing |
| Passport.js | latest | OAuth 2.0 strategies |
| Multer + Cloudinary | latest | File upload pipeline |
| Nodemailer | latest | Transactional email |
| Google Generative AI | latest | Gemini API integration |

### Database & Cloud
| Service | Purpose |
|---|---|
| MongoDB Atlas | Primary database (cloud) |
| Cloudinary | Resume & image CDN |
| Vercel / Railway | Deployment targets |

---

## Database Schema

### Models Overview

| Model | Collection | Key Fields |
|---|---|---|
| `User` | users | name, email, password, role, company, avatar |
| `Student` | students | user, college, skills[], cgpa, resumeUrl, targetRole |
| `College` | colleges | name, location, accreditation, totalStudents |
| `Job` | jobs | title, company, requirements[], salary, postedBy |
| `CampusDrive` | campusdrives | college, recruiter, jobId, title, eligibility, status |
| `DriveApplication` | driveapplications | student, drive, status (Kanban stage) |
| `DriveRequest` | driverequests | job, recruiter, college, status (pending/accepted/rejected) |
| `SkillGapAnalysis` | skillgapanalyses | student, targetDomain, gapSkills[], matchScore |
| `SkillLearningPath` | skilllearningpaths | student, skillName, milestones[], progressPercentage |
| `DomainSkillRequirement` | domainskillrequirements | domain, role, requiredSkills[] |
| `MockInterview` | mockinterviews | student, questions[], feedback |
| `InterviewExperience` | interviewexperiences | student, company, role, experience |
| `Alumni` | alumni | student, company, role, graduationYear |
| `SavedCandidate` | savedcandidates | recruiter, student, notes |
| `JobMarketTrend` | jobmarkettrends | domain, trendingSkills[], demandScore |
| `Application` | applications | student, job, status, appliedAt |
| `StudentSkill` | studentskills | student, skillName, proficiencyLevel, verified |

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user (any role) |
| POST | `/login` | ❌ | Login, returns JWT |
| POST | `/forgot-password` | ❌ | Send reset email |
| POST | `/reset-password/:token` | ❌ | Reset password via token |
| POST | `/verify-email` | ❌ | Verify email with OTP |
| GET | `/google` | ❌ | Google OAuth initiation |
| GET | `/google/callback` | ❌ | Google OAuth callback |

### Student Features — `/api/student-features`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | ✅ | Get student profile |
| PUT | `/profile` | ✅ | Update student profile |
| POST | `/upload-resume` | ✅ | Upload PDF resume to Cloudinary |
| GET | `/resume-view` | ✅ | Redirect to Cloudinary resume URL |
| POST | `/upload-avatar` | ✅ | Upload profile photo |
| GET | `/drives` | ✅ | Get active drives for student's college |
| POST | `/drives/:id/apply` | ✅ | Apply to a campus drive |
| GET | `/job-opportunities` | ✅ | Get skill-matched job listings |
| GET | `/alumni` | ✅ | Get alumni mentor directory |
| GET | `/interview-experiences` | ✅ | Browse interview experiences |

### Skill Gap Module — `/api/skill-gap`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/analyze` | ✅ Student | Trigger AI skill gap analysis |
| GET | `/latest` | ✅ Student | Get latest analysis result |
| GET | `/history` | ✅ Student | Get analysis history (last 10) |
| GET | `/domains` | ❌ | List all available target domains & roles |
| GET | `/learning-paths` | ✅ Student | Get all learning paths (deduplicated) |
| PATCH | `/learning-paths/:id/progress` | ✅ Student | Update milestone progress |
| POST | `/learning-paths/:id/reschedule` | ✅ Student | Reschedule overdue milestones |
| POST | `/learning-paths/:id/milestones/:idx/quiz/generate` | ✅ Student | AI-generate milestone quiz |
| POST | `/learning-paths/:id/milestones/:idx/quiz/submit` | ✅ Student | Submit quiz, auto-complete on pass |

### College Features — `/api/college-features`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | ✅ College | Get dashboard stats & KPIs |
| GET | `/students` | ✅ College | Get all enrolled students |
| GET | `/analytics` | ✅ College | Placement analytics by department |
| GET | `/recruiters` | ✅ College | Get all registered recruiters |
| GET | `/drive-requests` | ✅ College | Get incoming recruiter drive invites |
| PUT | `/drive-requests/:id/accept` | ✅ College | Accept invite → auto-create drive |
| GET | `/crm` | ✅ College | Get recruiter CRM relationship data |

### Campus Drives — `/api/campus-drives`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ College | Get all drives for the college |
| POST | `/` | ✅ College | Create a new campus drive |
| GET | `/:id/applications` | ✅ College | Get Kanban applications for a drive |
| PUT | `/:id/applications/:appId/status` | ✅ College | Move application to new Kanban stage |

### Recruiter Features — `/api/recruiter-features`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/candidates` | ✅ Recruiter | Smart shortlist with filters |
| GET | `/saved-candidates` | ✅ Recruiter | Get bookmarked candidates |
| POST | `/save-candidate` | ✅ Recruiter | Bookmark a student |
| GET | `/colleges` | ✅ Recruiter | Browse college network |
| GET | `/drives` | ✅ Recruiter | Get all assigned drives |
| GET | `/drives/:id/applications` | ✅ Recruiter | Get Kanban apps for assigned drive |
| PUT | `/drives/:id/applications/:appId/status` | ✅ Recruiter | Update candidate Kanban stage |
| POST | `/drive-requests` | ✅ Recruiter | Send college drive invite for a job |

### Jobs — `/api/jobs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | List all job postings |
| POST | `/` | ✅ Recruiter | Create new job posting |
| GET | `/me` | ✅ Recruiter | Get jobs posted by current recruiter |
| GET | `/opportunities` | ✅ Student | Get skill-matched opportunities |

### Other Routes

| Route Base | Endpoint | Description |
|---|---|---|
| `/api/ats` | `POST /check` | ATS resume vs JD scoring |
| `/api/interviews` | `GET /`, `POST /` | Mock interview sessions |
| `/api/analytics` | `GET /overview` | Platform-wide analytics |

---

## Frontend Routing

All routes are managed by **React Router DOM v6** in `client/src/App.jsx`.

### Public Routes

| Path | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Marketing homepage |
| `/about` | `AboutUs` | About the platform |
| `/login` | `SignInPage` | Unified login page |
| `/signin` | `SignInPage` | Alias for login |
| `/signup` | `RoleSelectionPage` | Choose account type |
| `/signup/student` | `StudentSignup` | Student registration |
| `/signup/college` | `CollegeSignup` | College registration |
| `/signup/recruiter` | `RecruiterSignup` | Recruiter registration |
| `/signup/verify-email` | `EmailVerificationPage` | OTP verification |
| `/forgot-password` | `ForgotPasswordPage` | Password reset request |
| `/reset-password/:token` | `ResetPasswordPage` | Set new password |
| `/oauth-callback` | `OAuthCallbackPage` | Google OAuth redirect handler |

### College (TPO) Routes — Role: `college_admin`

| Path | Component | Description |
|---|---|---|
| `/college` | `CollegeDashboard` | Main TPO dashboard |
| `/college/drives` | `CampusDrives` | Kanban drive manager + incoming requests |
| `/college/recruiters` | `RecruiterCRM` | Partner recruiter management |

### Recruiter Routes — Role: `recruiter`

| Path | Component | Description |
|---|---|---|
| `/recruiter` | `RecruiterDashboard` | Recruiter home dashboard |
| `/recruiter/jobs` | `RecruiterJobs` | Job postings + college invite system |
| `/recruiter/drives` | `RecruiterDrives` | Assigned drives Kanban view |
| `/recruiter/smart-shortlist` | `SmartShortlist` | Candidate filtering tool |

### Student Routes — Role: `student`

| Path | Component | Description |
|---|---|---|
| `/student` | `StudentDashboard` | Full student intelligence hub |
| `/student/drives` | `StudentDrives` | Campus drive discovery & apply |

---

## Authentication & Security

### JWT Flow

```
User Login → Server validates credentials → Issues signed JWT (7 days expiry)
     ↓
Client stores JWT in localStorage
     ↓
Every request: Header { "x-auth-token": "<JWT>" }
     ↓
Server middleware decodes → attaches req.user = { userId, role, collegeId }
     ↓
roleCheck(["college_admin"]) middleware enforces RBAC on protected routes
```

### Security Measures

- **Password Hashing**: Bcrypt with salt rounds (12)
- **JWT Secret**: Stored in `.env`, never exposed
- **Role-Based Access Control (RBAC)**: Every sensitive route uses `roleCheck([roles])` middleware
- **Email Verification**: OTP-based before account activation
- **Cooldown Protection**: Skill gap analysis has a 5-minute cooldown to prevent API abuse
- **Drive Request Deduplication**: Server rejects duplicate invites for the same job+college pair
- **Google OAuth**: Passport.js strategy; JWT issued after callback (no sessions)

---

## AI & Intelligence Layer

### Gemini AI Integration

The platform uses **Google Gemini API** for:

| Feature | Prompt Input | AI Output |
|---|---|---|
| Skill Gap Analysis | Student skills + target domain/role | Gap skills, recommendations, match score |
| Learning Path Generation | Gap skills, experience level | Weekly milestone schedule with resources |
| Milestone Quiz Generation | Skill name + milestone title | 5 MCQs with answer keys |
| ATS Resume Scoring | Resume text + Job description | Score (0-100) + improvement tips |

### Smart Job Matching Algorithm

```
For each student:
  studentSkills = profile.skills[].skillName (normalized, lowercase)
  
  For each job:
    matchCount = job.requirements.filter(req → studentSkills.includes(req))
    matchScore = (matchCount / totalRequirements) * 100
    
  Filter: matchScore >= 20% (threshold to exclude irrelevant jobs)
  Sort: descending by matchScore
```

### Skill Sync on Path Completion

When a student completes 100% of a learning path milestone:
- The skill is **automatically added** to their profile
- If the skill exists, its proficiency level is upgraded
- The skill is flagged as `verified: true` with source `"Skill Gap Analyser"`

---

## Campus Drive Module

### Kanban Stage Flow

```
Applied → Aptitude Test → Technical Interview → HR Round → Offered → Rejected
   ↑                              ↑
TPO manages                 Recruiter sees only from here →
all stages                  (Technical Interview, HR Round, Offered, Rejected)
```

### Shared State Architecture

Both the **College TPO** and the **assigned Recruiter** operate on the same underlying `DriveApplication` documents. When either party drags a card:
1. The frontend fires a `PUT .../status` API call
2. The database record is updated
3. Both dashboards reflect the new state on next fetch

### Drive Lifecycle — Model A (College-Initiated)

```
1. TPO creates drive (company, title, eligibility, minCGPA)
2. TPO optionally assigns a Recruiter from the dropdown
3. Students from the same college see the drive in their portal
4. Students who meet CGPA threshold can apply
5. TPO manages Kanban from Applied → Technical Interview
6. Recruiter takes over from Technical Interview → Offered/Rejected
```

### Drive Lifecycle — Model B (Recruiter-Initiated)

```
1. Recruiter creates a Job Posting (title, requirements, salary)
2. Recruiter browses College Explorer → clicks "Invite to Drive"
3. Selects the job → sends DriveRequest (status: "pending")
4. TPO sees the invite in the "Incoming Drive Requests" panel
5. TPO clicks "Accept & Create Drive" → CampusDrive auto-provisioned
6. Both parties now share the Kanban board
```

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (Local or Atlas URI)
- Google Gemini API Key
- Cloudinary Account
- Google OAuth Credentials (optional for social login)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Guddu2222/skill_gap-Analizer-and-placement_intelligence.git
cd "Skill_Gap Analyser and placement intelligence"

# Install all dependencies (root, server, client)
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/placement_platform
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (Password Reset & Verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run Development Server

```bash
# From the project root (runs both frontend + backend concurrently)
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `FRONTEND_URL` | ✅ | Frontend origin for CORS |
| `PORT` | ❌ | Server port (default: 5000) |
| `GOOGLE_CLIENT_ID` | ❌ | For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | ❌ | For Google OAuth |
| `EMAIL_USER` | ❌ | For email verification |
| `EMAIL_PASS` | ❌ | App password for email |

---

## Deployment

### Backend (Railway / Render)

1. Connect the GitHub repository
2. Set root directory to `server/`
3. Add all environment variables
4. Build command: `npm install`
5. Start command: `node index.js`

### Frontend (Vercel)

1. Connect the GitHub repository
2. Set root directory to `client/`
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.railway.app/api`

---

## Project Structure

```
Skill_Gap Analyser and placement intelligence/
├── client/                          # React + Vite Frontend
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx          # Role-aware navigation
│       │   ├── HeroSection.jsx      # Landing hero
│       │   ├── recruiter/           # Recruiter-specific widgets
│       │   │   ├── AdvancedSearch.jsx
│       │   │   ├── CollegeExplorer.jsx
│       │   │   ├── DomainExperts.jsx
│       │   │   └── SavedCandidates.jsx
│       │   └── student/
│       │       └── LearningPathTracker.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── SignInPage.jsx
│           ├── StudentDashboard.jsx  # Student intelligence hub
│           ├── StudentDrives.jsx     # Campus drive portal
│           ├── CollegeDashboard.jsx
│           ├── CampusDrives.jsx      # TPO Kanban + incoming requests
│           ├── RecruiterDashboard.jsx
│           ├── RecruiterJobs.jsx     # Job postings + college invite
│           ├── RecruiterDrives.jsx   # Assigned drives Kanban
│           ├── SmartShortlist.jsx
│           ├── RecruiterCRM.jsx
│           └── signup/              # Multi-step registration
│               ├── RoleSelectionPage.jsx
│               ├── StudentSignup.jsx
│               ├── CollegeSignup.jsx
│               └── RecruiterSignup.jsx
│
└── server/                          # Express.js Backend API
    ├── index.js                     # Entry point + route bindings
    ├── config/
    │   ├── passport.js              # Google OAuth strategy
    │   └── cloudinary.js           # Multer-Cloudinary pipeline
    ├── middleware/
    │   └── auth.js                  # JWT verify + roleCheck()
    ├── models/                      # 17 Mongoose schemas
    │   ├── User.js
    │   ├── Student.js
    │   ├── College.js
    │   ├── Job.js
    │   ├── CampusDrive.js
    │   ├── DriveApplication.js
    │   ├── DriveRequest.js
    │   ├── SkillGapAnalysis.js
    │   ├── SkillLearningPath.js
    │   └── ...
    ├── routes/                      # 10 route files
    │   ├── auth.js
    │   ├── jobs.js
    │   ├── campus-drives.js
    │   ├── college-features.js
    │   ├── recruiter-features.js
    │   ├── student-features.js
    │   ├── skillGap.js
    │   ├── interviews.js
    │   ├── ats.js
    │   └── analytics.js
    └── services/
        └── skillGapAnalysis.service.js  # Gemini AI orchestration
```

---

## Design System

The frontend uses the **"Aetheris Abyssal"** design system — a premium dark glassmorphism aesthetic:

- **Primary Background**: `#0c0c1d` (deep space)
- **Surface Layers**: `#121223` → `#1d1d33` → `#24233b` (elevation via tonal shift)
- **Accent**: Indigo `#a3a6ff` + Violet `#ac8aff`
- **Typography**: Inter (Google Fonts), weight range 400–900
- **UI Style**: Glassmorphism (`backdrop-blur`, `rgba` fills), no hard borders
- **Animations**: 0.3s ease-out transitions, pulsing glows on CTAs

---

*Built with ❤️ — SkillBridge | Intelligent Placement for the Next Generation*
