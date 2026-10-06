const Student = require("../models/Student");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

// Use same fallback logic as SkillGapAnalysisService for consistency
const getAIResponse = async (prompt) => {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (groqApiKey) {
    const groqModels = [
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile",
    ];
    const groq = new Groq({ apiKey: groqApiKey });
    for (const modelName of groqModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert HR ATS software. Respond strictly in JSON format. Do not use markdown wrappers.",
            },
            { role: "user", content: prompt },
          ],
          model: modelName,
          temperature: 0.3,
          max_tokens: 2048,
          response_format: { type: "json_object" },
        });
        return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
      } catch (err) {
        console.warn(`Groq ATS model ${modelName} failed:`, err.message);
      }
    }
  }

  if (geminiApiKey) {
    const geminiModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
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
        let text = result.response.text();
        if (text.startsWith("```json")) text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        else if (text.startsWith("```")) text = text.replace(/^```/, "").replace(/```$/, "").trim();
        return JSON.parse(text);
      } catch (err) {
        console.warn(`Gemini ATS model ${modelName} failed:`, err.message);
      }
    }
    throw new Error("All Gemini ATS models failed");
  }

  throw new Error("No AI providers configured in .env");
};

exports.analyzeATS = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.user.userId;

    if (!jobDescription) {
      return res.status(400).json({ success: false, message: "Job description is required" });
    }

    // Fetch the specific student document
    const student = await Student.findOne({ user: userId });
    
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const currentSkills = (student.skills || []).map(s => typeof s === 'string' ? s : s.skillName).join(", ") || "No explicit skills listed";
    
    const experiences = (student.experiences || [])
      .map(e => `${e.role} at ${e.companyName}`)
      .join(", ") || "No experience listed";
    
    const projects = (student.projects || [])
      .map(p => p.title)
      .join(", ") || "No projects listed";

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
4. List exactly which skills the candidate matched.
5. List exactly which critical skills or keywords the candidate is missing.
6. Provide brief actionable advice on how the candidate can update their resume to bypass the ATS filter for this specific job.

**Output strictly in JSON format matching this schema:**
{
  "matchScore": 75,
  "matchedKeywords": ["React", "JavaScript", "Problem Solving"],
  "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "CI/CD"],
  "actionableAdvice": "You have a strong frontend base, but this role heavily emphasizes DevOps pipelines. Add Docker and CI/CD keywords to your recent project if you used them, or immediately take a crash course on Kubernetes."
}
`;

    const analysis = await getAIResponse(prompt);

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};
