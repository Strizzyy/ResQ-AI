/**
 * Report Submission Page - Modern Emergency Response Interface
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submitReport } from '../services/apiService';
import { queueReport } from '../services/offlineService';
import { validateReport } from '../utils/validators';
import ImageUploader from '../components/ImageUploader';
import ConfirmationModal from '../components/ConfirmationModal';
import { Video, Send, AlertTriangle, Image as ImageIcon, FileText, Wifi, WifiOff, List } from 'lucide-react';

const ReportSubmissionPage = () => {
  const { isOnline, setQueuedReportsCount } = useApp();
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    setValidationError('');
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateReport({ images, description });
    if (!validation.isValid) {
      setValidationError(validation.errors[0]);
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      const reportData = {
        images: images.length > 0 ? images : [],
        description: description.trim(),
        timestamp: Date.now(),
        location: null
      };

      if (isOnline) {
        const response = await submitReport(reportData);
        setConfirmationData({
          success: true,
          message: 'Your report has been received by authorities',
          reportId: response.reportId
        });
      } else {
        await queueReport(reportData);
        setQueuedReportsCount(prev => prev + 1);
        setConfirmationData({
          success: true,
          message: 'Your report has been saved and will be sent when connection is restored',
          reportId: reportData.id
        });
      }

      setShowConfirmation(true);
      setImages([]);
      setDescription('');
      
    } catch (error) {
      console.error('Failed to submit report:', error);
      setConfirmationData({
        success: false,
        message: 'Failed to submit report. Please try again.',
        error: error.message
      });
      setShowConfirmation(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationData(null);
  };

  const isFormValid = images.length > 0 || description.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* View Task List Button - Top Right */}
        <div className="flex justify-end mb-6 animate-slide-up">
          <Link 
            to="/tasks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 group"
          >
            <List className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gray-900">View Task List</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-2xl mb-6 animate-beacon">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">ResQ</span>
            <span className="text-gray-900">-AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Emergency Response System
          </p>

          {/* Status Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-700">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">Offline Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-slide-up" style={{animationDelay: '0.1s'}}>
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Visual Evidence</h2>
                    <p className="text-sm text-gray-500">Upload photos of the emergency</p>
                  </div>
                </div>
                <ImageUploader 
                  images={images}
                  onChange={handleImagesChange}
                  maxImages={10}
                />
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Video Recording</h2>
                    <p className="text-sm text-gray-500">Capture video footage</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  onClick={() => {/* Video upload */}}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Video className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-lg font-semibold text-purple-700">Record or Upload Video</span>
                  </div>
                </button>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Incident Details</h2>
                    <p className="text-sm text-gray-500">Describe what happened</p>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="description"
                    className="w-full px-6 py-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 font-medium"
                    placeholder="Provide detailed information about the emergency situation..."
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={6}
                    maxLength={1000}
                    disabled={isSubmitting}
                  />
                  <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-400">
                    {description.length} / 1000
                  </div>
                </div>
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-red-700">{validationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-2xl transition-all duration-300 ${
                  isSubmitting || !isFormValid 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-red-500/50 hover:-translate-y-1 active:translate-y-0'
                }`}
                disabled={isSubmitting || !isFormValid}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting Report...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Submit Emergency Report</span>
                    </>
                  )}
                </div>
              </button>

              {!isFormValid && (
                <p className="text-center text-sm text-gray-500 font-medium">
                  Please provide at least one photo or description
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && confirmationData && (
        <ConfirmationModal
          success={confirmationData.success}
          message={confirmationData.message}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export default ReportSubmissionPage;
