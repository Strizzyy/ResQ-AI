/**
 * Task Item Component - Modern Design with Tailwind
 */

import { MapPin, Users, AlertCircle, Clock, ChevronDown } from 'lucide-react';

const TaskItem = ({ task, isExpanded, onClick, animationDelay = 0 }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50/50';
      case 'high':
        return 'border-orange-500 bg-orange-50/50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50/50';
      case 'low':
        return 'border-blue-500 bg-blue-50/50';
      default:
        return 'border-gray-500 bg-gray-50/50';
    }
  };

  const getPriorityBadgeStyles = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div 
      className={`group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border-l-4 ${getPriorityStyles(task.priority)} transition-all duration-300 hover:-translate-y-1 animate-slide-up overflow-hidden`}
      onClick={onClick}
      style={{ animationDelay: `${animationDelay}s` }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-expanded={isExpanded}
    >
      {/* Task Summary */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">{task.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityBadgeStyles(task.priority)} whitespace-nowrap`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{task.location.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{task.assignedVolunteers}/{task.requiredVolunteers} volunteers</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{formatTimeAgo(task.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Task Details - Expanded */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-6 animate-slide-up">
          {/* Description */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <AlertCircle className="w-4 h-4" />
              Description
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Location Details */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <MapPin className="w-4 h-4" />
              Location Details
            </h4>
            <p className="text-sm text-gray-700">{task.location.address}</p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
            </p>
          </div>

          {/* Required Skills */}
          {task.skillRequirements && task.skillRequirements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {task.skillRequirements.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Volunteer Progress */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <Users className="w-4 h-4" />
              Volunteer Status
            </h4>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${(task.assignedVolunteers / task.requiredVolunteers) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {task.assignedVolunteers} of {task.requiredVolunteers} volunteers assigned
              </p>
            </div>
          </div>

          {/* Time Window */}
          {task.timeWindow && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Clock className="w-4 h-4" />
                Time Window
              </h4>
              <p className="text-sm text-gray-700">
                {new Date(task.timeWindow.start).toLocaleString()} - {new Date(task.timeWindow.end).toLocaleString()}
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
            <span className="text-xs font-bold text-gray-600">Status:</span>
            <span className="text-xs font-bold text-gray-900 capitalize">{task.status}</span>
          </div>
        </div>
      )}

      {/* Expand Indicator */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2">
        <span className="text-xs font-semibold text-gray-600">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
    </div>
  );
};

export default TaskItem;
