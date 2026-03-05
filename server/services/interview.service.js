const { GoogleGenerativeAI } = require('@google/generative-ai');
const MockInterview = require('../models/MockInterview');
const Student = require('../models/Student');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const SkillGapAnalysisService = require('./skillGapAnalysis.service');

class InterviewService {
  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async generateMockInterview(studentId, targetRole) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is missing.');
      }

      // Fetch student data and latest skill gap analysis for context
      const student = await Student.findById(studentId);
      const latestAnalysis = await SkillGapAnalysis.findOne({ student: studentId, isActive: true }).sort({ createdAt: -1 });

      let weakSkills = '';
      if (latestAnalysis && latestAnalysis.skillsToImprove) {
        weakSkills = latestAnalysis.skillsToImprove.map(s => s.skill).join(', ');
      }

      // Format Experiences
      const experiences = (student.experiences || []).map(e => 
        `${e.role} at ${e.companyName} (${e.type})`
      ).join(', ') || 'No professional experience listed';

      // Format Projects
      const projects = (student.projects || []).map(p => 
        `${p.title} - ${p.description}`
      ).join(', ') || 'No specific projects listed';

      // Prepare prompt
      const prompt = `
        Act as a senior technical interviewer for the role of ${targetRole}.
        The candidate has a background described by these weak skills they need to improve on: ${weakSkills || 'General skills'}.
        
        The candidate's profile context:
        - Experience: ${experiences}
        - Projects: ${projects}
        
        Generate exactly 5 interview questions for this candidate. 
        - Include a mix of technical and behavioral questions.
        - AT LEAST ONE question MUST be specifically formulated around ONE of their past "Projects" or "Experience" listed above (e.g. asking them about a challenge they faced building a specific project).
        
        Return ONLY a JSON array of objects, with no markdown formatting and no extra text.
        Each object must have the following properties:
        - "questionText": The text of the question.
        - "category": Either "Technical" or "Behavioral".
        - "difficulty": "Easy", "Medium", or "Hard".
        
        Ensure the JSON is perfectly valid. Example format:
        [
          {
            "questionText": "Can you explain closures in JavaScript?",
            "category": "Technical",
            "difficulty": "Medium"
          }
        ]
      `;

      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Attempt to parse JSON
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('Failed to parse Gemini response as JSON');
      }
      
      const questionsData = JSON.parse(text.substring(jsonStart, jsonEnd));

      // Create MockInterview record
      const mockInterview = new MockInterview({
        student: studentId,
        targetRole: targetRole,
        status: 'In Progress',
        questions: questionsData
      });

      await mockInterview.save();
      return mockInterview;

    } catch (error) {
      console.error('Error in generateMockInterview:', error);
      throw error;
    }
  }

  async evaluateInterviewAnswers(interviewId, studentAnswers) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is missing.');
      }

      const interview = await MockInterview.findById(interviewId);
      if (!interview) {
        throw new Error('Interview not found.');
      }

      const evaluations = [];
      let totalScore = 0;

      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });

      // Iterate through answers and get evaluations
      for (const answerData of studentAnswers) {
        const { questionId, studentAnswer } = answerData;
        const questionObj = interview.questions.id(questionId);

        if (!questionObj) continue;

        const prompt = `
          Act as a senior technical interviewer.
          Question asked: "${questionObj.questionText}"
          Candidate's Answer: "${studentAnswer}"

          Evaluate the candidate's answer. Give a score out of 10.
          Also provide constructive feedback and an example of an ideal answer.
          If the score is 6 or less, identify the ONE specific foundational skill or technology they need to study (e.g., "React Hooks", "JavaScript Closures", "SQL Joins"). If the score is 7 or higher, return null for recommendedSkill.

          Return ONLY a JSON object with this exact structure:
          {
            "score": <number between 0 and 10>,
            "feedback": "<constructive feedback here>",
            "idealAnswer": "<a great example of how to answer this>",
            "recommendedSkill": "<specific skill name or null>"
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        
        let score = 0;
        let aiFeedback = "Could not evaluate.";
        let idealAnswer = "";
        let recommendedSkill = null;

        if (jsonStart !== -1 && jsonEnd !== 0) {
          const evalResult = JSON.parse(text.substring(jsonStart, jsonEnd));
          score = evalResult.score;
          aiFeedback = evalResult.feedback;
          idealAnswer = evalResult.idealAnswer;
          recommendedSkill = evalResult.recommendedSkill;
        }

        totalScore += score;
        evaluations.push({
          questionId: questionId,
          studentAnswer: studentAnswer,
          aiFeedback: aiFeedback,
          score: score,
          idealAnswer: idealAnswer,
          recommendedSkill: recommendedSkill
        });
      }

      const overallScore = Math.round((totalScore / (interview.questions.length * 10)) * 100);

      // Extract recommended skills to create learning paths
      const recommendedSkills = evaluations
        .map(e => e.recommendedSkill)
        .filter(skill => skill !== null && skill !== "");

      // Update the interview
      interview.responses = evaluations;
      interview.overallScore = overallScore;
      interview.status = 'Completed';
      await interview.save();

      // "Magic" Integration: Auto-generate Learning Paths for failed interview questions
      if (recommendedSkills.length > 0) {
        // Find latest analysis to attach these paths to, or create dummy ones if none exist
        const latestAnalysis = await SkillGapAnalysis.findOne({ student: interview.student, isActive: true }).sort({ createdAt: -1 });
        
        const gapAnalysisId = latestAnalysis ? latestAnalysis._id : null;
        
        // Format them as expected by the SkillGapAnalysisService
        const missingSkillObjects = recommendedSkills.map(skill => ({
           skill: skill,
           estimated_learning_time: "2 weeks" // default short burst learning for interview failures
        }));

        try {
           console.log(`Auto-generating learning paths for failed interview skills:`, recommendedSkills);
           await SkillGapAnalysisService.createLearningPaths(interview.student, gapAnalysisId, missingSkillObjects);
        } catch (pathError) {
           console.error("Failed to auto-generate learning paths from interview:", pathError);
           // We don't fail the whole evaluation just because the path generation failed
        }
      }

      return interview;

    } catch (error) {
      console.error('Error in evaluateInterviewAnswers:', error);
      throw error;
    }
  }
}

module.exports = new InterviewService();
