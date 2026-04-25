const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const Student = require("../models/Student");
const SkillGapAnalysis = require("../models/SkillGapAnalysis");
const DomainSkillRequirement = require("../models/DomainSkillRequirement");
const SkillLearningPath = require("../models/SkillLearningPath");

class SkillGapAnalysisService {
  constructor() {
    // Groq (primary) — fast, free, reliable worldwide
    this.groq = process.env.GROQ_API_KEY
      ? new Groq({ apiKey: process.env.GROQ_API_KEY })
      : null;
    // Gemini (fallback) — used only if Groq is not configured
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  // Main Analysis Function
  async analyzeSkillGap(studentId, targetDomain, targetRole = null) {
    try {
      console.log(
        `Analyzing skill gap for student: ${studentId}, domain: ${targetDomain}`,
      );

      // 1. Get student's current profile and skills
      // Using Mongoose populate to resolve references if any (e.g. experiences/skills/projects which are embedded/referenced in Student)
      const student = await Student.findById(studentId);

      if (!student) {
        throw new Error("Student not found");
      }

      // 2. Fetch external verifiable stats (GitHub / LeetCode)
      const externalStats = await this.fetchExternalStats(student);

      // 3. Get domain requirements from database
      const domainRequirements = await this.getDomainRequirements(
        targetDomain,
        targetRole,
      );

      // 4. Prepare data for AI analysis
      const analysisPrompt = this.prepareAnalysisPrompt(
        student,
        domainRequirements,
        targetDomain,
        targetRole,
        externalStats,
      );

      // 4. Get AI analysis (Groq → Gemini → Mock)
      const aiAnalysisRaw = await this.analyzeWithAI(analysisPrompt);

      // 5. Parse and structure the analysis
      const structuredAnalysis = this.parseAIResponse(aiAnalysisRaw);

      // 6. Calculate readiness score
      const readinessScore = this.calculateReadinessScore(
        student.skills || [],
        domainRequirements,
      );

      // 7. Get learning resources
      const learningResources = await this.getRecommendedResources(
        structuredAnalysis.missing_skills || [],
      );

      // 8. Invalidate previous active analyses for this student/domain
      await SkillGapAnalysis.updateMany(
        { student: studentId, isActive: true },
        { $set: { isActive: false } },
      );

      // 9. Save new analysis to database
      const savedAnalysis = await SkillGapAnalysis.create({
        student: studentId,
        targetDomain: targetDomain,
        targetRole: targetRole,
        currentSkills: (student.skills || []).map((s) => ({
          skill: s.skillName || s, // Handle string or object structure
          proficiency: s.proficiency || "beginner",
          years: s.years || 0,
        })),
        overallReadinessScore: readinessScore,
        missingSkills: structuredAnalysis.missing_skills,
        skillsToImprove: structuredAnalysis.skills_to_improve,
        strongSkills: structuredAnalysis.strong_skills,
        aiAnalysisRaw: aiAnalysisRaw,
        analysisSummary: structuredAnalysis.summary,
        priorityLearningPath: structuredAnalysis.priority_learning_path,
        careerAdvice: structuredAnalysis.career_advice,
        marketAlignmentScore: structuredAnalysis.market_score,
        recommendedCourses: learningResources.courses,
        recommendedCertifications: learningResources.certifications,
        estimatedTimeToReady: structuredAnalysis.estimated_weeks,
        isActive: true,
      });

      // 10. Create learning paths for missing skills
      await this.createLearningPaths(
        studentId,
        savedAnalysis._id,
        structuredAnalysis.missing_skills || [],
      );

      return {
        success: true,
        analysis: savedAnalysis,
        insights: structuredAnalysis,
      };
    } catch (error) {
      console.error("Skill gap analysis error:", error);
      throw error;
    }
  }

  async fetchExternalStats(student) {
    let stats = "";

    if (student.leetcodeUsername) {
      try {
        // Use global fetch
        const resp = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${student.leetcodeUsername}`,
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.status === "success") {
            stats += `- LeetCode: ${data.totalSolved} problems solved (${data.easySolved} Easy, ${data.mediumSolved} Medium, ${data.hardSolved} Hard)\n`;
          }
        }
      } catch (e) {
        console.error("LeetCode fetch error:", e.message);
      }
    }

    if (student.githubUsername) {
      try {
        const resp = await fetch(
          `https://api.github.com/users/${student.githubUsername}`,
        );
        if (resp.ok) {
          const data = await resp.json();
          stats += `- GitHub: ${data.public_repos} public repositories, ${data.followers} followers\n`;
        }
      } catch (e) {
        console.error("GitHub fetch error:", e.message);
      }
    }

    return stats;
  }

  // Prepare AI Prompt
  prepareAnalysisPrompt(
    student,
    domainRequirements,
    targetDomain,
    targetRole,
    externalStats = "",
  ) {
    const formatSkills = (skillsArray) => {
      if (!skillsArray || skillsArray.length === 0) return "No skills listed";
      return skillsArray
        .map((s) => {
          if (typeof s === "string") return s;
          return `${s.skillName} (${s.proficiencyLevel || "beginner"})`;
        })
        .join(", ");
    };

    const currentSkills = formatSkills(student.skills);

    // Fallback logic for nested fields arrays if they exist in schema
    const experiences =
      (student.experiences || [])
        .map((e) => `${e.role} at ${e.companyName} (${e.type})`)
        .join(", ") || "No experience listed";

    const projects =
      (student.projects || [])
        .map((p) => `${p.title} - ${p.description}`)
        .join(", ") || "No projects listed";

    return `
You are an expert career counselor and technical recruiter specializing in ${targetDomain}.

**Student Profile:**
- Name: ${student.firstName || ""} ${student.lastName || ""}
- Department: ${student.department || "Unknown"}
- CGPA: ${student.cgpa || "N/A"}/10
- Graduation Year: ${student.graduationYear || "Unknown"}

**Current Skills:**
${currentSkills}

**Experience:**
${experiences}

**Projects:**
${projects}

${externalStats ? `**Verifiable Developer Stats:**\n${externalStats}\n` : ""}**Target Domain:** ${targetDomain}
**Target Role:** ${targetRole || "Entry-level position"}

**Required Skills for ${targetDomain} (${targetRole || "Entry-level"}):**
Core Skills: ${(domainRequirements.coreSkills || []).map((s) => s.skill).join(", ") || "General Domain Knowledge"}
Preferred Skills: ${(domainRequirements.preferredSkills || []).map((s) => s.skill).join(", ") || "None specified"}
Nice-to-have: ${(domainRequirements.niceToHaveSkills || []).map((s) => s.skill).join(", ") || "None specified"}

**Task:**
Analyze this student's readiness for a ${targetRole || "entry-level"} role in ${targetDomain} and provide:

1. **Skill Gap Analysis**: Identify missing critical skills and chronologically order them  into sequential learning phases (1 to 5). Combine heavily overlapping skills into a single topic to avoid redundancy (e.g., merge "Object-Oriented Programming" and "Object-Oriented Design").
2. **Skills to Improve**: From their Current Skills, list the skills that strictly need advancement.
3. **Strong Skills**: From their Current Skills, list the skills where the student excels.
IMPORTANT: You MUST categorize EVERY SINGLE skill from their "Current Skills" list into either "strong_skills" or "skills_to_improve". Do not leave any current skill unaccounted for.
4. **Market Readiness Score**: 0-100 score of job readiness based on their profile data
5. **Priority Recommendations**: Top 3-5 skills to focus on immediately
6. **Learning Timeline**: Estimated weeks to become job-ready
7. **Career Advice**: Personalized guidance based on their profile, formatted as an array of 4-5 bullet points.

**Output Format (Strict JSON):**
{
  "summary": "Brief overall assessment",
  "readiness_score": 75,
  "market_score": 80,
  "missing_skills": [
    {
      "skill": "skill name",
      "phase_number": 1, 
      "phase_title": "Short title of the phase, e.g. 'Web Fundamentals'",
      "priority": "critical|high|medium|low",
      "reasoning": "why this skill is important",
      "difficulty": "easy|medium|hard",
      "estimated_learning_time": "3 weeks"
    }
  ],
  "skills_to_improve": [
    {
      "skill": "skill name",
      "current_level": "beginner|intermediate",
      "required_level": "intermediate|advanced",
      "improvement_priority": "high|medium|low",
      "reasoning": "why improvement is needed"
    }
  ],
  "strong_skills": [
    {
      "skill": "skill name",
      "strength_level": "advanced|expert",
      "market_demand": "high|medium|low",
      "leverage_advice": "how to leverage this skill"
    }
  ],
  "priority_learning_path": [
    "Step 1: Learn X first because...",
    "Step 2: Then master Y because..."
  ],
  "estimated_weeks": 12,
  "career_advice": [
    "Advice point 1...",
    "Advice point 2..."
  ],
  "competitive_advantages": ["What makes this student stand out"],
  "red_flags": ["Concerns or gaps to address urgently"]
}

Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json. Be specific, actionable, and encouraging. Focus on realistic timelines and achievable goals.
`;
  }

  // ── Primary AI: Groq ──────────────────────────────────────────────────────
  async analyzeWithGroq(prompt) {
    if (!this.groq) {
      throw new Error("Groq client not initialised — GROQ_API_KEY missing");
    }

    console.log("🤖 [Groq] Sending analysis request (llama-3.3-70b-versatile)...");

    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert career counselor and technical recruiter. " +
            "Always respond with valid JSON only. Never wrap in markdown code blocks.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    console.log("✅ [Groq] Analysis received successfully.");
    return text;
  }

  // ── Unified AI call: Groq → Gemini → Mock ────────────────────────────────
  async analyzeWithAI(prompt) {
    // 1. Try Groq first (primary)
    if (this.groq) {
      try {
        return await this.analyzeWithGroq(prompt);
      } catch (err) {
        console.warn("⚠️  [Groq] Failed, falling back to Gemini:", err.message);
      }
    }

    // 2. Try Gemini as fallback
    if (process.env.GEMINI_API_KEY) {
      try {
        return await this.analyzeWithGemini(prompt);
      } catch (err) {
        console.warn("⚠️  [Gemini] Failed, falling back to mock:", err.message);
      }
    }

    // 3. Final fallback: mock response
    console.warn("⚠️  [AI] No AI provider available. Returning mock analysis.");
    return this.getMockGeminiResponse("No AI provider configured or all providers failed.");
  }

  // ── Fallback AI: Gemini ───────────────────────────────────────────────────
  async analyzeWithGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set");
    }

    try {
      const model = this.gemini.getGenerativeModel({
        model: "gemini-2.0-flash",
      }); // gemini-2.0-flash: fast, cost-efficient, supports JSON response mode

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const response = result.response;
      let text = response.text();
      return text;
    } catch (error) {
      const errorMessage = error.message ? error.message.toLowerCase() : "";
      const statusCode = error.status || (error.httpError && error.httpError.status);

      const isQuotaError =
        statusCode === 429 ||
        errorMessage.includes("429") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("exhausted") ||
        errorMessage.includes("too many requests") ||
        errorMessage.includes("resource_exhausted");

      const isInvalidKeyError =
        statusCode === 400 ||
        statusCode === 401 ||
        statusCode === 403 ||
        errorMessage.includes("api_key_invalid") ||
        errorMessage.includes("invalid api key") ||
        errorMessage.includes("api key not valid") ||
        errorMessage.includes("permission_denied") ||
        errorMessage.includes("api key") ||
        errorMessage.includes("invalid key");

      if (isInvalidKeyError) {
        console.error(
          "🔑 [Gemini] INVALID API KEY detected! Your GEMINI_API_KEY in server/.env is wrong.\n" +
          "   ➡  The key must start with 'AIza...' (e.g. AIzaSy...).\n" +
          "   ➡  Get a valid key at: https://aistudio.google.com/app/apikey\n" +
          "   Raw error:", error.message
        );
        return this.getMockGeminiResponse(
          "Invalid Gemini API key. Please go to https://aistudio.google.com/app/apikey, create a new key (it starts with AIza...), and paste it as GEMINI_API_KEY in server/.env"
        );
      }

      if (isQuotaError) {
        console.warn(
          "⚠️  [Gemini] API quota exhausted. Returning mock analysis. " +
          "To restore real AI: generate a new key at https://aistudio.google.com/app/apikey " +
          "and update GEMINI_API_KEY in server/.env"
        );
        return this.getMockGeminiResponse(
          "Gemini API quota exhausted. This is a sample analysis — real AI results will resume once the API key quota resets or a new key is configured."
        );
      }

      // Other unexpected errors — still fall back to mock, never crash
      console.error("❌ [Gemini] Unexpected API error. Falling back to mock:", error.message, "\n   Full error:", error);
      return this.getMockGeminiResponse(error.message || "Unknown API Error");
    }
  }

  // Parse AI Response
  parseAIResponse(aiResponseRaw) {
    try {
      // Clean string if the AI ignores instructions and wraps in markdown
      let cleanJsonString = aiResponseRaw.trim();
      if (cleanJsonString.startsWith("```json")) {
        cleanJsonString = cleanJsonString
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      } else if (cleanJsonString.startsWith("```")) {
        cleanJsonString = cleanJsonString
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();
      }

      let parsed = JSON.parse(cleanJsonString);

      // Ensure career_advice is an array of strings
      if (parsed.career_advice && typeof parsed.career_advice === "string") {
        // Try to split if it contains numbers or newlines
        parsed.career_advice = parsed.career_advice
          .split(/(?:\d+\.\s*\*\*.*?\*\*|\n)/)
          .map((s) => s.trim())
          .filter((s) => s.length > 5);
        if (parsed.career_advice.length === 0) {
          parsed.career_advice = [
            "Keep learning and building projects to improve your readiness!",
          ];
        }
      } else if (!Array.isArray(parsed.career_advice)) {
        parsed.career_advice = [
          "Keep learning and building projects to improve your readiness!",
        ];
      }

      return parsed;
    } catch (error) {
      console.error(
        "Error parsing AI response:",
        error,
        "\\nRaw string:",
        aiResponseRaw,
      );

      // Return a safe default structure to prevent app crash
      return {
        summary: "We couldn't generate a detailed summary at this time.",
        readiness_score: 50,
        market_score: 50,
        missing_skills: [
          {
            skill: "General Problem Solving",
            phase_number: 1,
            phase_title: "Core Fundamentals",
            priority: "high",
            reasoning: "Always a critical gap",
            difficulty: "medium",
            estimated_learning_time: "4 weeks",
          },
        ],
        skills_to_improve: [],
        strong_skills: [],
        priority_learning_path: [],
        estimated_weeks: 4,
        career_advice: ["Keep learning and building projects!"],
      };
    }
  }

  // Calculate Readiness Score
  calculateReadinessScore(studentSkills, domainRequirements) {
    let score = 0;
    let totalWeight = 0;

    const studentSkillsFlat = studentSkills.map((s) =>
      typeof s === "string"
        ? s.toLowerCase()
        : s.skillName
          ? s.skillName.toLowerCase()
          : "",
    );

    // Check core skills
    if (
      domainRequirements.coreSkills &&
      domainRequirements.coreSkills.length > 0
    ) {
      domainRequirements.coreSkills.forEach((reqSkill) => {
        totalWeight += reqSkill.weight || 10;

        const hasSkill = studentSkillsFlat.includes(
          reqSkill.skill.toLowerCase(),
        );

        if (hasSkill) {
          score += reqSkill.weight || 10; // Simplified scoring since proficiency is harder to normalize without strict enums
        }
      });
    }

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 50; // default to 50 if no specific requirements available
  }

  // Get Domain Requirements
  async getDomainRequirements(domain, role) {
    let query = { domain: domain };
    if (role) query.role = role;

    let requirements = await DomainSkillRequirement.findOne(query);

    // Filter to fallback if empty
    if (!requirements) {
      requirements = await this.getDefaultDomainRequirements(domain, role);
    }

    return requirements;
  }

  // Default Domain Requirements (Fallback)
  async getDefaultDomainRequirements(domain, role) {
    const defaultRequirements = {
      "Software Engineer": {
        coreSkills: [
          {
            skill: "Data Structures & Algorithms",
            weight: 15,
            minProficiency: "intermediate",
          },
          {
            skill: "Object-Oriented Programming",
            weight: 12,
            minProficiency: "intermediate",
          },
          { skill: "Git", weight: 8, minProficiency: "beginner" },
          { skill: "SQL", weight: 10, minProficiency: "beginner" },
        ],
        preferredSkills: [
          { skill: "JavaScript", weight: 10 },
          { skill: "Python", weight: 10 },
          { skill: "Java", weight: 10 },
          { skill: "React", weight: 8 },
          { skill: "Node.js", weight: 8 },
        ],
      },
      "Data Scientist": {
        coreSkills: [
          { skill: "Python", weight: 15, minProficiency: "intermediate" },
          { skill: "Statistics", weight: 15, minProficiency: "intermediate" },
          { skill: "Machine Learning", weight: 15, minProficiency: "beginner" },
          { skill: "SQL", weight: 10, minProficiency: "intermediate" },
        ],
        preferredSkills: [
          { skill: "Pandas", weight: 10 },
          { skill: "NumPy", weight: 10 },
          { skill: "Scikit-learn", weight: 10 },
        ],
      },
    };

    // Default to Software Engineer if domain not found in mocks
    const result =
      defaultRequirements[domain] || defaultRequirements["Software Engineer"];
    return { domain, role, ...result };
  }

  // Get Learning Resources
  async getRecommendedResources(missingSkills) {
    const courses = [];
    const certifications = [];

    // Simple mock db logic identical to user's implementation
    const resourceDatabase = {
      JavaScript: {
        courses: [
          {
            title: "JavaScript - The Complete Guide",
            platform: "Udemy",
            url: "https://udemy.com/",
            duration: "40 hours",
            price: "Paid",
          },
        ],
        certifications: [
          {
            name: "Meta Front-End Developer",
            issuer: "Meta",
            url: "https://coursera.org/",
          },
        ],
      },
      React: {
        courses: [
          {
            title: "React.dev Documentation",
            platform: "Official Docs",
            url: "https://react.dev/learn",
            duration: "20 hours",
            price: "Free",
          },
        ],
      },
      // Add more as needed...
    };

    missingSkills.forEach((skillObj) => {
      const skillName = skillObj.skill;
      // Very basic substring match
      const key = Object.keys(resourceDatabase).find((k) =>
        skillName.toLowerCase().includes(k.toLowerCase()),
      );

      if (key && resourceDatabase[key]) {
        if (resourceDatabase[key].courses)
          courses.push(...resourceDatabase[key].courses);
        if (resourceDatabase[key].certifications)
          certifications.push(...resourceDatabase[key].certifications);
      }
    });

    // Fallbacks if nothing matched
    if (courses.length === 0) {
      courses.push({
        title: "freeCodeCamp (General Concepts)",
        platform: "freeCodeCamp",
        url: "https://freecodecamp.org",
        duration: "Self-paced",
        price: "Free",
      });
    }

    return {
      courses: courses.slice(0, 5),
      certifications: certifications.slice(0, 3),
    };
  }

  // Create Learning Paths
  async createLearningPaths(studentId, gapAnalysisId, missingSkills) {
    const learningPaths = [];

    for (const skillObj of missingSkills) {
      if (!skillObj.skill) continue; // Skip malformed

      const resources = await this.getRecommendedResources([
        { skill: skillObj.skill },
      ]);

      const estimatedWeeks = parseInt(skillObj.estimated_learning_time) || 4;
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + estimatedWeeks * 7);

      // Check if a path for this skill already exists
      let existingPath = await SkillLearningPath.findOne({
        student: studentId,
        skillName: { $regex: new RegExp(`^${skillObj.skill}$`, "i") },
      });

      if (existingPath) {
        // Update the gapAnalysis reference and save
        existingPath.gapAnalysis = gapAnalysisId;
        await existingPath.save();
        learningPaths.push(existingPath);
        continue;
      }

      const learningPath = await SkillLearningPath.create({
        student: studentId,
        gapAnalysis: gapAnalysisId,
        skillName: skillObj.skill,
        currentLevel: "none",
        targetLevel: "intermediate",
        phaseNumber: skillObj.phase_number || 1,
        phaseTitle: skillObj.phase_title || "Core Fundamentals",
        learningResources: resources.courses.map((r) => ({
          type: "course",
          ...r,
        })),
        milestones: this.generateMilestones(skillObj.skill, estimatedWeeks),
        progressPercentage: 0,
        status: "not_started",
        estimatedCompletionDate: estimatedDate,
      });

      learningPaths.push(learningPath);
    }

    return learningPaths;
  }

  generateMilestones(skill, weeks) {
    const milestones = [];
    const totalMilestones = Math.min(Math.max(1, weeks), 8); // 1-8 milestones
    
    // Progressive titles for chronological learning steps
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

    for (let i = 1; i <= totalMilestones; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i * 7);
      
      const theme = progressionNames[i - 1] || "Continued Practice";

      milestones.push({
        title: `Week ${i}: ${theme}`,
        description: `Complete required readings, tutorials, and practical exercises for ${skill} focusing on ${theme.toLowerCase()}.`,
        completed: false,
        dueDate: dueDate,
      });
    }

    return milestones;
  }

  getMockGeminiResponse(errorMessage = null) {
    const summaryMsg = errorMessage
      ? `This is a mock AI response because the Gemini API call failed. Error details: ${errorMessage}. Please check your GEMINI_API_KEY validity, quota, or network connectivity.`
      : `This is a mock AI response since the GEMINI_API_KEY was not configured in the .env file. Add the key to see real results.`;

    return `{
        "summary": "${summaryMsg}",
        "readiness_score": 60,
        "market_score": 65,
        "missing_skills": [
          { "skill": "React", "phase_number": 1, "phase_title": "Frontend Frameworks", "priority": "high", "reasoning": "Standard for frontend", "difficulty": "medium", "estimated_learning_time": "4 weeks" },
          { "skill": "Node.js", "phase_number": 2, "phase_title": "Backend Engineering", "priority": "high", "reasoning": "Standard for backend", "difficulty": "medium", "estimated_learning_time": "4 weeks" }
        ],
        "skills_to_improve": [],
        "strong_skills": [],
        "priority_learning_path": ["Step 1: Learn React - Standard for frontend", "Step 2: Learn Node.js - Standard for backend"],
        "estimated_weeks": 8,
        "career_advice": ["Configure the GEMINI_API_KEY in the backend .env or verify its validity."],
        "red_flags": []
      }`;
  }
}

module.exports = new SkillGapAnalysisService();
