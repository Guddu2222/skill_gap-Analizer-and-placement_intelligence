const { GoogleGenerativeAI } = require('@google/generative-ai');
const Student = require('../models/Student');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const DomainSkillRequirement = require('../models/DomainSkillRequirement');
const SkillLearningPath = require('../models/SkillLearningPath');

class SkillGapAnalysisService {
  constructor() {
    // Initialize AI client using the environment variable
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  // Main Analysis Function
  async analyzeSkillGap(studentId, targetDomain, targetRole = null) {
    try {
      console.log(`Analyzing skill gap for student: ${studentId}, domain: ${targetDomain}`);

      // 1. Get student's current profile and skills
      // Using Mongoose populate to resolve references if any (e.g. experiences/skills/projects which are embedded/referenced in Student)
      const student = await Student.findById(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // 2. Get domain requirements from database
      const domainRequirements = await this.getDomainRequirements(targetDomain, targetRole);

      // 3. Prepare data for AI analysis
      const analysisPrompt = this.prepareAnalysisPrompt(student, domainRequirements, targetDomain, targetRole);

      // 4. Get AI analysis
      const aiAnalysisRaw = await this.analyzeWithGemini(analysisPrompt);

      // 5. Parse and structure the analysis
      const structuredAnalysis = this.parseAIResponse(aiAnalysisRaw);

      // 6. Calculate readiness score
      const readinessScore = this.calculateReadinessScore(student.skills || [], domainRequirements);

      // 7. Get learning resources
      const learningResources = await this.getRecommendedResources(structuredAnalysis.missing_skills || []);

      // 8. Invalidate previous active analyses for this student/domain
      await SkillGapAnalysis.updateMany(
        { student: studentId, isActive: true }, 
        { $set: { isActive: false } }
      );

      // 9. Save new analysis to database
      const savedAnalysis = await SkillGapAnalysis.create({
        student: studentId,
        targetDomain: targetDomain,
        targetRole: targetRole,
        currentSkills: (student.skills || []).map(s => ({
          skill: s.skillName || s, // Handle string or object structure
          proficiency: s.proficiency || 'beginner',
          years: s.years || 0
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
        isActive: true
      });

      // 10. Create learning paths for missing skills
      await this.createLearningPaths(studentId, savedAnalysis._id, structuredAnalysis.missing_skills || []);

      return {
        success: true,
        analysis: savedAnalysis,
        insights: structuredAnalysis
      };

    } catch (error) {
      console.error('Skill gap analysis error:', error);
      throw error;
    }
  }

  // Prepare AI Prompt
  prepareAnalysisPrompt(student, domainRequirements, targetDomain, targetRole) {
    const formatSkills = (skillsArray) => {
      if (!skillsArray || skillsArray.length === 0) return 'No skills listed';
      return skillsArray.map(s => {
         if (typeof s === 'string') return s;
         return `${s.skillName} (${s.proficiencyLevel || 'beginner'})`;
      }).join(', ');
    }

    const currentSkills = formatSkills(student.skills);
    
    // Fallback logic for nested fields arrays if they exist in schema
    const experiences = (student.experiences || []).map(e => 
      `${e.role} at ${e.companyName} (${e.type})`
    ).join(', ') || 'No experience listed';

    const projects = (student.projects || []).map(p => 
      `${p.title} - ${p.description}`
    ).join(', ') || 'No projects listed';

    return `
You are an expert career counselor and technical recruiter specializing in ${targetDomain}.

**Student Profile:**
- Name: ${student.firstName || ''} ${student.lastName || ''}
- Department: ${student.department || 'Unknown'}
- CGPA: ${student.cgpa || 'N/A'}/10
- Graduation Year: ${student.graduationYear || 'Unknown'}

**Current Skills:**
${currentSkills}

**Experience:**
${experiences}

**Projects:**
${projects}

**Target Domain:** ${targetDomain}
**Target Role:** ${targetRole || 'Entry-level position'}

**Required Skills for ${targetDomain} (${targetRole || 'Entry-level'}):**
Core Skills: ${(domainRequirements.coreSkills || []).map(s => s.skill).join(', ') || 'General Domain Knowledge'}
Preferred Skills: ${(domainRequirements.preferredSkills || []).map(s => s.skill).join(', ') || 'None specified'}
Nice-to-have: ${(domainRequirements.niceToHaveSkills || []).map(s => s.skill).join(', ') || 'None specified'}

**Task:**
Analyze this student's readiness for a ${targetRole || 'entry-level'} role in ${targetDomain} and provide:

1. **Skill Gap Analysis**: Identify missing critical skills
2. **Skills to Improve**: Current skills that need advancement
3. **Strong Skills**: Skills where the student excels
4. **Market Readiness Score**: 0-100 score of job readiness based on their profile data
5. **Priority Recommendations**: Top 3-5 skills to focus on immediately
6. **Learning Timeline**: Estimated weeks to become job-ready
7. **Career Advice**: Personalized guidance based on their profile

**Output Format (Strict JSON):**
{
  "summary": "Brief overall assessment",
  "readiness_score": 75,
  "market_score": 80,
  "missing_skills": [
    {
      "skill": "skill name",
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
  "career_advice": "Personalized guidance and next steps",
  "competitive_advantages": ["What makes this student stand out"],
  "red_flags": ["Concerns or gaps to address urgently"]
}

Respond ONLY with valid JSON. Do not wrap in markdown tags like \`\`\`json. Be specific, actionable, and encouraging. Focus on realistic timelines and achievable goals.
`;
  }

  // Gemini API Integration
  async analyzeWithGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using mock AI response for development.");
      return this.getMockGeminiResponse();
    }

    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Use flash for speed, 1.5-pro for complex reasonining
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });

      const response = result.response;
      let text = response.text();
      return text;
    } catch (error) {
      console.error('Gemini API error. Falling back to mock:', error);
      return this.getMockGeminiResponse(error.message || 'Unknown API Error');
    }
  }

  // Parse AI Response
  parseAIResponse(aiResponseRaw) {
    try {
      // Clean string if the AI ignores instructions and wraps in markdown
      let cleanJsonString = aiResponseRaw.trim();
      if (cleanJsonString.startsWith('```json')) {
         cleanJsonString = cleanJsonString.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanJsonString.startsWith('```')) {
         cleanJsonString = cleanJsonString.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(cleanJsonString);
      return parsed;
    } catch (error) {
      console.error('Error parsing AI response:', error, '\\nRaw string:', aiResponseRaw);
      
      // Return a safe default structure to prevent app crash
      return {
        summary: "We couldn't generate a detailed summary at this time.",
        readiness_score: 50,
        market_score: 50,
         missing_skills: [{
           skill: "General Problem Solving",
           priority: "high",
           reasoning: "Always a critical gap",
           difficulty: "medium",
           estimated_learning_time: "4 weeks"
         }],
        skills_to_improve: [],
        strong_skills: [],
        priority_learning_path: [],
        estimated_weeks: 4,
        career_advice: "Keep learning and building projects!"
      };
    }
  }

  // Calculate Readiness Score
  calculateReadinessScore(studentSkills, domainRequirements) {
    let score = 0;
    let totalWeight = 0;

    const studentSkillsFlat = studentSkills.map(s => 
      typeof s === 'string' ? s.toLowerCase() : (s.skillName ? s.skillName.toLowerCase() : '')
    );

    // Check core skills
    if (domainRequirements.coreSkills && domainRequirements.coreSkills.length > 0) {
      domainRequirements.coreSkills.forEach(reqSkill => {
        totalWeight += reqSkill.weight || 10;
        
        const hasSkill = studentSkillsFlat.includes(reqSkill.skill.toLowerCase());

        if (hasSkill) {
          score += (reqSkill.weight || 10); // Simplified scoring since proficiency is harder to normalize without strict enums
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
      'Software Engineer': {
        coreSkills: [
          { skill: 'Data Structures & Algorithms', weight: 15, minProficiency: 'intermediate' },
          { skill: 'Object-Oriented Programming', weight: 12, minProficiency: 'intermediate' },
          { skill: 'Git', weight: 8, minProficiency: 'beginner' },
          { skill: 'SQL', weight: 10, minProficiency: 'beginner' }
        ],
        preferredSkills: [
          { skill: 'JavaScript', weight: 10 },
          { skill: 'Python', weight: 10 },
          { skill: 'Java', weight: 10 },
          { skill: 'React', weight: 8 },
          { skill: 'Node.js', weight: 8 }
        ]
      },
      'Data Scientist': {
        coreSkills: [
          { skill: 'Python', weight: 15, minProficiency: 'intermediate' },
          { skill: 'Statistics', weight: 15, minProficiency: 'intermediate' },
          { skill: 'Machine Learning', weight: 15, minProficiency: 'beginner' },
          { skill: 'SQL', weight: 10, minProficiency: 'intermediate' }
        ],
        preferredSkills: [
          { skill: 'Pandas', weight: 10 },
          { skill: 'NumPy', weight: 10 },
          { skill: 'Scikit-learn', weight: 10 }
        ]
      }
    };

    // Default to Software Engineer if domain not found in mocks
    const result = defaultRequirements[domain] || defaultRequirements['Software Engineer'];
    return { domain, role, ...result };
  }

  // Get Learning Resources
  async getRecommendedResources(missingSkills) {
    const courses = [];
    const certifications = [];

    // Simple mock db logic identical to user's implementation
    const resourceDatabase = {
      'JavaScript': {
        courses: [
          { title: 'JavaScript - The Complete Guide', platform: 'Udemy', url: 'https://udemy.com/', duration: '40 hours', price: 'Paid' },
        ],
        certifications: [
          { name: 'Meta Front-End Developer', issuer: 'Meta', url: 'https://coursera.org/' }
        ]
      },
      'React': {
         courses: [
           { title: 'React.dev Documentation', platform: 'Official Docs', url: 'https://react.dev/learn', duration: '20 hours', price: 'Free' }
         ]
      }
      // Add more as needed...
    };

    missingSkills.forEach(skillObj => {
      const skillName = skillObj.skill;
      // Very basic substring match
      const key = Object.keys(resourceDatabase).find(k => skillName.toLowerCase().includes(k.toLowerCase()));
      
      if (key && resourceDatabase[key]) {
        if(resourceDatabase[key].courses) courses.push(...resourceDatabase[key].courses);
        if(resourceDatabase[key].certifications) certifications.push(...resourceDatabase[key].certifications);
      }
    });

    // Fallbacks if nothing matched
    if (courses.length === 0) {
      courses.push(
        { title: 'freeCodeCamp (General Concepts)', platform: 'freeCodeCamp', url: 'https://freecodecamp.org', duration: 'Self-paced', price: 'Free' }
      );
    }

    return {
      courses: courses.slice(0, 5),
      certifications: certifications.slice(0, 3)
    };
  }

  // Create Learning Paths
  async createLearningPaths(studentId, gapAnalysisId, missingSkills) {
    const learningPaths = [];

    for (const skillObj of missingSkills) {
      if(!skillObj.skill) continue; // Skip malformed 
      
      const resources = await this.getRecommendedResources([{skill: skillObj.skill}]);
      
      const estimatedWeeks = parseInt(skillObj.estimated_learning_time) || 4;
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + (estimatedWeeks * 7));

      const learningPath = await SkillLearningPath.create({
        student: studentId,
        gapAnalysis: gapAnalysisId,
        skillName: skillObj.skill,
        currentLevel: 'none',
        targetLevel: 'intermediate',
        learningResources: resources.courses.map(r => ({ type: 'course', ...r })),
        milestones: this.generateMilestones(skillObj.skill, estimatedWeeks),
        progressPercentage: 0,
        status: 'not_started',
        estimatedCompletionDate: estimatedDate
      });

      learningPaths.push(learningPath);
    }

    return learningPaths;
  }

  generateMilestones(skill, weeks) {
    const milestones = [];
    const totalMilestones = Math.min(Math.max(1, weeks), 8); // 1-8 milestones

    for (let i = 1; i <= totalMilestones; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i * 7));

      milestones.push({
        title: `Week ${i}: Learn ${skill} Basics`,
        description: `Complete required readings and tutorials for ${skill} phase ${i}`,
        completed: false,
        dueDate: dueDate
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
          { "skill": "React", "priority": "high", "reasoning": "Standard for frontend", "difficulty": "medium", "estimated_learning_time": "4 weeks" },
          { "skill": "Node.js", "priority": "high", "reasoning": "Standard for backend", "difficulty": "medium", "estimated_learning_time": "4 weeks" }
        ],
        "skills_to_improve": [],
        "strong_skills": [],
        "priority_learning_path": ["Learn React", "Learn Node"],
        "estimated_weeks": 8,
        "career_advice": "Configure the GEMINI_API_KEY in the backend .env or verify its validity.",
        "red_flags": []
      }`;
  }
}

module.exports = new SkillGapAnalysisService();
