/**
 * Confirmation Modal Component - Modern Design
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, X, Sparkles, List } from 'lucide-react';

const ConfirmationModal = ({ success, message, onClose, autoClose = true }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (autoClose && success) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Increased to 5 seconds to give time to click button
      return () => clearTimeout(timer);
    }
  }, [autoClose, success, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8 text-center">
          {success ? (
            <>
              {/* Success State */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-beacon">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-2xl font-black text-gray-900">Report Received!</h2>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-600 font-medium mb-4">{message}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border-2 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-700">
                    Volunteers are being assigned
                  </span>
                </div>
              </div>

              {/* View Task List Button */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/tasks');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 mb-4"
              >
                <List className="w-5 h-5" />
                <span>View Task List</span>
              </button>

              {/* Auto-close Progress Bar */}
              {autoClose && (
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-600 animate-progress"></div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-shake">
                  <XCircle className="w-14 h-14 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 mb-3">Submission Failed</h2>
              <p className="text-gray-600 font-medium mb-6">{message}</p>
              
              <button 
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={onClose}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
