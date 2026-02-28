import React from 'react';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Star,
  Zap,
  Trophy
} from 'lucide-react';

const SkillGapOverview = ({ analysis, student, onReanalyze }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Available</h3>
        <p className="text-gray-600 mb-6">
          Start your skill gap analysis to get personalized recommendations
        </p>
        <button 
          onClick={onReanalyze}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Start Analysis</span>
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[priority?.toLowerCase()] || colors.medium;
  };

  const getReadinessLevel = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const readinessLevel = getReadinessLevel(analysis.overallReadinessScore || 0);

  return (
    <div className="space-y-6">
      {/* Readiness Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Career Readiness Score</h2>
            </div>
            <div className="flex items-end space-x-4 mb-4">
              <span className="text-6xl font-bold">{analysis.overallReadinessScore || 0}</span>
              <span className="text-3xl font-semibold mb-2">/100</span>
            </div>
            <p className="text-blue-100 mb-4">{analysis.analysisSummary}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold ${readinessLevel.bg} ${readinessLevel.color}`}>
                {readinessLevel.text}
              </span>
              <span className="text-sm text-blue-200">
                Target: {analysis.targetDomain} {analysis.targetRole && `- ${analysis.targetRole}`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <button 
              onClick={onReanalyze}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Reanalyze</span>
            </button>
            <p className="text-sm text-blue-200 mt-2">
              Last updated: {new Date(analysis.updatedAt || analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${analysis.overallReadinessScore || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missing Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Missing Skills</h3>
              <p className="text-sm text-gray-500">Skills you need to learn</p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.missingSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(skill.priority)}`}>
                    {skill.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{skill.reasoning}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {skill.estimatedLearningTime}
                  </span>
                  <span className="capitalize">{skill.difficulty}</span>
                </div>
              </div>
            ))}
            {!analysis.missingSkills?.length && <p className="text-gray-500 italic text-sm">No critical missing skills identified.</p>}
          </div>

          {analysis.missingSkills?.length > 5 && (
            <button className="w-full mt-4 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all">
              View All {analysis.missingSkills.length} Skills
            </button>
          )}
        </div>

        {/* Skills to Improve */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Skills to Improve</h3>
              <p className="text-sm text-gray-500">Level up your existing skills</p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.skillsToImprove?.slice(0, 5).map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    Current: {skill.currentLevel}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    Target: {skill.requiredLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{skill.reasoning}</p>
              </div>
            ))}
            {!analysis.skillsToImprove?.length && <p className="text-gray-500 italic text-sm">You are proficient in your current skills.</p>}
          </div>

          {analysis.skillsToImprove?.length > 5 && (
            <button className="w-full mt-4 px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all">
              View All {analysis.skillsToImprove.length} Skills
            </button>
          )}
        </div>

        {/* Strong Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">Strong Skills</h3>
              <p className="text-sm text-gray-500">Your competitive advantages</p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.strongSkills?.slice(0, 5).map((skill, index) => (
              <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">
                    {skill.strengthLevel}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    skill.marketDemand?.toLowerCase() === 'high' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {skill.marketDemand} demand
                  </span>
                </div>
                <p className="text-sm text-gray-700">{skill.leverageAdvice}</p>
              </div>
            ))}
             {!analysis.strongSkills?.length && <p className="text-gray-500 italic text-sm">Keep practicing your skills to build mastery.</p>}
          </div>

          {analysis.strongSkills?.length > 5 && (
            <button className="w-full mt-4 px-4 py-2 border-2 border-green-200 bg-green-50 rounded-lg text-green-700 font-semibold hover:bg-green-100 transition-all">
              View All {analysis.strongSkills.length} Skills
            </button>
          )}
        </div>
      </div>

      {/* Learning Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Estimated Timeline to Job Ready</h3>
              <p className="text-sm text-gray-500">Based on your current skills and target role</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">{analysis.estimatedTimeToReady || 0}</p>
            <p className="text-sm text-gray-500">weeks</p>
          </div>
        </div>

        {/* Priority Learning Path */}
        {analysis.priorityLearningPath?.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recommended Learning Path:</h4>
            <div className="space-y-3">
              {analysis.priorityLearningPath.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Career Advice */}
      {analysis.careerAdvice && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Personalized Career Advice</h3>
              <p className="text-indigo-100 leading-relaxed">{analysis.careerAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapOverview;
