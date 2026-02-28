import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  ExternalLink,
  Target
} from 'lucide-react';
import api from '../../services/api'; // Use our api utility instance configured with intercepts

const LearningPathTracker = ({ learningPaths, onUpdate }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      abandoned: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.not_started;
  };

  const updateProgress = async (pathId, progress) => {
    setUpdatingProgress(true);
    try {
      await api.patch(`/skill-gap/learning-paths/${pathId}/progress`, { progress });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const toggleMilestone = async (pathId, milestoneIndex, completed) => {
    try {
      await api.patch(`/skill-gap/learning-paths/${pathId}/progress`, { milestoneIndex, completed });
      
      // Update local state conditionally to avoid full refresh delay if possible
      if (selectedPath && selectedPath._id === pathId) {
         const newPaths = { ...selectedPath };
         newPaths.milestones[milestoneIndex].completed = completed;
         if (completed) newPaths.milestones[milestoneIndex].completedDate = new Date();
         setSelectedPath(newPaths);
      }
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const LearningPathCard = ({ path }) => (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={() => setSelectedPath(path)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            path.status === 'completed' ? 'bg-green-100' :
            path.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <BookOpen className={`w-6 h-6 ${
              path.status === 'completed' ? 'text-green-600' :
              path.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{path.skillName}</h3>
            <p className="text-sm text-gray-500">
              {path.currentLevel || 'none'} → {path.targetLevel}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(path.status)}`}>
          {path.status.replace('_', ' ')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{path.progressPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              path.status === 'completed' ? 'bg-green-500' :
              path.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${path.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones Preview */}
      <div className="flex items-center space-x-2 mb-4">
        {path.milestones?.slice(0, 4).map((milestone, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              milestone.completed 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {milestone.completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
            )}
          </div>
        ))}
        {path.milestones?.length > 4 && (
          <span className="text-xs text-gray-500">+{path.milestones.length - 4} more</span>
        )}
      </div>

      {/* Resources Count */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-600">
          {path.learningResources?.length || 0} resources
        </span>
        {path.estimatedCompletionDate && (
          <span className="text-sm text-gray-600 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(path.estimatedCompletionDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );

  if (!learningPaths || learningPaths.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Learning Paths Yet</h3>
        <p className="text-gray-600">
          Complete a skill gap analysis to get personalized learning paths
        </p>
      </div>
    );
  }

  // Group by status
  const grouped = {
    in_progress: learningPaths.filter(lp => lp.status === 'in_progress'),
    not_started: learningPaths.filter(lp => lp.status === 'not_started'),
    completed: learningPaths.filter(lp => lp.status === 'completed')
  };

  return (
    <div className="space-y-8">
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{grouped.completed.length}</p>
            <p className="text-blue-100 text-sm">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{grouped.in_progress.length}</p>
            <p className="text-blue-100 text-sm">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{grouped.not_started.length}</p>
            <p className="text-blue-100 text-sm">Not Started</p>
          </div>
        </div>
      </div>

      {/* In Progress */}
      {grouped.in_progress.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Play className="w-6 h-6 mr-2 text-blue-600" />
            In Progress ({grouped.in_progress.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.in_progress.map(path => (
              <LearningPathCard key={path._id} path={path} />
            ))}
          </div>
        </div>
      )}

      {/* Not Started */}
      {grouped.not_started.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-gray-600" />
            Not Started ({grouped.not_started.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.not_started.map(path => (
              <LearningPathCard key={path._id} path={path} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {grouped.completed.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Completed ({grouped.completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.completed.map(path => (
              <LearningPathCard key={path._id} path={path} />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPath && (
        <LearningPathDetailModal
          path={selectedPath}
          onClose={() => setSelectedPath(null)}
          onUpdateProgress={updateProgress}
          onToggleMilestone={toggleMilestone}
          updating={updatingProgress}
        />
      )}
    </div>
  );
};

// Learning Path Detail Modal
const LearningPathDetailModal = ({ path, onClose, onUpdateProgress, onToggleMilestone, updating }) => {
  const [localProgress, setLocalProgress] = useState(path.progressPercentage);

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalProgress(value);
  };

  const handleSaveProgress = () => {
    onUpdateProgress(path._id, localProgress);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{path.skillName}</h2>
              <p className="text-blue-100">
                Current: {path.currentLevel || 'none'} → Target: {path.targetLevel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Control */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Update Progress</span>
              <span className="text-2xl font-bold">{localProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={localProgress}
              onChange={handleProgressChange}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setLocalProgress(Math.max(0, localProgress - 10))}
                className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
              >
                -10%
              </button>
              <button
                onClick={handleSaveProgress}
                disabled={updating || localProgress === path.progressPercentage}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Saving...' : 'Save Progress'}
              </button>
              <button
                onClick={() => setLocalProgress(Math.min(100, localProgress + 10))}
                className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
              >
                +10%
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {/* Milestones */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Milestones</h3>
            <div className="space-y-3">
              {path.milestones?.map((milestone, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    milestone.completed 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleMilestone(path._id, index, !milestone.completed)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        milestone.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {milestone.completed && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        milestone.completed ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {milestone.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        milestone.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        {milestone.dueDate && (
                          <span className={milestone.completed ? 'text-green-600' : 'text-gray-500'}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {milestone.completed && milestone.completedDate && (
                          <span className="text-green-600">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {path.learningResources?.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded">{resource.platform}</span>
                    {resource.duration && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.duration}
                      </span>
                    )}
                    {resource.price && (
                      <span className={`px-2 py-1 rounded ${
                        resource.price.toLowerCase() === 'free' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {resource.price}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathTracker;
