const Student = require("../models/Student");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

// Comprehensive list of tech keywords for heuristic ATS parsing fallback
const TECH_KEYWORDS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", ".NET", "PHP", "Ruby", "Go", "Golang", "Rust", "Swift", "Kotlin",
  "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte", "Redux", "Tailwind CSS", "HTML5", "CSS3",
  "Node.js", "Express", "NestJS", "Django", "FastAPI", "Flask", "Spring Boot", "ASP.NET", "Laravel",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "SQLite", "Oracle", "DynamoDB", "Prisma", "Mongoose",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Git", "GitHub", "GitLab", "Terraform", "Jenkins",
  "REST API", "RESTful", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "WebSockets",
  "Unit Testing", "Jest", "Mocha", "Cypress", "Selenium", "Agile", "Scrum", "Jira", "Problem Solving", "System Design"
];

// Clean & parse JSON safely from LLM responses
const cleanAndParseJSON = (raw) => {
  if (typeof raw !== "string") return raw;
  let text = raw.trim();
  // Strip markdown code fences if present
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
  }
  // If still wrapped or contains extra commentary, extract first JSON object
  const startIdx = text.indexOf("{");
  const endIdx = text.lastIndexOf("}");
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    text = text.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(text);
};

// Offline heuristic ATS analyzer if external AI fails or is rate limited
const runHeuristicATS = (candidateText, jobDescription) => {
  const jdLower = jobDescription.toLowerCase();
  const candLower = candidateText.toLowerCase();

  const jdKeywords = [];
  for (const kw of TECH_KEYWORDS) {
    // Regex word boundary matching for keywords (handles .NET, C++, etc. safely)
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, "i");
    if (regex.test(jdLower)) {
      jdKeywords.push(kw);
    }
  }

  // If no tech keywords caught, extract capitalized words from JD
  if (jdKeywords.length === 0) {
    const rawMatches = jobDescription.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
    const uniqueMatches = [...new Set(rawMatches)].slice(0, 8);
    jdKeywords.push(...uniqueMatches);
  }

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const kw of jdKeywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, "i");
    if (regex.test(candLower)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const total = jdKeywords.length || 1;
  const matchScore = Math.min(100, Math.max(15, Math.round((matchedKeywords.length / total) * 100)));

  let actionableAdvice = "";
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 4).join(", ");
    actionableAdvice = `The job description emphasizes competencies in ${topMissing}. Tailor your resume by adding hands-on projects, certifications, or coursework demonstrating these core technologies to pass the ATS filter.`;
  } else {
    actionableAdvice = "Your profile aligns exceptionally well with the core requirements of this role. Highlight your strongest project metrics and quantifiable achievements to secure an interview.";
  }

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    actionableAdvice,
  };
};

const getAIResponse = async (prompt, candidateText, jobDescription) => {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Try Groq with modern supported models
  if (groqApiKey) {
    const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
    const groq = new Groq({ apiKey: groqApiKey });
    for (const model of groqModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert HR ATS software. Respond strictly in valid JSON format matching the schema provided. Do not use markdown wrappers.",
            },
            { role: "user", content: prompt },
          ],
          model,
          temperature: 0.3,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        });

        const rawContent = chatCompletion.choices[0]?.message?.content;
        if (rawContent) {
          const parsed = cleanAndParseJSON(rawContent);
          if (parsed && typeof parsed.matchScore === "number") {
            return parsed;
          }
        }
      } catch (err) {
        console.warn(`Groq (${model}) failed in ATS:`, err.message);
      }
    }
  }

  // 2. Try Gemini with modern supported models (gemini-2.5-flash / gemini-1.5-flash)
  if (geminiApiKey) {
    const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash"];
    const gemini = new GoogleGenerativeAI(geminiApiKey);
    for (const modelName of geminiModels) {
      try {
        const model = gemini.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        });
        const text = result.response.text();
        const parsed = cleanAndParseJSON(text);
        if (parsed && typeof parsed.matchScore === "number") {
          return parsed;
        }
      } catch (err) {
        console.warn(`Gemini (${modelName}) ATS Error:`, err.message);
      }
    }
  }

  // 3. Resilient fallback: intelligent rule-based scanner
  console.log("Using heuristic ATS scanner fallback.");
  return runHeuristicATS(candidateText, jobDescription);
};

exports.analyzeATS = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({ success: false, message: "Job description is required" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Fetch the specific student document (or fallback by id)
    let student = await Student.findOne({ user: userId });
    if (!student) {
      student = await Student.findById(userId);
    }

    // If student record not found, verify if user exists
    if (!student) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Student profile not found" });
      }
      student = {
        skills: [],
        experiences: [],
        projects: [],
      };
    }

    const currentSkills = (student.skills || [])
      .map((s) => (typeof s === "string" ? s : s.skillName || s.name || ""))
      .filter(Boolean)
      .join(", ") || "No explicit skills listed";

    const experiences = (student.experiences || [])
      .map((e) => `${e.role || "Role"} at ${e.companyName || "Company"} ${e.description ? `(${e.description})` : ""}`)
      .join(", ") || "No experience listed";

    const projects = (student.projects || [])
      .map((p) => `${p.title || "Project"} ${p.description ? `(${p.description})` : ""}`)
      .join(", ") || "No projects listed";

    const candidateProfileText = `Skills: ${currentSkills}. Experiences: ${experiences}. Projects: ${projects}.`;

    const prompt = `
You are an advanced Applicant Tracking System (ATS) used by Fortune 500 companies. Your task is to analyze the provided candidate profile against the provided Job Description (JD). 

**Candidate Profile:**
- Known Skills: ${currentSkills}
- Experiences: ${experiences}
- Projects: ${projects}

**Job Description:**
"${jobDescription}"

**Instructions:**
1. Extract the core required skills and technologies from the JD.
2. Compare them strictly with the candidate's profile.
3. Determine a total Match Score (0-100%).
4. List exactly which skills the candidate matched (array of strings).
5. List exactly which critical skills or keywords the candidate is missing (array of strings).
6. Provide brief actionable advice on how the candidate can update their resume to bypass the ATS filter for this specific job.

**Output strictly in JSON format matching this schema:**
{
  "matchScore": 75,
  "matchedKeywords": ["React", "JavaScript", "Problem Solving"],
  "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "CI/CD"],
  "actionableAdvice": "You have a strong frontend base, but this role heavily emphasizes DevOps pipelines. Add Docker and CI/CD keywords to your recent project if you used them, or immediately take a crash course on Kubernetes."
}
`;

    const analysis = await getAIResponse(prompt, candidateProfileText, jobDescription);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};
