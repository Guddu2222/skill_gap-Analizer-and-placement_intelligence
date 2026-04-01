# SkillBridge: Predictive Placement & Skill Gap Analytics Platform

SkillBridge is an advanced **Placement Intelligence System** built to bridge the gap between student skills, college academic tracking, and recruiter hiring needs. Leveraging predictive analytics and targeted learning paths, this application streamlines the entire university-to-corporate pipeline.

## 🚀 Key Features

SkillBridge provides three distinct dashboard experiences powered by Role-Based Access Control (RBAC):

### 🎓 For Students
*   **Skill Radar & Gap Analysis:** Identifies areas of improvement based on target job roles.
*   **Personalized Learning Paths:** Recommends courses to close skill gaps.
*   **Interview Prep & Mentorship:** Access to mock interviews and alumni guidance.

### 🏛️ For Colleges
*   **Student Tracking:** Monitor the placement readiness of the entire student body.
*   **Drive Management:** Schedule and track campus recruitment drives.
*   **Analytics Dashboard:** Macro-level insights into department performance and placement success rates.

### 💼 For Recruiters
*   **Smart Shortlister:** Precisely filter candidates matching specific skill proficiencies.
*   **Job Postings & Pipelines:** Manage open positions and application statuses.
*   **Predictive Match Scores:** AI-driven candidate matching based on historical hiring data.

---

## 🏗️ Technical Architecture

This project is built using the **MERN** stack (MongoDB, Express, React, Node.js) and adheres strictly to the **MVC (Model-View-Controller)** design paradigm in the backend to ensure separation of concerns, massive scalability, and clean routing.

### Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Lucide React (Icons), React Router DOM (v6).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas, Mongoose (ODM).
*   **Authentication:** JSON Web Tokens (JWT), Bcrypt password hashing.

### Repository Structure

```text
├── client/                 # React Frontend Portal
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views (Sign in, Dashboards)
│   │   └── services/       # Centralized API service for backend communication
│   └── package.json    
└── server/                 # Express Backend API
    ├── controllers/        # MVC Controllers (Business logic handler)
    ├── models/             # Mongoose Schemas (User, Student, College, etc.)
    ├── routes/             # Clean API route bindings
    ├── middleware/         # Custom authentication and error handling middleware
    ├── utils/              # Email sending and cryptographic helpers
    └── index.js            # Server entry point
```

---

## ⚙️ Local Development Setup

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Instance (Local or Atlas URI)

### 1. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example and configure your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file configuring the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Code Standards & Contributions
This codebase is maintained with strict adherence to human-readable design patterns.
*   **Formatting:** Enforced globally via `Prettier`.
*   **State Management:** Minimal reliance on generic state drilling; functions mapped contextually.
*   **Dry Principles:** Avoidance of redundant component logic, specifically in the streamlined 2-step unified Authentication Flow.

*Built with ❤️ for modern placement cells.*
