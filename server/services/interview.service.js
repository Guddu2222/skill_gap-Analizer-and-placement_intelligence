const { GoogleGenerativeAI } = require("@google/generative-ai");
const MockInterview = require("../models/MockInterview");
const Student = require("../models/Student");
const SkillGapAnalysis = require("../models/SkillGapAnalysis");
const SkillGapAnalysisService = require("./skillGapAnalysis.service");

class InterviewService {
  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }

  async generateMockInterview(studentId, optionsOrRole) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
      }

      // Handle both string targetRole or config options object
      let options = {};
      if (typeof optionsOrRole === "string") {
        options = { targetRole: optionsOrRole };
      } else if (typeof optionsOrRole === "object") {
        options = optionsOrRole;
      }

      const {
        mode = "PROFILE",
        domain = "Web Development",
        targetRole = "Software Engineer",
        targetTopic = "",
        roundType = "Technical",
        companyStyle = "General",
        difficulty = "Medium",
        questionCount = 5,
      } = options;

      // Fetch student data and latest skill gap analysis for context
      const student = await Student.findById(studentId);
      const latestAnalysis = await SkillGapAnalysis.findOne({
        student: studentId,
        isActive: true,
      }).sort({ createdAt: -1 });

      let weakSkills = "";
      if (latestAnalysis && latestAnalysis.skillsToImprove) {
        weakSkills = latestAnalysis.skillsToImprove
          .map((s) => s.skill)
          .join(", ");
      }

      // Domain Personas Matrix
      const domainPersonas = {
        "Web Development": "Principal Web & Full Stack Architect",
        "Data Science & AI": "Lead Machine Learning Engineer & Data Scientist",
        "Cloud & DevOps": "Senior Cloud Infrastructure & DevOps Specialist",
        Cybersecurity: "Chief Information Security Officer (CISO)",
        "Mobile Development": "Senior Mobile App Lead (iOS/Android)",
        "Software Engineering & DSA": "Senior Technical Architect & Algorithm Lead",
        "General / Soft Skills": "Senior HR & People Lead",
      };

      const persona = domainPersonas[domain] || "Senior Technical Interviewer";
      let prompt = "";

      if (mode === "TOPIC_DRILL") {
        prompt = `
          Act as a ${persona}.
          Conduct a specialized topic drill interview for the domain "${domain}".
          Focus Topic: "${targetTopic || domain}"
          Round Type: "${roundType}"
          Target Company Style: "${companyStyle}"
          Difficulty Level: "${difficulty}"

          Generate exactly ${questionCount} interview questions strictly focused on ${targetTopic || domain}.
          - Include a mix of conceptual depth, practical problem solving, and edge cases.
          - If roundType is "Coding", ensure at least 2 questions are algorithmic or code implementation challenges.

          Return ONLY a JSON array of objects, with no markdown formatting and no extra text.
          Each object must have the following properties:
          - "questionText": The text of the question.
          - "category": "${roundType}",
          - "difficulty": "${difficulty}"
        `;
      } else {
        // Format Experiences & Projects for Profile mode
        const experiences =
          (student?.experiences || [])
            .map((e) => `${e.role} at ${e.companyName} (${e.type})`)
            .join(", ") || "No professional experience listed";

        const projects =
          (student?.projects || [])
            .map((p) => `${p.title} - ${p.description}`)
            .join(", ") || "No specific projects listed";

        prompt = `
          Act as a ${persona} for the role of ${targetRole} within the ${domain} domain.
          The candidate has weak skills needing improvement: ${weakSkills || "General Domain Skills"}.
          
          Candidate Context:
          - Experience: ${experiences}
          - Projects: ${projects}
          
          Generate exactly ${questionCount} interview questions for this candidate. 
          - Include a mix of technical and behavioral questions.
          - AT LEAST ONE question MUST be specifically formulated around ONE of their past "Projects" or "Experience" listed above.
          
          Return ONLY a JSON array of objects, with no markdown formatting and no extra text.
          Each object must have the following properties:
          - "questionText": The text of the question.
          - "category": Either "Technical" or "Behavioral".
          - "difficulty": "${difficulty}"
        `;
      }

      const model = this.gemini.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      });
      const text = result.response.text();

      // Parse JSON
      let questionsData = [];
      try {
        const cleanedText = text
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```\n?/g, "")
          .trim();
        questionsData = JSON.parse(cleanedText);
      } catch (err) {
        console.error("Failed to parse Gemini response as JSON", text);
        throw new Error("Failed to parse Gemini response as JSON");
      }

      // Create MockInterview record
      const mockInterview = new MockInterview({
        student: studentId,
        targetRole: targetRole,
        mode: mode,
        domain: domain,
        targetTopic: targetTopic,
        roundType: roundType,
        companyStyle: companyStyle,
        difficulty: difficulty,
        status: "In Progress",
        questions: questionsData,
      });

      await mockInterview.save();
      return mockInterview;
    } catch (error) {
      console.error("Error in generateMockInterview:", error);
      throw error;
    }
  }

  async evaluateInterviewAnswers(interviewId, studentAnswers, visionMetrics = {}) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
      }

      const interview = await MockInterview.findById(interviewId);
      if (!interview) {
        throw new Error("Interview not found.");
      }

      const evaluations = [];
      let totalScore = 0;

      const model = this.gemini.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      for (const answerData of studentAnswers) {
        const { questionId, studentAnswer, codeSubmitted } = answerData;
        const questionObj = interview.questions.id(questionId);

        if (!questionObj) continue;

        const prompt = `
          Act as a ${interview.domain || "Senior"} Technical Interviewer.
          Domain: "${interview.domain || "General Tech"}"
          Question asked: "${questionObj.questionText}"
          Candidate Spoken/Text Answer: "${studentAnswer || "No verbal answer provided"}"
          ${codeSubmitted ? `Candidate Code Submitted:\n\`\`\`\n${codeSubmitted}\n\`\`\`` : ""}

          Evaluate the candidate's answer. Give a score out of 10.
          
          Provide constructive feedback and an example of an ideal answer. 
          CRITICAL INSTRUCTION: The "feedback" and "idealAnswer" values MUST be clean, professional, plain text paragraphs with NO markdown backticks.
          
          If the score is 6 or less, identify the ONE specific foundational skill (e.g., "React Hooks", "Docker Containers", "SQL Indexing"). If score >= 7, return null for recommendedSkill.

          Return ONLY a JSON object:
          {
            "score": <number between 0 and 10>,
            "feedback": "<plain text paragraph>",
            "idealAnswer": "<plain text paragraph>",
            "recommendedSkill": "<skill string or null>"
          }
        `;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        });
        const text = result.response.text();

        let score = 0;
        let aiFeedback = "Could not evaluate.";
        let idealAnswer = "";
        let recommendedSkill = null;

        try {
          const cleanedText = text
            .replace(/```[a-z]*\n?/gi, "")
            .replace(/```\n?/g, "")
            .trim();
          const evalResult = JSON.parse(cleanedText);
          score = evalResult.score || 0;
          aiFeedback = evalResult.feedback || aiFeedback;
          idealAnswer = evalResult.idealAnswer || idealAnswer;
          recommendedSkill = evalResult.recommendedSkill || null;
        } catch (err) {
          console.error("Failed to parse evaluation JSON", text);
        }

        totalScore += score;
        evaluations.push({
          questionId: questionId,
          studentAnswer: studentAnswer,
          codeSubmitted: codeSubmitted || "",
          aiFeedback: aiFeedback,
          score: score,
          idealAnswer: idealAnswer,
          recommendedSkill: recommendedSkill,
        });
      }

      const technicalCode = Math.round(
        (totalScore / (interview.questions.length * 10)) * 100,
      );
      const postureAlignment = Math.min(
        100,
        Math.max(40, visionMetrics.postureScore || 92),
      );
      const eyeContactGaze = Math.min(
        100,
        Math.max(40, visionMetrics.eyeContactScore || 88),
      );
      const voiceCommunication = Math.round(
        (technicalCode + postureAlignment) / 2,
      );

      // Weighted Multi-Axis Score
      const overallScore = Math.round(
        technicalCode * 0.45 +
          voiceCommunication * 0.25 +
          postureAlignment * 0.15 +
          eyeContactGaze * 0.15,
      );

      // Save Scores
      interview.responses = evaluations;
      interview.scores = {
        technicalCode,
        voiceCommunication,
        postureAlignment,
        eyeContactGaze,
      };
      interview.overallScore = overallScore;
      interview.status = "Completed";
      await interview.save();

      // Auto-generate Learning Paths for failed interview skills
      const recommendedSkills = evaluations
        .map((e) => e.recommendedSkill)
        .filter((skill) => skill !== null && skill !== "");

      if (recommendedSkills.length > 0) {
        const latestAnalysis = await SkillGapAnalysis.findOne({
          student: interview.student,
          isActive: true,
        }).sort({ createdAt: -1 });

        const gapAnalysisId = latestAnalysis ? latestAnalysis._id : null;
        const missingSkillObjects = recommendedSkills.map((skill) => ({
          skill: skill,
          estimated_learning_time: "2 weeks",
        }));

        try {
          await SkillGapAnalysisService.createLearningPaths(
            interview.student,
            gapAnalysisId,
            missingSkillObjects,
          );
        } catch (pathError) {
          console.error("Failed to auto-generate learning paths:", pathError);
        }
      }

      return interview;
    } catch (error) {
      console.error("Error in evaluateInterviewAnswers:", error);
      throw error;
    }
  }
}

module.exports = new InterviewService();
