# Skill Gap Analysis Integration Plan

## Goal
Integrate the user's proposed AI-Powered Skill Gap Analysis architecture into the existing Placement Intelligence Platform (which uses Mongoose/MongoDB, not Sequelize/SQL).

## Current State Analysis
The backend is a Node.js/Express application using Mongoose for MongoDB access. It does not currently have any AI SDKs installed. We need to translate the proposed SQL tables into NoSQL document schemas and install the correct AI packages.

## Phase 1: Database Schema Translation (Mongoose)

We will create the following Mongoose models to replace the proposed Sequelize models.

### 1. `SkillGapAnalysis.js`
Translates from the `SkillGapAnalysis` SQL model.
```javascript
const mongoose = require('mongoose');

const skillGapAnalysisSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  targetDomain: { type: String, required: true },
  targetRole: { type: String },
  
  // Current State
  currentSkills: [{
    skill: String,
    proficiency: String,
    years: Number
  }],
  overallReadinessScore: { type: Number, min: 0, max: 100 },
  
  // Gap Analysis Results
  missingSkills: [{
    skill: String,
    priority: String,
    reasoning: String,
    difficulty: String,
    estimatedLearningTime: String
  }],
  skillsToImprove: [{
    skill: String,
    currentLevel: String,
    requiredLevel: String,
    improvementPriority: String,
    reasoning: String
  }],
  strongSkills: [{
    skill: String,
    strengthLevel: String,
    marketDemand: String,
    leverageAdvice: String
  }],
  
  // AI Analysis
  aiAnalysisRaw: { type: String },
  analysisSummary: { type: String },
  marketAlignmentScore: { type: Number, min: 0, max: 100 },
  
  // Recommendations
  recommendedCourses: [{
    title: String,
    platform: String,
    url: String,
    duration: String,
    price: String
  }],
  recommendedCertifications: [{
    name: String,
    issuer: String,
    url: String
  }],
  estimatedTimeToReady: { type: Number }, // in weeks
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);
```

### 2. `SkillLearningPath.js`
Tracks the progress for skills identified in the gap analysis.
```javascript
const mongoose = require('mongoose');

const skillLearningPathSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  gapAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillGapAnalysis', required: true },
  skillName: { type: String, required: true },
  currentLevel: { type: String, enum: ['none', 'beginner', 'intermediate', 'advanced', 'expert'] },
  targetLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true },
  
  // Learning Resources
  learningResources: [{
    title: String,
    url: String,
    type: { type: String }, // course/article/video
    duration: String
  }],
  milestones: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    completedDate: Date
  }],
  
  // Progress
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed', 'abandoned'], default: 'not_started' },
  startedAt: Date,
  completedAt: Date,
  estimatedCompletionDate: Date
}, { timestamps: true });

module.exports = mongoose.model('SkillLearningPath', skillLearningPathSchema);
```

### 3. `DomainSkillRequirement.js` & `JobMarketTrend.js`
We will also create Mongoose versions of these models slightly simplified to match the document structure of MongoDB. (Full schemas omitted here for brevity but will be implemented).

## Phase 2: AI Service Integration

1.  **Install SDK**: We will use `@google/generative-ai` since it provides a generous free tier for Gemini, which is excellent for parsing and generating structured JSON for this use case.
    ```bash
    npm install @google/generative-ai
    ```
2.  **Environment Variable**: Ensure `GEMINI_API_KEY` is added to `.env`.
3.  **Service Rewrite**: The user's `skillGapAnalysis.service.js` will be adapted to:
    *   Query the `Student` model using Mongoose (`populate` instead of `include`).
    *   Call Gemini `gemini-1.5-pro` or `gemini-1.5-flash` to generate the JSON analysis based on the rigorous prompt provided by the user.
    *   Save the results to the new Mongoose `SkillGapAnalysis` and `SkillLearningPath` models.

## Phase 3: API Routes Integration

We will create a new route file `server/routes/skillGap.js` based on the user's provided routes, translating the ORM calls to Mongoose:
*   `POST /api/skill-gap/analyze`: Triggers the Gemini service.
*   `GET /api/skill-gap/latest`: Fetches the active analysis.
*   `GET /api/skill-gap/learning-paths`: Fetches learning paths.
*   `PATCH /api/skill-gap/learning-paths/:id/progress`: Updates milestone progress.

## User Action Required
Please review this adaptation of your SQL/Sequelize architecture to Mongoose/MongoDB. If this looks good, we can proceed to Execution mode and build these files.
