/**
 * Image Uploader Component - Modern Design
 */

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { processImages, isValidImageType, isValidImageSize } from '../utils/imageUtils';

const ImageUploader = ({ images, onChange, maxImages = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    setError('');

    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const fileArray = Array.from(files);
    const invalidType = fileArray.find(file => !isValidImageType(file));
    if (invalidType) {
      setError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images');
      return;
    }

    const invalidSize = fileArray.find(file => !isValidImageSize(file, 5));
    if (invalidSize) {
      setError('File size too large. Maximum 5MB per image');
      return;
    }

    try {
      const base64Images = await processImages(fileArray, true);
      onChange([...images, ...base64Images]);
    } catch (err) {
      console.error('Failed to process images:', err);
      setError('Failed to process images. Please try again');
    }
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    setError('');
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative group cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'scale-[1.02] shadow-2xl' 
            : 'hover:scale-[1.01] hover:shadow-xl'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        
        <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-dashed rounded-3xl p-16 transition-all duration-300 ${
          isDragging 
            ? 'border-blue-600 bg-blue-100 shadow-2xl' 
            : 'border-blue-300 group-hover:border-blue-500 group-hover:shadow-xl'
        }`}>
          {/* Animated Background Shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Decorative Circles */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl"></div>
          
          <div className="relative flex flex-col items-center gap-6 text-center">
            {/* Upload Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Upload className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-2">
              <p className="text-xl font-black text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Click to upload</span>
                <span className="text-gray-700"> or drag and drop</span>
              </p>
              <p className="text-base text-gray-600 font-semibold">
                JPEG, PNG, WebP, GIF (max 5MB each)
              </p>
            </div>
            
            {/* Image Counter Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border-2 border-blue-200 shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-base font-black text-blue-700">
                {images.length} / {maxImages} images
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-red-700">{error}</span>
        </div>
      )}

      {/* Image Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 border-white"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <img 
                src={image} 
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
