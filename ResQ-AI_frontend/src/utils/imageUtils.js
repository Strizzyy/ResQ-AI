/**
 * Image utility functions for ResQ-AI
 * Handles Base64 encoding, validation, and compression
 */

/**
 * Convert a File object to Base64 string
 * @param {File} file - Image file to encode
 * @returns {Promise<string>} Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error.message}`));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert Base64 string back to Blob
 * @param {string} base64String - Base64 encoded image
 * @param {string} contentType - MIME type (e.g., 'image/jpeg')
 * @returns {Blob} Blob object
 */
export const base64ToBlob = (base64String, contentType = 'image/jpeg') => {
  // Remove data URL prefix if present
  const base64Data = base64String.split(',')[1] || base64String;
  
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @returns {boolean} True if valid image type
 */
export const isValidImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
};

/**
 * Validate image file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in megabytes (default: 5MB)
 * @returns {boolean} True if within size limit
 */
export const isValidImageSize = (file, maxSizeInMB = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Compress image to reduce file size
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Compressed Base64 string
 */
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Process multiple image files
 * @param {FileList|File[]} files - Array of image files
 * @param {boolean} compress - Whether to compress images (default: true)
 * @returns {Promise<string[]>} Array of Base64 encoded strings
 */
export const processImages = async (files, compress = true) => {
  const fileArray = Array.from(files);
  const validFiles = fileArray.filter(file => 
    isValidImageType(file) && isValidImageSize(file)
  );
  
  if (validFiles.length === 0) {
    throw new Error('No valid images to process');
  }
  
  const promises = validFiles.map(file => 
    compress ? compressImage(file) : fileToBase64(file)
  );
  
  return Promise.all(promises);
};
