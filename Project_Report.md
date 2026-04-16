# SkillBridge: Project Report & Viva Guide

## 1. Project Overview
**SkillBridge** is a comprehensive Predictive Placement & Skill Gap Analytics Platform designed to connect students, colleges, and recruiters through an intelligent, unified ecosystem. It bridges the gap between academic preparation and industry requirements.

## 2. Unique Features
1. **Multi-Role Dashboards (RBAC):** Three distinct interfaces tailored for exactly what Students, Colleges, and Recruiters need.
2. **Skill Radar & Gap Analysis:** Automatically evaluates a student's current skills against target job requirements and highlights specific areas of improvement.
3. **Personalized Learning Paths:** Generates intelligent, custom course recommendations to help students bridge their identified skill gaps.
4. **Smart Shortlister & Predictive Match Scores:** Allows recruiters to bypass massive resume piles. AI-driven matching algorithms score candidates based on historical data and direct skill overlaps.
5. **Centralized Campus Drive Management:** Enables colleges to seamlessly schedule, track, and analyze campus recruitment drives on a macro-level.
6. **Mock Interview & Interview Prep:** Dedicated portal for students to prepare for interviews and record their experiences.

## 3. Important Implementation Details
*   **Tech Stack:** Built on the MERN stack (MongoDB, Express.js, React.js with Vite, Node.js).
*   **Architecture:** Strictly adheres to the **MVC (Model-View-Controller)** pattern on the backend, ensuring clean separation of concerns and high scalability.
*   **Security:** Implements robust Authentication via JSON Web Tokens (JWT) and Bcrypt for password hashing. Role-based middleware ensures secure endpoints.
*   **Design:** Utilizes Tailwind CSS and Lucide React icons for a modern, responsive, and visually appealing user interface.
*   **Routing:** React Router v6 controls complex, protected routing logic based on user roles.

---

## 4. Unique Viva Questions & Answers

### 💻 Frontend (React.js & Vite)
**Q1: Why did you use Vite instead of Create React App (CRA)?**
*Answer:* Vite significantly improves the developer experience with a practically instant server start and lightning-fast Hot Module Replacement (HMR). It uses native ES modules instead of bundling everything during development.

**Q2: How do you manage access to different dashboards based on user roles?**
*Answer:* We use React Router along with a protected route wrapper. The wrapper checks the authentication state and the user role (Student, College, or Recruiter) stored in the global state or context, and redirects unauthorized users.

**Q3: How do you handle API calls logically in your React application?**
*Answer:* The client has a centralized `services/` directory. Instead of writing `fetch` or `axios` calls inside components, we abstract them into service files. This keeps UI components clean and makes API updates easier.

### ⚙️ Backend (Node.js & Express.js)
**Q4: Explain the MVC structure implemented in your backend.**
*Answer:* 
- **Models:** Define the data schema using Mongoose (e.g., Student, Job).
- **Controllers:** House the core business logic (e.g., registering a user, calculating skill gaps).
- **Routes:** Map incoming HTTP requests to specific controller functions.

**Q5: How does your authentication process work?**
*Answer:* When a user logs in, the backend verifies the Bcrypt-hashed password. If valid, the server generates a JWT containing the user's ID and role, and sends it to the client. The client includes this token in the header of subsequent requests, which our authorization middleware verifies.

**Q6: What approach do you use for calculating "Predictive Match Scores"?**
*Answer:* The backend compares a defined job profile's required skills (`DomainSkillRequirement`) against a candidate's recorded strengths (`StudentSkill`). It outputs a match percentage based on exact overlap, proficiency weightage, and missing skills.

### 🗄️ Database (MongoDB)
**Q7: Why choose MongoDB over a SQL database like MySQL for SkillBridge?**
*Answer:* MongoDB's NoSQL document structure is highly flexible. A student's profile contains dynamically changing arrays of skills, experiences, and learning paths. A JSON-like document handles this deeply nested data much better than rigid SQL tables.

**Q8: How do you link the generic 'User' authentication data to a specific 'Student' or 'College' profile?**
*Answer:* We use Mongoose's `ObjectId` referencing. The `Student` schema has a field called `user`, referencing the `User` schema. This allows us to keep authentication logic separate from profile data, using `.populate()` to join them when necessary.

### 🧠 General Architecture
**Q9: What is the most challenging algorithmic feature of this project?**
*Answer:* Designing the **Skill Gap Analysis**. It required aggregating data from different student skills, standardizing skill names, comparing them against dynamic industry definitions, and structuring the output so the frontend could render a meaningful "Skill Radar" chart.

**Q10: If you have to scale this application for 100,000 users, what would you change?**
*Answer:* I would implement database indexing on frequently queried fields like `role` and `skills`. I would also introduce Redis for caching repeated queries (like list of colleges or broad job market trends), and utilize a load balancer across multiple Node.js instances.
