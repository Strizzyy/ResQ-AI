/**
 * Task List Page - Modern Design with Tailwind
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchTasks } from '../services/apiService';
import { AlertTriangle, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import TaskItem from '../components/TaskItem';

const TaskListPage = () => {
  const { isOnline } = useApp();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchTasks({ status: 'active', limit: 50 });
      setTasks(response.tasks);
      setLastUpdated(response.lastUpdated);
      
      if (isOnline) {
        localStorage.setItem('cachedTasks', JSON.stringify(response.tasks));
        localStorage.setItem('cachedTasksTimestamp', response.lastUpdated.toString());
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      
      if (!isOnline) {
        const cachedTasks = localStorage.getItem('cachedTasks');
        const cachedTimestamp = localStorage.getItem('cachedTasksTimestamp');
        
        if (cachedTasks) {
          setTasks(JSON.parse(cachedTasks));
          setLastUpdated(parseInt(cachedTimestamp));
          setError('Showing cached tasks (offline mode)');
        } else {
          setError('Unable to load tasks. Please check your connection.');
        }
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-700">Back to Report</span>
            </Link>

            <button 
              onClick={loadTasks}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-semibold text-gray-700">Refresh</span>
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-2xl mb-6 animate-beacon">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Active Tasks</span>
            </h1>
            
            <p className="text-lg text-gray-600 font-medium">
              Dynamically allocated volunteer assignments
            </p>
          </div>
        </div>

        {/* Status Banners */}
        {!isOnline && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl animate-slide-up">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-orange-700">Offline Mode - Showing cached tasks</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-slide-up">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-yellow-700">{error}</span>
          </div>
        )}

        {/* Task Count */}
        {!isLoading && tasks.length > 0 && (
          <div className="mb-6 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 animate-slide-up">
            <span className="text-lg font-bold text-gray-900">
              {tasks.length} active task{tasks.length !== 1 ? 's' : ''}
            </span>
            {lastUpdated && (
              <span className="text-sm font-medium text-gray-500">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-gray-600">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Tasks</h2>
            <p className="text-gray-600">There are currently no tasks available.</p>
          </div>
        ) : (
          /* Task List */
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={expandedTaskId === task.id}
                onClick={() => handleTaskClick(task.id)}
                animationDelay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;
